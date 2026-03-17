import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const PRICE_CENTS = 1000; // $10.00

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify auth
    const authHeader = req.headers.get("Authorization")!;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { system_id, system_name } = await req.json();
    if (!system_id || !system_name) {
      return new Response(
        JSON.stringify({ error: "system_id and system_name are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if user already owns this system
    const { data: profile } = await supabase
      .from("profiles")
      .select("systems_unlocked")
      .eq("id", user.id)
      .single();

    const unlocked = profile?.systems_unlocked || [];
    if (unlocked.includes(system_id)) {
      return new Response(
        JSON.stringify({ error: "You already own this system" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Determine the origin for redirect URLs
    const origin =
      req.headers.get("origin") || req.headers.get("referer")?.replace(/\/[^/]*$/, "") || "http://localhost:3000";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        system_id: system_id,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: PRICE_CENTS,
            product: Deno.env.get("STRIPE_PRODUCT_ID") || "prod_UA7vqnlbzXaMdW",
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/app.html?purchase=success`,
      cancel_url: `${origin}/app.html`,
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
