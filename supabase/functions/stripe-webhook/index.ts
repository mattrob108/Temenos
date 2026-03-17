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
    const systemId = session.metadata?.system_id;

    if (userId && systemId) {
      // Record the purchase
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
        .select("systems_unlocked")
        .eq("id", userId)
        .single();

      const current = profile?.systems_unlocked || [];
      if (!current.includes(systemId)) {
        current.push(systemId);
        await supabase
          .from("profiles")
          .update({ systems_unlocked: current })
          .eq("id", userId);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
