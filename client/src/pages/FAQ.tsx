import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronDown, ChevronUp, Mail, Phone } from "lucide-react";

export default function FAQ() {
  const { colors } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      id: 1,
      question: "Are your products suitable for all skin types?",
      answer: "We offer products for all skin types, including dry, oily, combination, and sensitive. Check each product page for specific recommendations and patch-test new products before full use."
    },
    {
      id: 2,
      question: "Are your products authentic?",
      answer: "Yes, all our products are 100% authentic and sourced directly from the brands or authorized distributors. We guarantee the authenticity of every product we sell."
    },
    {
      id: 3,
      question: "How should I store my cosmetics?",
      answer: "Store cosmetics in a cool, dry place away from direct sunlight. Keep containers tightly closed and avoid extreme temperature changes. Follow PAO (period after opening) guidance on the label."
    },
    {
      id: 4,
      question: "Can I return an opened cosmetic product?",
      answer: "Due to hygiene reasons, we cannot accept returns on opened cosmetic products. However, unopened items can be returned within 30 days of purchase. Please refer to our full return policy for more details."
    },
    {
      id: 5,
      question: "Do you offer international shipping?",
      answer: "Yes, we ship worldwide through DHL and FedEx. International shipping charges are calculated at checkout based on your location and the weight of your order. Delivery typically takes 3-10 business days."
    },
    {
      id: 6,
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can track your order status through our 'Track Your Order' page by entering your order number and email address."
    },
    {
      id: 7,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, UPI payments, and digital wallets like PayPal, Google Pay, and Apple Pay."
    },
    {
      id: 8,
      question: "Do you test on animals?",
      answer: "No, we are committed to cruelty-free practices. None of our products or ingredients are tested on animals, and we work exclusively with brands that share our values."
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Frequently Asked Questions
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.text.tertiary }}>
            Find answers to common questions about our products, shipping, returns, and more
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-16">
          {faqData.map((faq, index) => (
            <div 
              key={faq.id}
              className="mb-4 rounded-xl border overflow-hidden"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <button
                className="w-full p-6 text-left flex justify-between items-center"
                onClick={() => toggleAccordion(index)}
                style={{ backgroundColor: colors.surface }}
              >
                <h3 className="font-semibold text-lg" style={{ color: colors.text.primary }}>
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5" style={{ color: colors.text.tertiary }} />
                ) : (
                  <ChevronDown className="h-5 w-5" style={{ color: colors.text.tertiary }} />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6" style={{ color: colors.text.tertiary }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div 
          className="rounded-xl p-8 text-center mb-16"
          style={{ backgroundColor: `${colors.accent}10` }}
        >
          <h2 className="font-serif text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Still Have Questions?
          </h2>
          <p className="text-lg mb-6" style={{ color: colors.text.tertiary }}>
            Our customer service team is here to help you with any additional questions
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="mailto:softberryskincare@gmail.com" 
              className="px-6 py-3 rounded-lg font-medium flex items-center justify-center"
              style={{ 
                backgroundColor: colors.accent,
                color: colors.background
              }}
            >
              <Mail className="h-5 w-5 mr-2" />
              Email Support
            </a>
            <a 
              href="tel:+919876543210" 
              className="px-6 py-3 rounded-lg font-medium flex items-center justify-center border"
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
              <Phone className="h-5 w-5 mr-2" />
              Call Us
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-bold mb-8 text-center" style={{ color: colors.text.primary }}>
            Quick Help Links
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Shipping Info", link: "/shipping" },
              { title: "Returns Policy", link: "/returns" },
              { title: "Size Guide", link: "/size-guide" },
              { title: "Store Locator", link: "/store-locator" }
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="p-4 rounded-lg text-center border"
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
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
