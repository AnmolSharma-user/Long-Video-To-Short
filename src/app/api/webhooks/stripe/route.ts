import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function updateUserCredits(userId: string, credits: number) {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const currentCredits = userDoc.data().credits || 0;
    await updateDoc(userRef, {
      credits: currentCredits + credits,
      updatedAt: new Date(),
    });

    // Create a credits history record
    const creditsHistoryRef = doc(db, "credits_history", `${userId}_${Date.now()}`);
    await updateDoc(creditsHistoryRef, {
      userId,
      amount: credits,
      type: "purchase",
      createdAt: new Date(),
    });

    return true;
  } catch (error) {
    console.error("Error updating user credits:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        if (!metadata?.userId || !metadata?.credits) {
          console.error("Missing metadata in session:", session.id);
          return NextResponse.json(
            { error: "Missing metadata" },
            { status: 400 }
          );
        }

        const success = await updateUserCredits(
          metadata.userId,
          parseInt(metadata.credits)
        );

        if (!success) {
          console.error("Failed to update user credits:", session.id);
          return NextResponse.json(
            { error: "Failed to update credits" },
            { status: 500 }
          );
        }

        // Create a purchase record
        const purchaseRef = doc(db, "purchases", session.id);
        await updateDoc(purchaseRef, {
          userId: metadata.userId,
          amount: session.amount_total,
          credits: parseInt(metadata.credits),
          planName: metadata.planName,
          paymentStatus: session.payment_status,
          createdAt: new Date(),
        });

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error("Payment failed:", paymentIntent.id);
        
        // You could notify the user here via email or in-app notification
        break;
      }

      default: {
        console.log(`Unhandled event type: ${event.type}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}