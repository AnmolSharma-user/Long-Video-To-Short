"use client";

import { useSession } from "next-auth/react";
import { InteractiveButton } from "@/components/ui/interactive-button";
import { useToast } from "@/components/ui/use-toast";

interface PricingPlan {
  name: string;
  credits: number;
  price: number;
  features: string[];
  popular: boolean;
}

interface PricingClientProps {
  plans: PricingPlan[];
}

export default function PricingClient({ plans }: PricingClientProps) {
  const { data: session } = useSession();
  const { toast } = useToast();

  const createCheckoutSession = async (priceId: string) => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to purchase credits",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`rounded-3xl p-8 ring-1 ring-gray-200 ${
            plan.popular
              ? "bg-gray-900 ring-gray-900"
              : "bg-white"
          }`}
        >
          <h3
            className={`text-lg font-semibold leading-8 ${
              plan.popular ? "text-white" : "text-gray-900"
            }`}
          >
            {plan.name}
          </h3>

          <p
            className={`mt-4 text-sm leading-6 ${
              plan.popular ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {plan.credits} credits
          </p>

          <p className="mt-6 flex items-baseline gap-x-1">
            <span
              className={`text-4xl font-bold tracking-tight ${
                plan.popular ? "text-white" : "text-gray-900"
              }`}
            >
              ₹{plan.price}
            </span>
          </p>

          <ul
            className={`mt-8 space-y-3 text-sm leading-6 ${
              plan.popular ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {plan.features.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <svg
                  className={`h-6 w-5 flex-none ${
                    plan.popular ? "text-white" : "text-indigo-600"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <InteractiveButton
            onClick={() => createCheckoutSession(`price_${plan.name.toLowerCase()}`)}
            className={`mt-8 w-full ${
              plan.popular
                ? "bg-white text-gray-900 hover:bg-gray-100"
                : "bg-indigo-600 text-white hover:bg-indigo-500"
            }`}
          >
            {session ? "Buy Credits" : "Sign in to Purchase"}
          </InteractiveButton>
        </div>
      ))}
    </div>
  );
}