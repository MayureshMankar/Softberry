import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Calendar,
  Mail,
  Phone,
  MapPin,
  CreditCard
} from "lucide-react";

export default function OrderConfirmation() {
  const { colors } = useTheme();
  const { token } = useAuth();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  // Fetch the most recent order
  useEffect(() => {
    const fetchRecentOrder = async () => {
      try {
        const response = await fetch("/api/orders", {
          headers: {
            "Authorization": `Bearer ${token || ""}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        
        const orders = await response.json();
        
        // Get the most recent order
        if (orders && orders.length > 0) {
          // Sort orders by creation date to get the most recent one
          const sortedOrders = orders.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          const recentOrder = sortedOrders[0];
          setOrderData(recentOrder);
        } else {
          // Fallback to static data if no orders found
          setOrderData({
            orderNumber: "ORD-789456",
            orderDate: "September 2, 2025",
            estimatedDelivery: "September 7-9, 2025",
            totalAmount: 15700,
            shippingAddress: {
              name: "John Doe",
              address: "123 Luxury Avenue",
              city: "Mumbai",
              state: "Maharashtra",
              zipCode: "400001",
              country: "India",
              email: "john.doe@example.com",
              phone: "+91 98765 43210"
            },
            paymentMethod: "Credit Card ending in 1234",
            items: [
              {
                id: "1",
                name: "Midnight Essence",
                price: 12500,
                quantity: 1,
                imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
                volume: "100ml"
              },
              {
                id: "2",
                name: "Ocean Breeze",
                price: 9500,
                quantity: 2,
                imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&h=400&fit=crop",
                volume: "75ml"
              }
            ]
          });
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
        
        // Fallback to static data on error
        setOrderData({
          orderNumber: "ORD-789456",
          orderDate: "September 2, 2025",
          estimatedDelivery: "September 7-9, 2025",
          totalAmount: 15700,
          shippingAddress: {
            name: "John Doe",
            address: "123 Luxury Avenue",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400001",
            country: "India",
            email: "john.doe@example.com",
            phone: "+91 98765 43210"
          },
          paymentMethod: "Credit Card ending in 1234",
          items: [
            {
              id: "1",
              name: "Midnight Essence",
              price: 12500,
              quantity: 1,
              imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
              volume: "100ml"
            },
            {
              id: "2",
              name: "Ocean Breeze",
              price: 9500,
              quantity: 2,
              imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&h=400&fit=crop",
              volume: "75ml"
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRecentOrder();
    } else {
      // Fallback to static data if not authenticated
      setOrderData({
        orderNumber: "ORD-789456",
        orderDate: "September 2, 2025",
        estimatedDelivery: "September 7-9, 2025",
        totalAmount: 15700,
        shippingAddress: {
          name: "John Doe",
          address: "123 Luxury Avenue",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001",
          country: "India",
          email: "john.doe@example.com",
          phone: "+91 98765 43210"
        },
        paymentMethod: "Credit Card ending in 1234",
        items: [
          {
            id: "1",
            name: "Midnight Essence",
            price: 12500,
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
            volume: "100ml"
          },
          {
            id: "2",
            name: "Ocean Breeze",
            price: 9500,
            quantity: 2,
            imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&h=400&fit=crop",
            volume: "75ml"
          }
        ]
      });
      setLoading(false);
    }
  }, [token]);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-champagne mx-auto mb-4"></div>
          <p style={{ color: colors.text.secondary }}>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <Package className="h-16 w-16 mx-auto mb-4" style={{ color: colors.text.secondary }} />
            <h1 
              className="font-serif text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Error Loading Order
            </h1>
            <p 
              className="mb-8"
              style={{ color: colors.text.secondary }}
            >
              {error}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="transition-all duration-300"
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
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate estimated delivery date (3-5 business days from order date)
  const calculateEstimatedDelivery = (orderDate: string) => {
    const orderDateObj = new Date(orderDate);
    const deliveryStartDate = new Date(orderDateObj);
    deliveryStartDate.setDate(orderDateObj.getDate() + 3);
    
    const deliveryEndDate = new Date(orderDateObj);
    deliveryEndDate.setDate(orderDateObj.getDate() + 5);
    
    return `${deliveryStartDate.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })} - ${deliveryEndDate.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    if (!orderData.items) return 0;
    return orderData.items.reduce((sum: number, item: any) => {
      const price = item.unitPrice || item.product?.price || item.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
  };

  // Get estimated delivery date text
  const getEstimatedDeliveryText = () => {
    if (orderData.estimatedDelivery) {
      return orderData.estimatedDelivery;
    }
    
    if (orderData.createdAt) {
      return calculateEstimatedDelivery(orderData.createdAt);
    }
    
    return "3-5 business days";
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
              Order Confirmation
            </h1>
            <p style={{ color: colors.text.secondary }}>
              Thank you for your purchase
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }} className="mb-8">
            <CardContent className="text-center py-12">
              <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${colors.accent}20` }}>
                <CheckCircle className="w-12 h-12" style={{ color: colors.accent }} />
              </div>
              
              <h2 
                className="font-serif text-3xl font-bold mb-4"
                style={{ color: colors.text.primary }}
              >
                Order Placed Successfully!
              </h2>
              
              <p className="text-xl mb-2" style={{ color: colors.text.primary }}>
                Thank you for your order, {orderData.shippingAddress?.firstName || orderData.shippingAddress?.name || "Valued Customer"}!
              </p>
              
              <p className="mb-6" style={{ color: colors.text.secondary }}>
                A confirmation email has been sent to {orderData.shippingAddress?.email || "your email address"}
              </p>
              
              <div className="inline-block bg-[#F8F7F4] dark:bg-[#111111] rounded-lg px-6 py-3">
                <p className="font-bold" style={{ color: colors.text.primary }}>
                  Order Number: <span style={{ color: colors.accent }}>{orderData._id ? `#${orderData._id.substring(0, 8).toUpperCase()}` : orderData.orderNumber}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl flex items-center gap-2" style={{ color: colors.text.primary }}>
                    <Package className="w-5 h-5" style={{ color: colors.accent }} />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {orderData.items && orderData.items.map((item: any) => (
                      <div key={item._id || item.id} className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product?.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              style={{ backgroundColor: colors.surfaceSecondary }}
                            />
                          ) : item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              style={{ backgroundColor: colors.surfaceSecondary }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.surfaceSecondary }}>
                              <Package className="w-8 h-8" style={{ color: colors.text.secondary }} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold" style={{ color: colors.text.primary }}>
                            {item.product?.name || item.name}
                          </h3>
                          {(item.product?.volume || item.volume) && (
                            <p className="text-sm mb-2" style={{ color: colors.text.secondary }}>
                              {item.product?.volume || item.volume}
                            </p>
                          )}
                          <div className="flex justify-between items-center">
                            <p style={{ color: colors.text.secondary }}>
                              Qty: {item.quantity || 1}
                            </p>
                            <p className="font-bold" style={{ color: colors.text.primary }}>
                              {formatPrice((item.unitPrice || item.product?.price || item.price || 0) * (item.quantity || 1))}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4" style={{ borderColor: colors.border }}>
                    <div className="flex justify-between mb-2">
                      <span style={{ color: colors.text.secondary }}>Subtotal</span>
                      <span style={{ color: colors.text.primary }}>{formatPrice(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span style={{ color: colors.text.secondary }}>Shipping</span>
                      <span style={{ color: colors.accent }}>Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2" style={{ borderTop: `1px solid ${colors.border}` }}>
                      <span style={{ color: colors.text.primary }}>Total</span>
                      <span style={{ color: colors.text.primary }}>{formatPrice(orderData.totalAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl flex items-center gap-2" style={{ color: colors.text.primary }}>
                    <Truck className="w-5 h-5" style={{ color: colors.accent }} />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: colors.accent }} />
                    <div style={{ color: colors.text.secondary }}>
                      <p className="font-bold mb-1" style={{ color: colors.text.primary }}>
                        {orderData.shippingAddress?.firstName} {orderData.shippingAddress?.lastName}
                      </p>
                      <p>{orderData.shippingAddress?.address}</p>
                      <p>
                        {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} {orderData.shippingAddress?.zipCode}
                      </p>
                      <p>{orderData.shippingAddress?.country}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 flex-shrink-0" style={{ color: colors.accent }} />
                    <p style={{ color: colors.text.secondary }}>{orderData.shippingAddress?.email}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 flex-shrink-0" style={{ color: colors.accent }} />
                    <p style={{ color: colors.text.secondary }}>{orderData.shippingAddress?.phone}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 flex-shrink-0" style={{ color: colors.accent }} />
                    <div>
                      <p style={{ color: colors.text.secondary }}>Order Date</p>
                      <p className="font-bold" style={{ color: colors.text.primary }}>
                        {orderData.createdAt ? formatDate(orderData.createdAt) : orderData.orderDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl flex items-center gap-2" style={{ color: colors.text.primary }}>
                    <CreditCard className="w-5 h-5" style={{ color: colors.accent }} />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 flex-shrink-0" style={{ color: colors.accent }} />
                    <div>
                      <p style={{ color: colors.text.secondary }}>Payment Method</p>
                      <p className="font-bold" style={{ color: colors.text.primary }}>
                        {orderData.paymentMethod === 'credit-card' ? 'Credit Card' : 
                         orderData.paymentMethod === 'paypal' ? 'PayPal' : 
                         orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                         orderData.paymentMethod === 'razorpay' ? 'Razorpay' :
                         orderData.paymentMethod}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* What's Next */}
              <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
                <CardHeader>
                  <CardTitle className="font-serif text-xl" style={{ color: colors.text.primary }}>
                    What's Next?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.accent}20` }}>
                      <span className="font-bold text-sm" style={{ color: colors.accent }}>1</span>
                    </div>
                    <div>
                      <p className="font-bold mb-1" style={{ color: colors.text.primary }}>Order Processing</p>
                      <p className="text-sm" style={{ color: colors.text.secondary }}>We're preparing your order</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.accent}20` }}>
                      <span className="font-bold text-sm" style={{ color: colors.accent }}>2</span>
                    </div>
                    <div>
                      <p className="font-bold mb-1" style={{ color: colors.text.primary }}>Shipment</p>
                      <p className="text-sm" style={{ color: colors.text.secondary }}>Your order will be shipped</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}>
                      <span className="font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-bold mb-1" style={{ color: colors.text.primary }}>Delivery</p>
                      <p className="text-sm" style={{ color: colors.text.secondary }}>
                        Estimated delivery: {getEstimatedDeliveryText()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Need Help */}
              <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
                <CardHeader>
                  <CardTitle className="font-serif text-xl" style={{ color: colors.text.primary }}>
                    Need Help?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm" style={{ color: colors.text.secondary }}>
                    If you have any questions about your order, please contact our customer service team.
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-sm flex items-center gap-2" style={{ color: colors.text.secondary }}>
                      <Mail className="w-4 h-4" style={{ color: colors.accent }} />
                      softberryskincare@gmail.com
                    </p>
                    <p className="text-sm flex items-center gap-2" style={{ color: colors.text.secondary }}>
                      <Phone className="w-4 h-4" style={{ color: colors.accent }} />
                      +91 98765 43210
                    </p>
                  </div>
                  
                  <Button 
                    asChild
                    className="w-full"
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
                    <Link href="/contact">
                      Contact Support
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-4">
                <Button 
                  asChild
                  className="w-full"
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
                  <Link href="/profile">
                    View Order Details
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline"
                  className="w-full"
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
                  <Link href="/products">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
}
