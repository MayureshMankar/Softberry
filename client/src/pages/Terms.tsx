import { useTheme } from "@/contexts/ThemeContext";
import { FileText } from "lucide-react";

export default function Terms() {
  const { colors } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Terms of Service
          </h1>
          <p className="text-xl" style={{ color: colors.text.tertiary }}>
            Last Updated: June 1, 2024
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div 
            className="rounded-xl p-8 mb-8"
            style={{ 
              backgroundColor: colors.surface, 
              borderColor: colors.border 
            }}
          >
            <div className="flex items-center mb-6">
              <FileText className="h-6 w-6 mr-3" style={{ color: colors.accent }} />
              <h2 className="font-serif text-2xl font-bold" style={{ color: colors.text.primary }}>
                Agreement to Terms
              </h2>
            </div>
            <p className="mb-6" style={{ color: colors.text.tertiary }}>
              These Terms of Service constitute a legally binding agreement made between you, whether personally 
              or on behalf of an entity ("you") and Soft Berry Skincare ("we," "us," or "our"), concerning your 
              access to and use of our website and services.
            </p>
            <p style={{ color: colors.text.tertiary }}>
              By accessing or using our services, you agree to be bound by these Terms of Service. If you disagree 
              with any part of these terms, then you may not access the service.
            </p>
          </div>

          <div className="space-y-8">
            <div 
              className="rounded-xl p-8"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
                1. Intellectual Property Rights
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                Unless otherwise indicated, we own the intellectual property rights for all material on our site. 
                All intellectual property rights are reserved.
              </p>
              <p style={{ color: colors.text.tertiary }}>
                You may view and/or print pages from our site for your own personal use subject to restrictions 
                set in these terms and conditions. You must not:
              </p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Republish material from our site</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Sell, rent, or sub-license material from our site</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Reproduce, duplicate, or copy material from our site</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Redistribute content from our site</span>
                </li>
              </ul>
            </div>

            <div 
              className="rounded-xl p-8"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
                2. User Accounts
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                When you create an account with us, you must provide information that is accurate, complete, and 
                current at all times. Failure to do so constitutes a breach of the Terms, which may result in 
                immediate termination of your account.
              </p>
              <p style={{ color: colors.text.tertiary }}>
                You are responsible for maintaining the confidentiality of your account and password, including 
                the restriction of access to your computer and/or account. You agree to accept responsibility for 
                any and all activities or actions that occur under your account and/or password.
              </p>
            </div>

            <div 
              className="rounded-xl p-8"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
                3. Products and Pricing
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                We reserve the right to modify or discontinue, temporarily or permanently, the service (or any 
                part or content thereof) with or without notice at any time.
              </p>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                Prices for our products are subject to change without notice. We reserve the right at any time 
                to modify or discontinue the service (or any part or content thereof) with or without notice.
              </p>
              <p style={{ color: colors.text.tertiary }}>
                We shall not be liable to you or to any third-party for any modification, price change, 
                suspension, or discontinuance of the service.
              </p>
            </div>

            <div 
              className="rounded-xl p-8"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
                4. Orders and Payments
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                By placing an order, you are offering to purchase a product on and subject to these Terms. 
                All orders are subject to acceptance by us.
              </p>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                We reserve the right to refuse or cancel any order for any reason. We may, in our sole discretion, 
                limit or cancel quantities purchased per person, per household, or per order.
              </p>
              <p style={{ color: colors.text.tertiary }}>
                We reserve the right to refuse any order you place with us. These restrictions may include orders 
                placed by or under the same customer account, the same credit card, and/or orders that use the 
                same billing and/or shipping address.
              </p>
            </div>

            <div 
              className="rounded-xl p-8"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
                5. Shipping and Delivery
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                We offer various shipping options, and delivery times may vary based on your location and the 
                shipping method selected. Estimated delivery times are provided as a guide only and are not 
                guaranteed.
              </p>
              <p style={{ color: colors.text.tertiary }}>
                Risk of loss and title for items purchased from us pass to you upon our delivery of the items 
                to the carrier.
              </p>
            </div>

            <div 
              className="rounded-xl p-8"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
                6. Returns and Refunds
              </h3>
              <p style={{ color: colors.text.tertiary }}>
                Our Return Policy forms part of these Terms. Please review our Return Policy to understand 
                our procedures for returns and refunds.
              </p>
            </div>

            <div 
              className="rounded-xl p-8"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
                7. Limitation of Liability
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                In no event shall Soft Berry Skincare, nor its directors, employees, partners, agents, suppliers, 
                or affiliates, be liable for any indirect, incidental, special, consequential, or punitive 
                damages, including without limitation, loss of profits, data, use, goodwill, or other 
                intangible losses, resulting from:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Your access to or use of or inability to access or use the service</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Any conduct or content of any third party on the service</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Any content obtained from the service</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Unauthorized access to or use of our servers and/or any personal information stored therein</span>
                </li>
              </ul>
            </div>

            <div 
              className="rounded-xl p-8"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
                8. Governing Law
              </h3>
              <p style={{ color: colors.text.tertiary }}>
                These Terms shall be governed and construed in accordance with the laws of India, without regard 
                to its conflict of law provisions. Our failure to enforce any right or provision of these Terms 
                will not be considered a waiver of those rights.
              </p>
            </div>

            <div 
              className="rounded-xl p-8"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
                9. Changes to Terms
              </h3>
              <p style={{ color: colors.text.tertiary }}>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will provide at least 30 days' notice prior to any new terms 
                taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </div>

            <div 
              className="rounded-xl p-8"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
                10. Contact Us
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="space-y-2">
                <p style={{ color: colors.text.primary }}>
                  <strong>Website:</strong> https://softberryskincare.com
                </p>
                <p style={{ color: colors.text.primary }}>
                  <strong>Phone:</strong> +91 98765 43210
                </p>
                <p style={{ color: colors.text.primary }}>
                  <strong>Address:</strong> 123 Luxury Avenue, Mumbai, Maharashtra 400001
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
