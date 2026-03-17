import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

// Use service role key so we can update any user's profile
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    return new Response(`Webhook signature verification failed: ${err.message}`, {
      status: 400,
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;

    if (session.mode === "subscription" && userId) {
      // Subscription checkout — upgrade to Initiate
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      await supabase
        .from("profiles")
        .update({
          plan: "initiate",
          stripe_customer_id: customerId || null,
          stripe_subscription_id: subscriptionId || null,
        })
        .eq("id", userId);
    }

    const systemId = session.metadata?.system_id;
    if (session.mode === "payment" && userId && systemId) {
      // One-time system purchase
      await supabase.from("purchases").insert({
        user_id: userId,
        system_id: systemId,
        stripe_session_id: session.id,
        amount_cents: session.amount_total,
        currency: session.currency,
      });

      // Add the system to the user's unlocked list
      const { data: profile } = await supabase
        .from("profiles")
        .select("systems_unlocked, plan")
        .eq("id", userId)
        .single();

      const current = profile?.systems_unlocked || [];
      if (!current.includes(systemId)) {
        current.push(systemId);
        const ALL_PURCHASABLE = [
          "enneagram",
          "mbti",
          "numerology",
          "ifs",
          "arch",
          "custom",
        ];
        const hasAll = ALL_PURCHASABLE.every((id) => current.includes(id));
        const updates: Record<string, unknown> = { systems_unlocked: current };
        // Auto-upgrade to Proficient if all systems + custom node unlocked
        if (hasAll && profile?.plan === "initiate") {
          updates.plan = "proficient";
        }
        await supabase.from("profiles").update(updates).eq("id", userId);
      }
    }
  }

  // Handle subscription cancellation/expiry
  if (
    event.type === "customer.subscription.deleted" ||
    event.type === "customer.subscription.updated"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id;

    if (customerId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, plan")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile) {
        if (
          event.type === "customer.subscription.deleted" ||
          (event.type === "customer.subscription.updated" &&
            subscription.status !== "active" &&
            subscription.status !== "trialing")
        ) {
          // Downgrade to explorer if subscription is no longer active
          if (profile.plan === "initiate") {
            await supabase
              .from("profiles")
              .update({ plan: "explorer", stripe_subscription_id: null })
              .eq("id", profile.id);
          }
        }
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
