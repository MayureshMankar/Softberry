import { useTheme } from "@/contexts/ThemeContext";
import { Shield } from "lucide-react";

export default function Privacy() {
  const { colors } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Privacy Policy
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
              <Shield className="h-6 w-6 mr-3" style={{ color: colors.accent }} />
              <h2 className="font-serif text-2xl font-bold" style={{ color: colors.text.primary }}>
                Our Commitment to Your Privacy
              </h2>
            </div>
            <p className="mb-6" style={{ color: colors.text.tertiary }}>
              At Soft Berry Skincare, we respect your privacy and are committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
              our website and use our services.
            </p>
            <p style={{ color: colors.text.tertiary }}>
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
              please do not access the site or use our services.
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
                1. Information We Collect
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
                    Personal Information
                  </h4>
                  <p style={{ color: colors.text.tertiary }}>
                    We may collect personally identifiable information, such as your name, shipping address, email address, 
                    telephone number, and credit card information when you place an order or register on our site.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
                    Derivative Information
                  </h4>
                  <p style={{ color: colors.text.tertiary }}>
                    Information our servers automatically collect when you access our site, such as your IP address, 
                    browser type, operating system, access times, and the pages you have viewed directly before 
                    coming to our site.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
                    Financial Information
                  </h4>
                  <p style={{ color: colors.text.tertiary }}>
                    We collect financial information when you make purchases, such as credit card numbers and banking 
                    information. However, we do not store full credit card numbers on our servers. All payment 
                    transactions are processed through secure payment gateways.
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="rounded-xl p-8"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
                2. Use of Your Information
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                Having accurate information about you permits us to provide you with a smooth, efficient, and 
                customized experience. Specifically, we may use information collected about you via our site to:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Create and manage your account</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Process your transactions and send related information</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Send you promotional information about our products and services</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Respond to your comments, questions, and requests</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Improve our website and services</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Monitor and analyze usage and trends</span>
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
                3. Disclosure of Your Information
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                We may share information we have collected about you in certain situations:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span><strong>Service Providers:</strong> We may share your information with third-party service providers who perform services for us</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span><strong>Compliance with Laws:</strong> We may disclose your information where required by law or in response to valid legal processes</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span><strong>Business Transfers:</strong> We may transfer your information in connection with a merger, acquisition, or sale of assets</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span><strong>Affiliates:</strong> We may share your information with our affiliates for internal administrative and operational purposes</span>
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
                4. Security of Your Information
              </h3>
              <p style={{ color: colors.text.tertiary }}>
                We use administrative, technical, and physical security measures to help protect your personal 
                information. While we have taken reasonable steps to secure the personal information you provide 
                to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, 
                and no method of data transmission can be guaranteed against any interception or other type of misuse.
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
                5. Cookies and Tracking Technologies
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                We may use cookies and similar tracking technologies to access or store information. You can 
                instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, 
                if you do not accept cookies, you may not be able to use some portions of our site.
              </p>
              <p style={{ color: colors.text.tertiary }}>
                We use cookies for authentication, shopping cart functionality, and analytics purposes.
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
                6. Third-Party Websites
              </h3>
              <p style={{ color: colors.text.tertiary }}>
                Our site may contain links to third-party websites. Any access to and use of such linked websites 
                is not governed by this policy, but instead is governed by the privacy policies of those third-party 
                websites. We are not responsible for the information practices of such third-party websites.
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
                7. Contact Us
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                If you have questions or comments about this Privacy Policy, please contact us at:
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
