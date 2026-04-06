import { useTheme } from "@/contexts/ThemeContext";
import { Truck, Clock, Shield, RotateCcw } from "lucide-react";

export default function ShippingInfo() {
  const { colors } = useTheme();

  const shippingOptions = [
    {
      id: 1,
      title: "Standard Shipping",
      description: "Delivered within 5-7 business days",
      price: "Free on orders over ₹999",
      icon: <Truck className="h-6 w-6" />
    },
    {
      id: 2,
      title: "Express Shipping",
      description: "Delivered within 2-3 business days",
      price: "₹199",
      icon: <Truck className="h-6 w-6" />
    },
    {
      id: 3,
      title: "Same-Day Delivery",
      description: "Delivered within 24 hours (Metro cities only)",
      price: "₹299",
      icon: <Truck className="h-6 w-6" />
    }
  ];

  const shippingInfo = [
    {
      id: 1,
      title: "Order Processing",
      description: "All orders are processed within 1-2 business days"
    },
    {
      id: 2,
      title: "Delivery Time",
      description: "Delivery times vary based on your location and selected shipping option"
    },
    {
      id: 3,
      title: "Tracking",
      description: "You'll receive a tracking number via email once your order ships"
    },
    {
      id: 4,
      title: "International Shipping",
      description: "We ship worldwide with additional shipping charges"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Shipping Information
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.text.tertiary }}>
            We offer fast and reliable shipping options to get your luxury cosmetics to you as quickly as possible
          </p>
        </div>

        {/* Shipping Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {shippingOptions.map((option) => (
            <div 
              key={option.id}
              className="rounded-xl p-6 border text-center"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${colors.accent}20` }}>
                <div style={{ color: colors.accent }}>
                  {option.icon}
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
                {option.title}
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                {option.description}
              </p>
              <div className="font-bold text-lg" style={{ color: colors.text.primary }}>
                {option.price}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6" style={{ color: colors.text.primary }}>
              Shipping Details
            </h2>
            <div className="space-y-6">
              {shippingInfo.map((info) => (
                <div key={info.id} className="flex">
                  <div className="mr-4 mt-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1" style={{ color: colors.text.primary }}>
                      {info.title}
                    </h3>
                    <p style={{ color: colors.text.tertiary }}>
                      {info.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6" style={{ color: colors.text.primary }}>
              Delivery Areas
            </h2>
            <div 
              className="rounded-xl p-6 mb-6"
              style={{ backgroundColor: `${colors.accent}10` }}
            >
              <h3 className="font-semibold text-lg mb-2" style={{ color: colors.text.primary }}>
                India-wide Delivery
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                We deliver to all major cities and towns across India through our trusted courier partners.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center" style={{ color: colors.text.tertiary }}>
                  <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: colors.accent }}></span>
                  All metro cities (1-2 business days)
                </li>
                <li className="flex items-center" style={{ color: colors.text.tertiary }}>
                  <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: colors.accent }}></span>
                  Tier-1 and Tier-2 cities (2-4 business days)
                </li>
                <li className="flex items-center" style={{ color: colors.text.tertiary }}>
                  <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: colors.accent }}></span>
                  Remote areas (4-7 business days)
                </li>
              </ul>
            </div>
            
            <h3 className="font-semibold text-lg mb-4" style={{ color: colors.text.primary }}>
              International Shipping
            </h3>
            <p style={{ color: colors.text.tertiary }}>
              We ship worldwide with DHL and FedEx. International shipping charges will be calculated at checkout. 
              Delivery times vary from 3-10 business days depending on the destination.
            </p>
          </div>
        </div>

        {/* Policies */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div 
            className="rounded-xl p-6 border"
            style={{ 
              backgroundColor: colors.surface, 
              borderColor: colors.border 
            }}
          >
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 mr-3" style={{ color: colors.accent }} />
              <h3 className="font-serif text-xl font-bold" style={{ color: colors.text.primary }}>
                Secure Packaging
              </h3>
            </div>
            <p style={{ color: colors.text.tertiary }}>
              All our products are packaged with utmost care using premium materials to ensure they arrive in perfect condition. 
              Fragile items are specially protected to prevent any damage during transit.
            </p>
          </div>
          
          <div 
            className="rounded-xl p-6 border"
            style={{ 
              backgroundColor: colors.surface, 
              borderColor: colors.border 
            }}
          >
            <div className="flex items-center mb-4">
              <RotateCcw className="h-6 w-6 mr-3" style={{ color: colors.accent }} />
              <h3 className="font-serif text-xl font-bold" style={{ color: colors.text.primary }}>
                Return Policy
              </h3>
            </div>
            <p style={{ color: colors.text.tertiary }}>
              If you're not satisfied with your purchase, we offer a 30-day return policy. 
              Items must be unopened and in their original packaging. 
              <a href="/returns" className="underline" style={{ color: colors.accent }}> Learn more about our return policy</a>.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Have Questions About Shipping?
          </h2>
          <p className="text-lg mb-6" style={{ color: colors.text.tertiary }}>
            Our customer service team is here to help you with any shipping inquiries
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="tel:+919876543210" 
              className="px-6 py-3 rounded-lg font-medium"
              style={{ 
                backgroundColor: colors.accent,
                color: colors.background
              }}
            >
              Call Us: +91 98765 43210
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
