import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { 
  Package, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle,
  Truck,
  XCircle
} from "lucide-react";

interface OrderItem {
  _id?: string;
  id?: string;
  productId: {
    _id: string;
    id?: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  product?: {
    _id: string;
    id?: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

interface Order {
  _id: string;
  id?: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  trackingNumber: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    email?: string;
    phone?: string;
  };
}

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-500", label: "Pending" },
  processing: { icon: Clock, color: "text-blue-500", label: "Processing" },
  shipped: { icon: Truck, color: "text-indigo-500", label: "Shipped" },
  "out-for-delivery": { icon: MapPin, color: "text-purple-500", label: "Out for Delivery" },
  delivered: { icon: CheckCircle, color: "text-green-500", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-500", label: "Cancelled" },
};

export default function MyOrders() {
  const { colors } = useTheme();
  const { user, token } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch user orders
  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: async () => {
      const response = await fetch("/api/orders", {
        headers: {
          "Authorization": `Bearer ${token || ""}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
    enabled: !!token,
  });

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-champagne mx-auto mb-4"></div>
          <p style={{ color: colors.text.secondary }}>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center max-w-md">
          <XCircle className="h-16 w-16 mx-auto mb-4" style={{ color: '#ef4444' }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text.primary }}>Error Loading Orders</h2>
          <p className="mb-6" style={{ color: colors.text.secondary }}>
            There was a problem loading your orders. Please try again.
          </p>
          <Button
            onClick={() => refetch()}
            style={{ backgroundColor: colors.accent, color: colors.background }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: colors.text.primary }}>
              My Orders
            </h1>
            <p style={{ color: colors.text.secondary }}>
              Track and manage your orders
            </p>
          </div>

          {orders.length === 0 ? (
            <Card style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <CardContent className="py-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4" style={{ color: colors.text.secondary }} />
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text.primary }}>
                  No Orders Yet
                </h2>
                <p className="mb-6" style={{ color: colors.text.secondary }}>
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Link href="/products">
                  <Button style={{ backgroundColor: colors.accent, color: colors.background }}>
                    Start Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Orders List */}
              <div className="lg:col-span-1">
                <Card style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.text.primary }}>
                      Order History ({orders.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {orders.map((order: Order) => {
                      const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                      const Icon = statusInfo.icon;
                      
                      return (
                        <div 
                          key={order._id}
                          className={`p-4 rounded-lg cursor-pointer transition-colors ${
                            selectedOrder?._id === order._id 
                              ? 'ring-2 ring-champagne' 
                              : 'hover:bg-[#F8F7F4] dark:hover:bg-[#111111]'
                          }`}
                          style={{ 
                            backgroundColor: selectedOrder?._id === order._id 
                              ? `${colors.accent}10` 
                              : 'transparent'
                          }}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium" style={{ color: colors.text.primary }}>
                                Order #{order._id?.slice(-6) || order.id?.slice(-6)}
                              </h3>
                              <p className="text-sm" style={{ color: colors.text.secondary }}>
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className={`flex items-center ${statusInfo.color}`}>
                              <Icon className="h-4 w-4 mr-1" />
                              <span className="text-sm">{statusInfo.label}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <p style={{ color: colors.text.primary }}>
                              {formatPrice(order.totalAmount)}
                            </p>
                            <p className="text-sm" style={{ color: colors.text.secondary }}>
                              {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Order Details */}
              <div className="lg:col-span-2">
                {selectedOrder ? (
                  <Card style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="font-serif text-2xl" style={{ color: colors.text.primary }}>
                            Order Details
                          </CardTitle>
                          <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
                            Order #{selectedOrder._id?.slice(-6) || selectedOrder.id?.slice(-6)} • {formatDate(selectedOrder.createdAt)}
                          </p>
                        </div>
                        <div className={`flex items-center ${statusConfig[selectedOrder.status as keyof typeof statusConfig]?.color || 'text-yellow-500'}`}>
                          {(() => {
                            const StatusIcon = statusConfig[selectedOrder.status as keyof typeof statusConfig]?.icon;
                            return StatusIcon ? <StatusIcon className="h-5 w-5 mr-2" /> : null;
                          })()}
                          <span className="font-medium">
                            {statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label || 'Pending'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Order Items */}
                      <div>
                        <h3 className="font-semibold mb-3" style={{ color: colors.text.primary }}>
                          Items in this order
                        </h3>
                        <div className="space-y-4">
                          {selectedOrder.items?.map((item) => {
                            // Handle different product data structures
                            const product = item.product || item.productId || {};
                            const productId = product._id || product.id;
                            const productName = product.name || "Unknown Product";
                            const productImage = product.imageUrl;
                            const unitPrice = item.unitPrice || product.price || 0;
                            const quantity = item.quantity || 1;
                            const totalPrice = item.totalPrice || (unitPrice * quantity);
                            
                            return (
                              <div key={item._id || productId} className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                                {productImage ? (
                                  <img 
                                    src={productImage} 
                                    alt={productName} 
                                    className="w-16 h-16 rounded-md object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-16 rounded-md flex items-center justify-center" style={{ backgroundColor: colors.background }}>
                                    <Package className="h-8 w-8" style={{ color: colors.text.secondary }} />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h4 className="font-medium" style={{ color: colors.text.primary }}>
                                    {productName}
                                  </h4>
                                  <p className="text-sm" style={{ color: colors.text.secondary }}>
                                    Qty: {quantity} × {formatPrice(unitPrice)}
                                  </p>
                                </div>
                                <div className="font-medium" style={{ color: colors.text.primary }}>
                                  {formatPrice(totalPrice)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div>
                        <h3 className="font-semibold mb-3" style={{ color: colors.text.primary }}>
                          Order Summary
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span style={{ color: colors.text.secondary }}>Subtotal</span>
                            <span style={{ color: colors.text.primary }}>
                              {formatPrice(selectedOrder.totalAmount)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: colors.text.secondary }}>Shipping</span>
                            <span style={{ color: colors.text.primary }}>Free</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t" style={{ borderColor: colors.border }}>
                            <span className="font-semibold" style={{ color: colors.text.primary }}>Total</span>
                            <span className="font-semibold" style={{ color: colors.text.primary }}>
                              {formatPrice(selectedOrder.totalAmount)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Information */}
                      <div>
                        <h3 className="font-semibold mb-3" style={{ color: colors.text.primary }}>
                          Shipping Information
                        </h3>
                        <div className="space-y-2" style={{ color: colors.text.secondary }}>
                          <p>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                          <p>{selectedOrder.shippingAddress.address}</p>
                          <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                          <p>{selectedOrder.shippingAddress.country}</p>
                          {selectedOrder.shippingAddress.email && (
                            <p>Email: {selectedOrder.shippingAddress.email}</p>
                          )}
                          {selectedOrder.shippingAddress.phone && (
                            <p>Phone: {selectedOrder.shippingAddress.phone}</p>
                          )}
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div>
                        <h3 className="font-semibold mb-3" style={{ color: colors.text.primary }}>
                          Payment Information
                        </h3>
                        <div className="flex items-center gap-3" style={{ color: colors.text.secondary }}>
                          <CreditCard className="w-5 h-5" />
                          <span>
                            {selectedOrder.paymentMethod === 'credit-card' ? 'Credit Card' : 
                             selectedOrder.paymentMethod === 'paypal' ? 'PayPal' : 
                             selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                             selectedOrder.paymentMethod === 'razorpay' ? 'Razorpay' :
                             selectedOrder.paymentMethod}
                          </span>
                        </div>
                      </div>

                      {/* Tracking */}
                      <div>
                        <h3 className="font-semibold mb-3" style={{ color: colors.text.primary }}>
                          Tracking Information
                        </h3>
                        <div className="flex items-center gap-3" style={{ color: colors.text.secondary }}>
                          <Package className="w-5 h-5" />
                          <span>Tracking Number: {selectedOrder.trackingNumber || 'N/A'}</span>
                        </div>
                        {selectedOrder.trackingNumber && (
                          <Button 
                            variant="outline" 
                            className="mt-3"
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
                            <Link href={`/order-tracking/${selectedOrder.trackingNumber}`}>
                              Track Package
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                    <CardContent className="py-12 text-center">
                      <Package className="h-16 w-16 mx-auto mb-4" style={{ color: colors.text.secondary }} />
                      <h3 className="text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
                        Select an Order
                      </h3>
                      <p style={{ color: colors.text.secondary }}>
                        Choose an order from the list to view details
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}