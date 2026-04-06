import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { Package, MapPin, Clock, CheckCircle } from "lucide-react";

export default function TrackOrder() {
  const { colors } = useTheme();
  const [orderId, setOrderId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTrackOrder = () => {
    if (!orderId || !email) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock order data
      setOrderStatus({
        id: orderId,
        status: "In Transit",
        estimatedDelivery: "2024-06-15",
        items: [
          { name: "Royal Oud Eau de Parfum", quantity: 1, price: 2999 },
          { name: "Midnight Rose Eau de Toilette", quantity: 1, price: 1999 }
        ],
        total: 4998,
        trackingSteps: [
          { id: 1, status: "Order Placed", date: "2024-06-10", completed: true },
          { id: 2, status: "Processing", date: "2024-06-11", completed: true },
          { id: 3, status: "Shipped", date: "2024-06-12", completed: true },
          { id: 4, status: "In Transit", date: "2024-06-13", completed: true },
          { id: 5, status: "Out for Delivery", date: "2024-06-15", completed: false },
          { id: 6, status: "Delivered", date: "", completed: false }
        ]
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Track Your Order
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.text.tertiary }}>
            Enter your order details to track the status and estimated delivery
          </p>
        </div>

        {/* Track Order Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <div 
            className="rounded-xl p-8"
            style={{ 
              backgroundColor: colors.surface, 
              borderColor: colors.border 
            }}
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium" style={{ color: colors.text.primary }}>
                  Order ID
                </label>
                <Input
                  type="text"
                  placeholder="Enter your order ID"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    color: colors.text.primary
                  }}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: colors.text.primary }}>
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    color: colors.text.primary
                  }}
                />
              </div>
            </div>
            <Button
              className="w-full"
              style={{ backgroundColor: colors.accent, color: colors.background }}
              onClick={handleTrackOrder}
              disabled={isLoading || !orderId || !email}
            >
              {isLoading ? "Tracking..." : "Track Order"}
            </Button>
            
            {/* Alternative: Track by tracking number */}
            <div className="mt-6 text-center" style={{ color: colors.text.tertiary }}>
              <p>Or track with your tracking number directly:</p>
              <Link 
                href="/order-tracking" 
                className="font-medium mt-2 inline-block"
                style={{ color: colors.accent }}
              >
                Track by Tracking Number
              </Link>
            </div>
          </div>
        </div>

        {/* Order Status */}
        {orderStatus && (
          <div className="max-w-4xl mx-auto">
            <div 
              className="rounded-xl p-6 mb-8"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold" style={{ color: colors.text.primary }}>
                    Order #{orderStatus.id}
                  </h2>
                  <p className="text-lg" style={{ color: colors.accent }}>
                    {orderStatus.status}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ color: colors.text.tertiary }}>
                    Estimated Delivery
                  </p>
                  <p className="font-semibold" style={{ color: colors.text.primary }}>
                    {orderStatus.estimatedDelivery}
                  </p>
                </div>
              </div>

              {/* Tracking Steps */}
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4" style={{ color: colors.text.primary }}>
                  Tracking Progress
                </h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ backgroundColor: colors.border }}></div>
                  <div className="space-y-6 pl-12">
                    {orderStatus.trackingSteps.map((step: any, index: number) => (
                      <div key={step.id} className="relative">
                        <div 
                          className={`absolute left-[-28px] w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'text-white' : ''}`}
                          style={{ 
                            backgroundColor: step.completed ? colors.accent : colors.border,
                            border: step.completed ? 'none' : `2px solid ${colors.border}`
                          }}
                        >
                          {step.completed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.text.tertiary }}></div>
                          )}
                        </div>
                        <h4 className="font-semibold" style={{ color: step.completed ? colors.text.primary : colors.text.tertiary }}>
                          {step.status}
                        </h4>
                        {step.date && (
                          <p className="text-sm" style={{ color: colors.text.tertiary }}>
                            {step.date}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-lg mb-4" style={{ color: colors.text.primary }}>
                  Order Items
                </h3>
                <div className="space-y-4">
                  {orderStatus.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between pb-4 border-b" style={{ borderColor: colors.border }}>
                      <div>
                        <h4 className="font-medium" style={{ color: colors.text.primary }}>
                          {item.name}
                        </h4>
                        <p className="text-sm" style={{ color: colors.text.tertiary }}>
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="font-semibold" style={{ color: colors.text.primary }}>
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4">
                    <span className="font-semibold" style={{ color: colors.text.primary }}>
                      Total
                    </span>
                    <span className="font-bold text-lg" style={{ color: colors.text.primary }}>
                      ₹{orderStatus.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div 
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: `${colors.accent}10` }}
            >
              <h3 className="font-serif text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
                Need Help With Your Order?
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                Our customer service team is ready to assist you with any questions about your order
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
                  Email Support
                </a>
                <a 
                  href="tel:+919876543210" 
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
                  Call Us
                </a>
              </div>
            </div>
          </div>
        )}

        {/* No Order Found */}
        {!orderStatus && !isLoading && orderId && email && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4" style={{ color: colors.text.tertiary }} />
            <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: colors.text.primary }}>
              Order Not Found
            </h2>
            <p className="text-lg mb-6" style={{ color: colors.text.tertiary }}>
              We couldn't find an order with the provided details. Please check your order ID and email address.
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setOrderId("");
                setEmail("");
              }}
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
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
