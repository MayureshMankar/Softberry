import { useTheme } from "@/contexts/ThemeContext";
import { Cookie } from "lucide-react";

export default function Cookies() {
  const { colors } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Cookie Policy
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
              <Cookie className="h-6 w-6 mr-3" style={{ color: colors.accent }} />
              <h2 className="font-serif text-2xl font-bold" style={{ color: colors.text.primary }}>
                About Cookies
              </h2>
            </div>
            <p className="mb-6" style={{ color: colors.text.tertiary }}>
              This Cookie Policy explains what cookies are, how we use them, what third-party cookies we use, 
              and how you can control your cookie preferences.
            </p>
            <p style={{ color: colors.text.tertiary }}>
              By using our website, you consent to the use of cookies in accordance with this Cookie Policy.
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
                What Are Cookies?
              </h3>
              <p style={{ color: colors.text.tertiary }}>
                Cookies are small text files that are stored on your computer or mobile device when you visit 
                a website. They are widely used to make websites work more efficiently, as well as to provide 
                information to the owners of the site.
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
                How We Use Cookies
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                We use cookies for various purposes, including:
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
                    Essential Cookies
                  </h4>
                  <p style={{ color: colors.text.tertiary }}>
                    These cookies are essential for you to browse the website and use its features, such as 
                    accessing secure areas of the site. Without these cookies, certain services cannot be provided.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
                    Performance Cookies
                  </h4>
                  <p style={{ color: colors.text.tertiary }}>
                    These cookies collect information about how you use our website, such as which pages you 
                    visit most often. All information these cookies collect is aggregated and therefore anonymous.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
                    Functionality Cookies
                  </h4>
                  <p style={{ color: colors.text.tertiary }}>
                    These cookies allow our website to remember choices you make (such as your user name, 
                    language, or the region you are in) and provide enhanced, more personal features.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
                    Targeting Cookies
                  </h4>
                  <p style={{ color: colors.text.tertiary }}>
                    These cookies are used to deliver advertisements more relevant to you and your interests. 
                    They are also used to limit the number of times you see an advertisement and help measure 
                    the effectiveness of the advertising campaign.
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
                Types of Cookies We Use
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: `${colors.accent}20` }}>
                      <th className="p-3 text-left" style={{ color: colors.text.primary }}>Cookie Type</th>
                      <th className="p-3 text-left" style={{ color: colors.text.primary }}>Purpose</th>
                      <th className="p-3 text-left" style={{ color: colors.text.primary }}>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b" style={{ borderColor: colors.border }}>
                      <td className="p-3" style={{ color: colors.text.primary }}>Session Cookie</td>
                      <td className="p-3" style={{ color: colors.text.tertiary }}>Maintains user session</td>
                      <td className="p-3" style={{ color: colors.text.tertiary }}>Until browser is closed</td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: colors.border }}>
                      <td className="p-3" style={{ color: colors.text.primary }}>Authentication Cookie</td>
                      <td className="p-3" style={{ color: colors.text.tertiary }}>Identifies authenticated users</td>
                      <td className="p-3" style={{ color: colors.text.tertiary }}>30 days</td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: colors.border }}>
                      <td className="p-3" style={{ color: colors.text.primary }}>Shopping Cart Cookie</td>
                      <td className="p-3" style={{ color: colors.text.tertiary }}>Maintains cart items</td>
                      <td className="p-3" style={{ color: colors.text.tertiary }}>30 days</td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: colors.border }}>
                      <td className="p-3" style={{ color: colors.text.primary }}>Preference Cookie</td>
                      <td className="p-3" style={{ color: colors.text.tertiary }}>Stores user preferences</td>
                      <td className="p-3" style={{ color: colors.text.tertiary }}>1 year</td>
                    </tr>
                    <tr>
                      <td className="p-3" style={{ color: colors.text.primary }}>Analytics Cookie</td>
                      <td className="p-3" style={{ color: colors.text.tertiary }}>Tracks website usage</td>
                      <td className="p-3" style={{ color: colors.text.tertiary }}>2 years</td>
                    </tr>
                  </tbody>
                </table>
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
                Third-Party Cookies
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                In some special cases, we also use cookies provided by trusted third parties. The following 
                section details which third-party cookies you might encounter through our website:
              </p>
              <ul className="space-y-4">
                <li style={{ color: colors.text.tertiary }}>
                  <strong>Google Analytics:</strong> We use Google Analytics to track and analyze visitor 
                  behavior on our site. Google Analytics uses cookies to collect standard internet log information 
                  and visitor behavior information.
                </li>
                <li style={{ color: colors.text.tertiary }}>
                  <strong>Social Media Platforms:</strong> Our website may feature social media sharing buttons 
                  and widgets that enable web visitors to share content with their friends. These sites may 
                  collect information about you and your use of our website through cookies.
                </li>
                <li style={{ color: colors.text.tertiary }}>
                  <strong>Payment Processors:</strong> When you make a purchase, we may use third-party payment 
                  processors that may set cookies to remember your preferences and payment information.
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
                Managing Cookies
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please 
                visit the help pages of your web browser.
              </p>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                Please note that if you delete cookies or refuse to accept them, you might not be able to use 
                all of the features we offer, you may have to manually adjust some preferences each time you 
                visit our site, and some of our services may not function properly.
              </p>
              <div className="space-y-2">
                <p style={{ color: colors.text.tertiary }}>
                  For more information on how to manage cookies on popular browsers, please visit:
                </p>
                <ul className="space-y-1">
                  <li>
                    <a 
                      href="https://support.google.com/chrome/answer/95647" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: colors.accent }}
                    >
                      Google Chrome
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: colors.accent }}
                    >
                      Mozilla Firefox
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: colors.accent }}
                    >
                      Microsoft Edge
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: colors.accent }}
                    >
                      Safari (Mac)
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://support.apple.com/en-us/HT201265" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: colors.accent }}
                    >
                      Safari (iOS)
                    </a>
                  </li>
                </ul>
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
                Changes to This Cookie Policy
              </h3>
              <p style={{ color: colors.text.tertiary }}>
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting 
                the new Cookie Policy on this page and updating the "Last Updated" date.
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
                Contact Us
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                If you have any questions about this Cookie Policy, please contact us at:
              </p>
              <div className="space-y-2">
                <p style={{ color: colors.text.primary }}>
                  <strong>Email:</strong> softberryskincare@gmail.com
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
