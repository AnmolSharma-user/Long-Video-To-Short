import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PricingClient from "@/components/PricingClient";
import { pricingPlans } from "@/lib/constants/pricing";

export default async function PricingPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose your plan
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Get more credits to process longer videos and create more engaging content.
          All plans include our core features with additional benefits as you scale.
        </p>

        {/* Monthly/Yearly toggle will be added in the client component */}
        <PricingClient plans={pricingPlans} />

        {/* Additional pricing information */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            All plans include:
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• AI-powered clip detection</li>
            <li>• Auto-generated captions</li>
            <li>• Video enhancement options</li>
            <li>• Background music library</li>
            <li>• 24/7 customer support</li>
          </ul>
          <p className="mt-8 text-sm text-gray-500">
            Need a custom plan? {" "}
            <a href="mailto:support@videoshortsai.com" className="text-indigo-600 hover:text-indigo-500">
              Contact us
            </a>
            {" "} for enterprise solutions.
          </p>
          <p className="mt-4 text-xs text-gray-500">
            * Prices are in INR. By subscribing, you agree to our terms of service and privacy policy.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h3>
          <div className="grid gap-8 max-w-3xl mx-auto">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">What are credits?</h4>
              <p className="mt-2 text-gray-600">
                Credits are used to process videos. One credit equals one minute of video processing.
                For example, if you have a 10-minute video, it will use 10 credits to process.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Do credits expire?</h4>
              <p className="mt-2 text-gray-600">
                No, your credits never expire. Use them whenever you need them.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Can I upgrade my plan?</h4>
              <p className="mt-2 text-gray-600">
                Yes, you can upgrade your plan at any time. Your existing credits will be carried over.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">What payment methods do you accept?</h4>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards, debit cards, and UPI payments through our secure payment gateway.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}