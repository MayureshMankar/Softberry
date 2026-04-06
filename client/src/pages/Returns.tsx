import { useTheme } from "@/contexts/ThemeContext";
import { RotateCcw, Package, Clock, FileText } from "lucide-react";

export default function Returns() {
  const { colors } = useTheme();

  const returnPolicy = [
    {
      id: 1,
      title: "30-Day Return Window",
      description: "You have 30 days from the date of delivery to initiate a return"
    },
    {
      id: 2,
      title: "Unopened Products Only",
      description: "Items must be unopened and in their original packaging"
    },
    {
      id: 3,
      title: "Original Condition",
      description: "Products should be in the same condition as received"
    },
    {
      id: 4,
      title: "Proof of Purchase",
      description: "Original receipt or order confirmation is required"
    }
  ];

  const returnProcess = [
    {
      id: 1,
      step: "01",
      title: "Initiate Return",
      description: "Contact our customer service team to initiate your return"
    },
    {
      id: 2,
      step: "02",
      title: "Pack Items",
      description: "Carefully pack the items in their original packaging"
    },
    {
      id: 3,
      step: "03",
      title: "Ship Back",
      description: "Drop off the package at the nearest courier facility"
    },
    {
      id: 4,
      step: "04",
      title: "Refund Processed",
      description: "Once received, we'll process your refund within 5-7 business days"
    }
  ];

  const nonReturnableItems = [
    "Opened or used cosmetic products",
    "Gift cards",
    "Personalized or custom items",
    "Digital downloads",
    "Sale items (unless defective)"
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Returns & Exchanges
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.text.tertiary }}>
            We want you to be completely satisfied with your purchase. If for any reason you're not happy, we're here to help.
          </p>
        </div>

        {/* Return Policy */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6" style={{ color: colors.text.primary }}>
              Our Return Policy
            </h2>
            <div className="space-y-6">
              {returnPolicy.map((policy) => (
                <div key={policy.id} className="flex">
                  <div className="mr-4 mt-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1" style={{ color: colors.text.primary }}>
                      {policy.title}
                    </h3>
                    <p style={{ color: colors.text.tertiary }}>
                      {policy.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div 
            className="rounded-xl p-6"
            style={{ backgroundColor: `${colors.accent}10` }}
          >
            <div className="flex items-center mb-4">
              <RotateCcw className="h-6 w-6 mr-3" style={{ color: colors.accent }} />
              <h3 className="font-serif text-xl font-bold" style={{ color: colors.text.primary }}>
                Important Notes
              </h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                <span className="mr-2">•</span>
                <span>Return shipping costs are the responsibility of the customer</span>
              </li>
              <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                <span className="mr-2">•</span>
                <span>We recommend using a trackable shipping service</span>
              </li>
              <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                <span className="mr-2">•</span>
                <span>Original shipping charges are non-refundable</span>
              </li>
              <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                <span className="mr-2">•</span>
                <span>Refunds will be processed to the original payment method</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Return Process */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl font-bold mb-8 text-center" style={{ color: colors.text.primary }}>
            How to Initiate a Return
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {returnProcess.map((step) => (
              <div 
                key={step.id}
                className="rounded-xl p-6 border text-center relative"
                style={{ 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border 
                }}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: colors.accent, color: colors.background }}>
                  {step.step}
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: colors.text.primary }}>
                  {step.title}
                </h3>
                <p style={{ color: colors.text.tertiary }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Non-Returnable Items */}
        <div 
          className="rounded-xl p-8 mb-16"
          style={{ backgroundColor: `${colors.accent}10` }}
        >
          <div className="flex items-center mb-6">
            <Package className="h-6 w-6 mr-3" style={{ color: colors.accent }} />
            <h2 className="font-serif text-2xl font-bold" style={{ color: colors.text.primary }}>
              Non-Returnable Items
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {nonReturnableItems.map((item, index) => (
              <div key={index} className="flex items-center" style={{ color: colors.text.tertiary }}>
                <span className="mr-3">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Exchanges */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6" style={{ color: colors.text.primary }}>
              Exchanges
            </h2>
            <p className="mb-4" style={{ color: colors.text.tertiary }}>
              If you'd like to exchange an item for a different size, color, or product:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                <span className="mr-2">1.</span>
                <span>Initiate a return for the original item</span>
              </li>
              <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                <span className="mr-2">2.</span>
                <span>Place a new order for the item you'd like instead</span>
              </li>
              <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                <span className="mr-2">3.</span>
                <span>We'll process both transactions separately</span>
              </li>
            </ul>
            <p style={{ color: colors.text.tertiary }}>
              For defective items, we'll cover the return shipping costs.
            </p>
          </div>
          
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6" style={{ color: colors.text.primary }}>
              Defective Items
            </h2>
            <p className="mb-4" style={{ color: colors.text.tertiary }}>
              If you receive a defective or damaged item:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                <span className="mr-2">•</span>
                <span>Contact us within 7 days of delivery</span>
              </li>
              <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                <span className="mr-2">•</span>
                <span>Provide photos of the defect or damage</span>
              </li>
              <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                <span className="mr-2">•</span>
                <span>We'll arrange for a free return pickup</span>
              </li>
              <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                <span className="mr-2">•</span>
                <span>We'll send a replacement or issue a full refund</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Need Help with a Return?
          </h2>
          <p className="text-lg mb-6" style={{ color: colors.text.tertiary }}>
            Our customer service team is ready to assist you with your return or exchange
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="mailto:softberryskincare@gmail.com" 
              className="px-6 py-3 rounded-lg font-medium"
              style={{ 
                backgroundColor: colors.accent,
                color: colors.background
              }}
            >
              Email Returns: softberryskincare@gmail.com
            </a>
            <a 
              href="/contact" 
              className="px-6 py-3 rounded-lg font-medium border"
              style={{ 
                borderColor: colors.border,
                color: colors.text.primary
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.accent;
                e.currentTarget.style.color = colors.background;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
