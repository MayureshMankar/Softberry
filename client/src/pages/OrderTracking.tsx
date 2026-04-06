import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Package, 
  MapPin, 
  Truck, 
  CheckCircle,
  Search,
  Clock,
  User,
  Phone,
  Mail
} from "lucide-react";

export default function OrderTracking() {
  const { colors } = useTheme();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = () => {
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }
    
    // Simulate API call
    setIsLoading(true);
    setError("");
    
    // In a real app, this would be an API call to fetch order data
    setTimeout(() => {
      // Mock data for demonstration
      setOrderData({
        id: "ORD-789456",
        trackingNumber: trackingNumber,
        status: "out-for-delivery",
        estimatedDelivery: "2023-06-15",
        items: [
          { name: "Royal Essence", quantity: 1, price: 2500 },
          { name: "Imperial Collection", quantity: 2, price: 4000 }
        ],
        totalAmount: 10500,
        shippingAddress: {
          firstName: "John",
          lastName: "Doe",
          address: "123 Main Street",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001",
          country: "India"
        },
        orderDate: "2023-06-01"
      });
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-indigo-100 text-indigo-800";
      case "out-for-delivery": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Order Pending";
      case "processing": return "Processing";
      case "shipped": return "Shipped";
      case "out-for-delivery": return "Out for Delivery";
      case "delivered": return "Delivered";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
      <Header />
      
      {/* Page Header */}
      <section style={{ backgroundColor: colors.surface, padding: '3rem 0' }}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 
              className="font-serif text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Track Your Order
            </h1>
            <p style={{ color: colors.text.secondary }}>
              Check the status of your order using your tracking number
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Tracking Input */}
          <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }} className="mb-8">
            <CardHeader>
              <CardTitle className="font-serif text-2xl flex items-center gap-2" style={{ color: colors.text.primary }}>
                <Search className="w-5 h-5" style={{ color: colors.accent }} />
                Enter Tracking Number
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trackingNumber" style={{ color: colors.text.primary }}>
                  Tracking Number
                </Label>
                <Input
                  id="trackingNumber"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter your tracking number (e.g., TRK-12345678)"
                  style={{ 
                    backgroundColor: colors.background,
                    color: colors.text.primary,
                    borderColor: colors.border
                  }}
                />
                {error && (
                  <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
                )}
              </div>
              <Button
                onClick={handleTrackOrder}
                disabled={isLoading}
                style={{
                  backgroundColor: colors.accent,
                  color: colors.background
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.accentHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.accent;
                }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Tracking...
                  </>
                ) : "Track Order"}
              </Button>
            </CardContent>
          </Card>

          {/* Order Status */}
          {orderData && (
            <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
              <CardHeader>
                <CardTitle className="font-serif text-2xl flex items-center gap-2" style={{ color: colors.text.primary }}>
                  <Package className="w-5 h-5" style={{ color: colors.accent }} />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: `${colors.accent}10` }}>
                  <div>
                    <h3 className="font-bold" style={{ color: colors.text.primary }}>
                      Order #{orderData.id}
                    </h3>
                    <p className="text-sm" style={{ color: colors.text.secondary }}>
                      Tracking Number: {orderData.trackingNumber}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderData.status)}`}>
                    {getStatusText(orderData.status)}
                  </span>
                </div>

                {/* Order Progress */}
                <div className="space-y-4">
                  <h4 className="font-bold" style={{ color: colors.text.primary }}>Order Progress</h4>
                  <div className="space-y-3">
                    {[
                      { status: "Order Placed", date: orderData.orderDate, completed: true },
                      { status: "Processing", date: "2023-06-02", completed: true },
                      { status: "Shipped", date: "2023-06-05", completed: true },
                      { status: "Out for Delivery", date: "2023-06-12", completed: true },
                      { status: "Delivered", date: orderData.estimatedDelivery, completed: orderData.status === "delivered" }
                    ].map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                          step.completed 
                            ? "bg-green-500 text-white" 
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <p 
                            className={`font-medium ${step.completed ? "" : "opacity-60"}`}
                            style={{ color: step.completed ? colors.text.primary : colors.text.secondary }}
                          >
                            {step.status}
                          </p>
                          <p className="text-sm" style={{ color: colors.text.secondary }}>
                            {step.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Summary */}
                  <div>
                    <h4 className="font-bold mb-3" style={{ color: colors.text.primary }}>Order Summary</h4>
                    <div className="space-y-3">
                      {orderData.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <div>
                            <p style={{ color: colors.text.primary }}>{item.name}</p>
                            <p className="text-sm" style={{ color: colors.text.secondary }}>Qty: {item.quantity}</p>
                          </div>
                          <p style={{ color: colors.text.primary }}>{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                      <div className="border-t pt-2" style={{ borderColor: colors.border }}>
                        <div className="flex justify-between font-bold">
                          <span style={{ color: colors.text.primary }}>Total</span>
                          <span style={{ color: colors.text.primary }}>{formatPrice(orderData.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div>
                    <h4 className="font-bold mb-3" style={{ color: colors.text.primary }}>Shipping Information</h4>
                    <div className="space-y-2" style={{ color: colors.text.secondary }}>
                      <p>{orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}</p>
                      <p>{orderData.shippingAddress.address}</p>
                      <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}</p>
                      <p>{orderData.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <p style={{ color: colors.text.secondary }}>
                    Estimated delivery date: <span className="font-medium" style={{ color: colors.text.primary }}>
                      {orderData.estimatedDelivery}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }} className="mt-8">
            <CardContent className="p-6 text-center">
              <h3 className="font-bold mb-2" style={{ color: colors.text.primary }}>Need Help?</h3>
              <p className="mb-4" style={{ color: colors.text.secondary }}>
                If you have any questions about your order, please contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  style={{
                    borderColor: colors.border,
                    color: colors.text.primary,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.accent;
                    e.currentTarget.style.color = colors.background;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = colors.text.primary;
                  }}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  +91 98765 43210
                </Button>
                <Button
                  variant="outline"
                  style={{
                    borderColor: colors.border,
                    color: colors.text.primary,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.accent;
                    e.currentTarget.style.color = colors.background;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = colors.text.primary;
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  softberryskincare@gmail.com
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
}
