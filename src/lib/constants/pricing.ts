import { config } from "@/lib/config";

export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  credits: number;
  stripePriceId: string;
  features: string[];
  popular?: boolean;
  savePercentage?: number;
  billingPeriod: "one-time" | "monthly" | "yearly";
};

export type PricingFeature = {
  name: string;
  description: string;
  included: ("starter" | "pro" | "enterprise")[];
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter-pack",
    name: "Starter",
    description: "Perfect for creating your first short-form videos",
    price: 499,
    credits: 100,
    stripePriceId: "price_starter",
    features: [
      "100 video processing credits",
      "Basic AI enhancement",
      "Auto-generated captions",
      "720p & 1080p output",
      "7-day credit validity",
    ],
    billingPeriod: "one-time",
  },
  {
    id: "pro-pack",
    name: "Pro",
    description: "Ideal for regular content creators",
    price: 999,
    credits: 250,
    stripePriceId: "price_pro",
    features: [
      "250 video processing credits",
      "Advanced AI enhancement",
      "Auto-generated captions",
      "Background music library",
      "Up to 4K output",
      "Priority processing",
      "30-day credit validity",
    ],
    popular: true,
    savePercentage: 20,
    billingPeriod: "one-time",
  },
  {
    id: "enterprise-pack",
    name: "Enterprise",
    description: "For professional content creators and teams",
    price: 2499,
    credits: 1000,
    stripePriceId: "price_enterprise",
    features: [
      "1000 video processing credits",
      "Premium AI enhancement",
      "Custom branding",
      "Team collaboration",
      "API access",
      "Dedicated support",
      "90-day credit validity",
    ],
    savePercentage: 50,
    billingPeriod: "one-time",
  },
];

export const subscriptionPlans: PricingPlan[] = [
  {
    id: "monthly-pro",
    name: "Pro Monthly",
    description: "Professional features with monthly billing",
    price: 2999,
    credits: 1000,
    stripePriceId: "price_monthly_pro",
    features: [
      "1000 monthly credits",
      "Advanced AI enhancement",
      "Auto-generated captions",
      "Background music library",
      "Up to 4K output",
      "Priority processing",
      "Unused credits rollover (up to 3000)",
    ],
    billingPeriod: "monthly",
  },
  {
    id: "yearly-pro",
    name: "Pro Yearly",
    description: "Save 20% with annual billing",
    price: 28790,
    credits: 12000,
    stripePriceId: "price_yearly_pro",
    features: [
      "1000 monthly credits (12000/year)",
      "Advanced AI enhancement",
      "Auto-generated captions",
      "Background music library",
      "Up to 4K output",
      "Priority processing",
      "Unused credits rollover (up to 3000)",
      "2 months free",
    ],
    popular: true,
    savePercentage: 20,
    billingPeriod: "yearly",
  },
];

export const pricingFeatures: PricingFeature[] = [
  {
    name: "Video Processing",
    description: "Convert long videos into short clips",
    included: ["starter", "pro", "enterprise"],
  },
  {
    name: "AI Enhancement",
    description: "Automatically improve video quality",
    included: ["pro", "enterprise"],
  },
  {
    name: "Auto Captions",
    description: "Generate accurate video captions",
    included: ["starter", "pro", "enterprise"],
  },
  {
    name: "Background Music",
    description: "Access copyright-free music library",
    included: ["pro", "enterprise"],
  },
  {
    name: "4K Resolution",
    description: "Export videos in up to 4K quality",
    included: ["pro", "enterprise"],
  },
  {
    name: "Priority Processing",
    description: "Faster video processing times",
    included: ["pro", "enterprise"],
  },
  {
    name: "API Access",
    description: "Programmatic access to our services",
    included: ["enterprise"],
  },
  {
    name: "Custom Branding",
    description: "Add your own branding to videos",
    included: ["enterprise"],
  },
  {
    name: "Team Collaboration",
    description: "Multiple team members and roles",
    included: ["enterprise"],
  },
];

export const creditCosts = {
  processing: config.credits.clipCosts,
  enhancement: config.credits.enhancementCosts,
};

export const creditValidityPeriods = {
  starter: 7 * 24 * 60 * 60, // 7 days in seconds
  pro: 30 * 24 * 60 * 60, // 30 days in seconds
  enterprise: 90 * 24 * 60 * 60, // 90 days in seconds
};

export const maxCreditRollover = 3000;

export function calculateSavings(plan: PricingPlan): number {
  if (!plan.savePercentage) return 0;
  const originalPrice = Math.round(plan.price / (1 - plan.savePercentage / 100));
  return originalPrice - plan.price;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(price / 100);
}

export function getPlanById(planId: string): PricingPlan | undefined {
  return [...pricingPlans, ...subscriptionPlans].find(plan => plan.id === planId);
}

export function calculateCreditCost(
  duration: number,
  options: {
    aiEnhancement?: boolean;
    autoCaptions?: boolean;
    backgroundMusic?: boolean;
  } = {}
): number {
  let totalCost = 0;

  // Calculate base processing cost
  if (duration <= 60) totalCost += creditCosts.processing["1min"];
  else if (duration <= 180) totalCost += creditCosts.processing["3min"];
  else if (duration <= 300) totalCost += creditCosts.processing["5min"];
  else if (duration <= 420) totalCost += creditCosts.processing["7min"];
  else totalCost += creditCosts.processing["10min"];

  // Add enhancement costs
  if (options.aiEnhancement) totalCost += creditCosts.enhancement.aiEnhancement;
  if (options.autoCaptions) totalCost += creditCosts.enhancement.autoCaptions;
  if (options.backgroundMusic) totalCost += creditCosts.enhancement.backgroundMusic;

  return totalCost;
}