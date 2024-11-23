import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";
import { pricingPlans } from "@/lib/constants/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { priceId } = body;

    // Find the plan
    const plan = pricingPlans.find(
      (p) => p.stripePriceId === priceId
    );

    if (!plan) {
      return NextResponse.json(
        { error: "Invalid price ID." },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      customer_creation: "always",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${plan.name} Credits`,
              description: `${plan.credits} video processing credits`,
              images: [
                `${process.env.NEXT_PUBLIC_APP_URL}/images/credits-${plan.name.toLowerCase()}.png`,
              ],
            },
            unit_amount: plan.price * 100, // Convert to paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: session.user.id,
        credits: plan.credits.toString(),
        planName: plan.name,
      },
      payment_intent_data: {
        metadata: {
          userId: session.user.id,
          credits: plan.credits.toString(),
          planName: plan.name,
        },
      },
    } as Stripe.Checkout.SessionCreateParams);

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "No session ID provided." },
        { status: 400 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "customer"],
    });

    return NextResponse.json({
      status: checkoutSession.status,
      payment_status: checkoutSession.payment_status,
      amount_total: checkoutSession.amount_total,
      metadata: checkoutSession.metadata,
    });
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return NextResponse.json(
      { error: "Failed to retrieve checkout session." },
      { status: 500 }
    );
  }
}