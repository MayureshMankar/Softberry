import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Eye, 
  X,
  Loader2,
  RefreshCw,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Tag,
  Hash,
  Clock,
  Mail
} from "lucide-react";

export default function AdminOrders() {
  const { colors } = useTheme();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format price helper function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format date helper function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date for display (without time)
  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Check if user is admin
  const checkAdminStatus = () => {
    const isAdmin = localStorage.getItem("isAdmin");
    console.log("AdminOrders - Checking admin status:", isAdmin); // Debug log
    if (isAdmin !== "true") {
      console.log("AdminOrders - Not admin, redirecting to login"); // Debug log
      setLocation("/admin/login");
      return false;
    }
    console.log("AdminOrders - User is admin"); // Debug log
    return true;
  };

  // Connect to WebSocket
  const connectWebSocket = () => {
    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    try {
      // Connect to WebSocket endpoint on same origin via upgrade route
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const host = window.location.host; // includes hostname:port
      const ws = new WebSocket(`${protocol}://${host}/ws/admin`);
      wsRef.current = ws;
      
      // Handle connection open
      ws.onopen = () => {
        console.log("WebSocket connected");
        // Authenticate as admin
        ws.send(JSON.stringify({
          type: 'admin_auth',
          secret: 'Client-Admin-Secret'
        }));
      };
      
      // Handle incoming messages
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'order_update') {
            console.log("Received order update:", data.data);
            handleOrderUpdate(data.data);
          } else if (data.type === 'auth_success') {
            console.log("WebSocket authenticated successfully");
          } else if (data.type === 'auth_error') {
            console.error("WebSocket authentication failed:", data.message);
            // Redirect to login if authentication fails
            localStorage.removeItem("isAdmin");
            setLocation("/admin/login");
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
      
      // Handle connection close
      ws.onclose = () => {
        console.log("WebSocket disconnected");
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          if (checkAdminStatus()) {
            connectWebSocket();
          }
        }, 3000);
      };
      
      // Handle errors
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      // Attempt to reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        if (checkAdminStatus()) {
          connectWebSocket();
        }
      }, 5000);
    }
  };

  // Handle order updates from WebSocket
  const handleOrderUpdate = (updateData: any) => {
    if (updateData.action === 'order_created') {
      // Add new order to the beginning of the list
      setOrders(prev => [updateData.order, ...prev]);
    } else if (updateData.action === 'status_updated') {
      // Update existing order in the list
      setOrders(prev => 
        prev.map(order => 
          order._id === updateData.order._id ? updateData.order : order
        )
      );
      
      // If we're viewing this order's details, update that too
      if (selectedOrder && selectedOrder._id === updateData.order._id) {
        setSelectedOrder(updateData.order);
      }
    }
  };

  // Fetch orders from the API
  const fetchOrders = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      console.log("Fetching orders..."); // Debug log
      
      // Check if user is still admin
      if (!checkAdminStatus()) {
        return;
      }
      
      // Fetch orders from the API
      console.log("Making request to /api/admin/orders");
      const headers = {
        "Authorization": "Client-Admin-Secret"
      };
      console.log("Request headers:", headers); // Debug log
      const response = await fetch("/api/admin/orders", {
        headers,
        // Add cache prevention
        cache: "no-cache"
      });
      console.log("Received response from /api/admin/orders:", response.status);
      console.log("Response headers:", Array.from(response.headers.entries())); // Debug log
      
      console.log("Orders API response status:", response.status); // Debug log
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // If unauthorized, redirect to login
          console.log("Unauthorized access, redirecting to login");
          localStorage.removeItem("isAdmin");
          setLocation("/admin/login");
          return;
        }
        throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Orders fetched successfully:", data.length); // Debug log
      setOrders(data);
    } catch (err) {
      const errorMessage = "Failed to fetch orders: " + (err as Error).message;
      setError(errorMessage);
      console.error("Error fetching orders:", err);
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Update order status WITHOUT sending email
  const updateOrderStatusWithoutEmail = async (orderId: string, newStatus: string) => {
    try {
      console.log(`💾 Saving order ${orderId} status to ${newStatus} (NO EMAIL)`);
      
      if (!checkAdminStatus()) {
        return;
      }
      
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Client-Admin-Secret"
        },
        body: JSON.stringify({ 
          status: newStatus,
          previousStatus: newStatus // Same as new status = backend won't send email
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update order status: ${response.status} ${response.statusText}`);
      }
      
      const updatedOrder = await response.json();
      console.log("✅ Order status saved (no email sent)");
      
      // Update the order in the state
      setOrders(prev => 
        prev.map(order => order._id === orderId ? updatedOrder.order : order)
      );
      
      // If we're viewing this order's details, update that too
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(updatedOrder.order);
      }
    } catch (err) {
      const errorMessage = "Failed to update order status: " + (err as Error).message;
      setError(errorMessage);
      console.error("Error updating order status:", err);
    }
  };

  // Fetch single order details
  const fetchOrderDetails = async (orderId: string) => {
    try {
      console.log(`🔄 Refreshing order ${orderId} details (NO EMAIL)`);
      
      if (!checkAdminStatus()) {
        return;
      }
      
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        headers: {
          "Authorization": "Client-Admin-Secret"
        }
      });
      
      if (response.ok) {
        const fullOrder = await response.json();
        setSelectedOrder(fullOrder);
        console.log("✅ Order details refreshed");
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
    }
  };


  // Send order confirmation email manually (admin only)
  const sendOrderEmail = async (orderId: string) => {
    try {
      console.log('📧 Sending order confirmation email to customer...');
      
      if (!checkAdminStatus()) {
        return;
      }
      
      const response = await fetch(`/api/admin/orders/${orderId}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Client-Admin-Secret"
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showToast('✅ Order confirmation emails sent successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to send emails', 'error');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      showToast('Error sending emails', 'error');
    }
  };

  // Update order status
  

const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      console.log(`📧 Updating order ${orderId} status to ${newStatus}`);
      
      // Check if user is still admin
      if (!checkAdminStatus()) {
        return;
      }
      
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Client-Admin-Secret"
        },
        body: JSON.stringify({ 
          status: newStatus,
          previousStatus: selectedOrder?.status || ''
        })
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // If unauthorized, redirect to login
          console.log("Unauthorized access during status update, redirecting to login");
          localStorage.removeItem("isAdmin");
          setLocation("/admin/login");
          return;
        }
        throw new Error(`Failed to update order status: ${response.status} ${response.statusText}`);
      }
      
      const updatedOrder = await response.json();
      console.log("Order status updated:", updatedOrder); // Debug log
      
      // Update the order in the state
      setOrders(prev => 
        prev.map(order => order._id === orderId ? updatedOrder.order : order)
      );
      
      // If we're viewing this order's details, update that too
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(updatedOrder.order);
      }
    } catch (err) {
      const errorMessage = "Failed to update order status: " + (err as Error).message;
      setError(errorMessage);
      console.error("Error updating order status:", err);
    }
  };

  // View order details
  const viewOrderDetails = async (order: any) => {
    if (!checkAdminStatus()) return;
    
    // If we already have the full order details, use them
    if (order.items && order.shippingAddress && order.billingAddress) {
      setSelectedOrder(order);
      return;
    }
    
    // Otherwise, fetch the full order details
    try {
      const response = await fetch(`/api/admin/orders/${order._id}`, {
        headers: {
          "Authorization": "Client-Admin-Secret"
        }
      });
      
      if (response.ok) {
        const fullOrder = await response.json();
        setSelectedOrder(fullOrder);
      } else {
        // Fallback to the partial order data
        setSelectedOrder(order);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      // Fallback to the partial order data
      setSelectedOrder(order);
    }
  };

  // Close order details
  const closeOrderDetails = () => {
    if (!checkAdminStatus()) return;
    setSelectedOrder(null);
  };

  // Handle manual refresh
  const handleRefresh = () => {
    fetchOrders(true);
  };

  // Fetch orders when component mounts
  useEffect(() => {
    console.log("AdminOrders component mounted"); // Debug log
    
    // Connect to WebSocket for real-time updates
    connectWebSocket();
    
    // Fetch initial orders
    fetchOrders();
    
    // Set up an interval to periodically check admin status
    const interval = setInterval(() => {
      checkAdminStatus();
    }, 30000); // Check every 30 seconds
    
    // Clean up on component unmount
    return () => {
      console.log("Cleaning up AdminOrders"); // Debug log
      
      // Clear interval
      clearInterval(interval);
      
      // Close WebSocket connection
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      // Clear reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    // Remove admin status from localStorage
    localStorage.removeItem("isAdmin");
    // Redirect to admin login
    setLocation("/admin/login");
  };

  const navigateToDashboard = () => {
    if (!checkAdminStatus()) return;
    setLocation("/admin");
  };

  if (loading) {
    console.log("Rendering loading state"); // Debug log
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: colors.text.primary }} />
          <p style={{ color: colors.text.secondary }}>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log("Rendering error state:", error); // Debug log
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center p-6 rounded-lg" style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: colors.text.primary }}>Error</h2>
          <p className="mb-4" style={{ color: colors.text.secondary }}>{error}</p>
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={() => fetchOrders()}
              style={{ backgroundColor: colors.accent, color: colors.background }}
            >
              Retry
            </Button>
            <Button 
              onClick={handleRefresh}
              variant="outline"
              style={{ 
                borderColor: `${colors.text.secondary}33`, 
                color: colors.text.secondary,
                backgroundColor: 'transparent'
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusColors: Record<string, string> = {
      pending: "#f59e0b",
      processing: "#3b82f6",
      shipped: "#8b5cf6",
      delivered: "#10b981",
      cancelled: "#ef4444"
    };
    
    const statusLabels: Record<string, string> = {
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled"
    };
    
    return (
      <span 
        className="px-2 py-1 text-xs rounded-full"
        style={{ 
          backgroundColor: `${statusColors[status] || "#6b7280"}33`,
          color: statusColors[status] || "#6b7280"
        }}
      >
        {statusLabels[status] || status}
      </span>
    );
  };

  // Order details view
  if (selectedOrder) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <div 
          className="border-b px-6 py-4 flex justify-between items-center"
          style={{ 
            backgroundColor: colors.surface,
            borderColor: colors.border
          }}
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={closeOrderDetails}
              variant="outline"
              style={{ 
                borderColor: `${colors.text.secondary}33`, 
                color: colors.text.secondary,
                backgroundColor: 'transparent'
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
            <h1 
              className="font-serif text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Order Details
            </h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            style={{ 
              borderColor: `${colors.text.secondary}33`, 
              color: colors.text.secondary,
              backgroundColor: 'transparent'
            }}
          >
            <X className="h-4 w-4 mr-2" />
            Exit Admin
          </Button>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          {/* Order Summary Banner */}
          <Card className="mb-6" style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Hash className="h-6 w-6" style={{ color: colors.text.secondary }} />
                    <h1 className="font-serif text-2xl font-bold" style={{ color: colors.text.primary }}>
                      Order #{selectedOrder.trackingNumber || selectedOrder._id.substring(0, 8)}
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" style={{ color: colors.text.secondary }} />
                      <span className="text-sm" style={{ color: colors.text.secondary }}>
                        {formatDate(selectedOrder.createdAt)}
                      </span>
                    </div>
                    <StatusBadge status={selectedOrder.status} />
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" style={{ color: colors.text.secondary }} />
                      <span className="text-sm" style={{ color: colors.text.primary }}>
                        {selectedOrder.items?.length || 0} products
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" style={{ color: colors.text.secondary }} />
                      <span className="font-bold" style={{ color: colors.text.primary }}>
                        {formatPrice(selectedOrder.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => fetchOrderDetails(selectedOrder._id)}
                    variant="outline"
                    size="sm"
                    style={{ 
                      borderColor: `${colors.text.secondary}33`, 
                      color: colors.text.secondary,
                      backgroundColor: 'transparent'
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button
                    onClick={closeOrderDetails}
                    variant="outline"
                    size="sm"
                    style={{ 
                      borderColor: `${colors.text.secondary}33`, 
                      color: colors.text.secondary,
                      backgroundColor: 'transparent'
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Information */}
            <Card className="lg:col-span-1" style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" style={{ color: colors.text.secondary }} />
                  <CardTitle style={{ color: colors.text.primary }}>Customer Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>Full Name</p>
                  <p style={{ color: colors.text.primary }}>
                    {selectedOrder.userId?.firstName} {selectedOrder.userId?.lastName}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>Email</p>
                  <p style={{ color: colors.text.primary }}>
                    {selectedOrder.userId?.email}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>Customer ID</p>
                  <p className="font-mono text-sm" style={{ color: colors.text.primary }}>
                    {selectedOrder.userId?._id}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>Order ID</p>
                  <p className="font-mono text-sm" style={{ color: colors.text.primary }}>
                    {selectedOrder._id}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>Order Date</p>
                  <p style={{ color: colors.text.primary }}>
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>Customer Since</p>
                  <p style={{ color: colors.text.primary }}>
                    {selectedOrder.userId?.createdAt ? formatDate(selectedOrder.userId.createdAt) : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="lg:col-span-1" style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" style={{ color: colors.text.secondary }} />
                  <CardTitle style={{ color: colors.text.primary }}>Shipping Address</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>Recipient</p>
                  <p style={{ color: colors.text.primary }}>
                    {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>Address</p>
                  <p style={{ color: colors.text.primary }}>
                    {selectedOrder.shippingAddress?.addressLine1}
                  </p>
                  {selectedOrder.shippingAddress?.addressLine2 && (
                    <p style={{ color: colors.text.primary }}>
                      {selectedOrder.shippingAddress?.addressLine2}
                    </p>
                  )}
                  <p style={{ color: colors.text.primary }}>
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}
                  </p>
                  <p style={{ color: colors.text.primary }}>
                    {selectedOrder.shippingAddress?.country}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>Phone</p>
                  <p style={{ color: colors.text.primary }}>
                    {selectedOrder.shippingAddress?.phone}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card className="lg:col-span-1" style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" style={{ color: colors.text.secondary }} />
                  <CardTitle style={{ color: colors.text.primary }}>Billing Address</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>Recipient</p>
                  <p style={{ color: colors.text.primary }}>
                    {selectedOrder.billingAddress?.firstName} {selectedOrder.billingAddress?.lastName}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>Address</p>
                  <p style={{ color: colors.text.primary }}>
                    {selectedOrder.billingAddress?.addressLine1}
                  </p>
                  {selectedOrder.billingAddress?.addressLine2 && (
                    <p style={{ color: colors.text.primary }}>
                      {selectedOrder.billingAddress?.addressLine2}
                    </p>
                  )}
                  <p style={{ color: colors.text.primary }}>
                    {selectedOrder.billingAddress?.city}, {selectedOrder.billingAddress?.state} {selectedOrder.billingAddress?.postalCode}
                  </p>
                  <p style={{ color: colors.text.primary }}>
                    {selectedOrder.billingAddress?.country}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>Phone</p>
                  <p style={{ color: colors.text.primary }}>
                    {selectedOrder.billingAddress?.phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Product Summary */}
          <Card className="mb-6" style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
            <CardHeader>
              <CardTitle style={{ color: colors.text.primary }}>Quick Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {selectedOrder.items?.map((item: any, index: number) => {
                  const product = item.product || item.productId || {};
                  return (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 rounded-lg border"
                    style={{ 
                      backgroundColor: `${colors.background}33`,
                      borderColor: colors.border
                    }}
                  >
                    <div className="flex-shrink-0">
                      <div className="bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: colors.accent, color: colors.background }}>
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-[120px]">
                      <p className="text-sm font-medium truncate" style={{ color: colors.text.primary }}>
                        {product.name || 'Product'}
                      </p>
                      <p className="text-xs" style={{ color: colors.text.secondary }}>
                        {formatPrice(item.unitPrice)} each
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ 
                            backgroundColor: product?.isActive ? '#10b981' : '#ef4444' 
                          }}
                        ></div>
                        <span 
                          className="text-xs"
                          style={{ 
                            color: product?.isActive ? '#10b981' : '#ef4444' 
                          }}
                        >
                          {product?.isActive ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
              
              <div className="mt-4 pt-4 border-t flex justify-between items-center" style={{ borderColor: colors.border }}>
                <p className="font-medium" style={{ color: colors.text.primary }}>
                  Total Items: {selectedOrder.items?.length || 0}
                </p>
                <p className="font-bold text-lg" style={{ color: colors.text.primary }}>
                  Total Quantity: {selectedOrder.items?.reduce((total: number, item: any) => total + (item.quantity || 0), 0) || 0}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Items Summary */}
          <Card className="mt-6" style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ color: colors.text.primary }}>Ordered Products</CardTitle>
                <span className="text-sm px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}>
                  {selectedOrder.items?.length || 0} items
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedOrder.items?.map((item: any, index: any) => (
                  <div 
                    key={item._id} 
                    className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border"
                    style={{ 
                      backgroundColor: `${colors.background}33`,
                      borderColor: colors.accent
                    }}
                  >
                    <div className="flex-shrink-0">
                      <div className="bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: colors.accent, color: colors.background }}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                      {(item.product || item.productId)?.imageUrl ? (
                        <img 
                          src={(item.product || item.productId)?.imageUrl} 
                          alt={(item.product || item.productId)?.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg" style={{ color: colors.text.primary }}>
                        {(item.product || item.productId)?.name || 'Product Name'}
                      </h4>
                      <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
                        {(item.product || item.productId)?.shortDescription || ((item.product || item.productId)?.description ? (((item.product || item.productId)?.description.substring(0, 100)) + '...') : 'No description available')}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(() => {
                          const prod = (item.product || item.productId) || {};
                          const inStock = !!prod.isActive;
                          return (
                            <>
                              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}>
                                {(prod.categoryId && prod.categoryId.name) || 'No Category'}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}>
                                {(prod.brandId && prod.brandId.name) || 'No Brand'}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${inStock ? '#10b981' : '#ef4444'}20`, color: inStock ? '#10b981' : '#ef4444' }}>
                                {inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                        <div className="p-2 rounded border" style={{ borderColor: colors.border }}>
                          <p className="text-xs" style={{ color: colors.text.secondary }}>Volume</p>
                          <p className="text-sm font-medium" style={{ color: colors.text.primary }}>{(item.product || item.productId)?.volume || 'N/A'}</p>
                        </div>
                        <div className="p-2 rounded border" style={{ borderColor: colors.border }}>
                          <p className="text-xs" style={{ color: colors.text.secondary }}>Gender</p>
                          <p className="text-sm font-medium capitalize" style={{ color: colors.text.primary }}>
                            {(item.product || item.productId)?.gender || 'N/A'}
                          </p>
                        </div>
                        <div className="p-2 rounded border" style={{ borderColor: colors.border }}>
                          <p className="text-xs" style={{ color: colors.text.secondary }}>Rating</p>
                          <p className="text-sm font-medium" style={{ color: colors.text.primary }}>
                            {(item.product || item.productId)?.averageRating ? `${(item.product || item.productId).averageRating}/5` : 'N/A'}
                          </p>
                        </div>
                        <div className="p-2 rounded border" style={{ borderColor: colors.border }}>
                          <p className="text-xs" style={{ color: colors.text.secondary }}>Stock</p>
                          <p className="text-sm font-medium" style={{ color: colors.text.primary }}>
                            {(item.product || item.productId)?.stockQuantity !== undefined ? (item.product || item.productId).stockQuantity : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right md:text-center min-w-[120px]">
                      <div className="bg-accent/10 rounded-lg p-2 mb-2" style={{ backgroundColor: `${colors.accent}20` }}>
                        <p className="text-sm" style={{ color: colors.text.secondary }}>Quantity</p>
                        <p className="font-bold text-lg" style={{ color: colors.text.primary }}>
                          {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm" style={{ color: colors.text.secondary }}>
                        {formatPrice(item.unitPrice)} each
                      </p>
                      <p className="font-bold mt-1" style={{ color: colors.text.primary }}>
                        {formatPrice(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: colors.border }}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold" style={{ color: colors.text.primary }}>Total</span>
                  <span className="text-xl font-bold" style={{ color: colors.text.primary }}>
                    {formatPrice(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Status Management */}
          <Card className="mt-6" style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" style={{ color: colors.text.secondary }} />
                <CardTitle style={{ color: colors.text.primary }}>Order Status Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
                    Update Order Status (Sends Email)
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => setSelectedOrder({...selectedOrder, status: e.target.value})}
                    className="w-full rounded-md border p-2"
                    style={{ 
                      backgroundColor: colors.background,
                      color: colors.text.primary,
                      borderColor: colors.border,
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <Button
                  onClick={() => sendOrderEmail(selectedOrder._id)}
                  variant="default"
                  style={{ 
                    backgroundColor: colors.accent,
                    color: colors.background
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Resend Confirmation Email
                </Button>
                <Button
                  onClick={() => {
                    // Update status WITHOUT sending email (just save the status)
                    updateOrderStatusWithoutEmail(selectedOrder._id, selectedOrder.status)
                  }}
                  variant="outline"
                  style={{ 
                    borderColor: `${colors.text.secondary}33`, 
                    color: colors.text.secondary,
                    backgroundColor: 'transparent'
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Save Status
                </Button>
                <Button
                  onClick={() => fetchOrderDetails(selectedOrder._id)}
                  variant="outline"
                  style={{ 
                    borderColor: `${colors.text.secondary}33`, 
                    color: colors.text.secondary,
                    backgroundColor: 'transparent'
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Order
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="mt-6" style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" style={{ color: colors.text.secondary }} />
                <CardTitle style={{ color: colors.text.primary }}>Payment Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>Payment Method</p>
                  <p style={{ color: colors.text.primary }}>
                    {selectedOrder.paymentMethod ? 
                      (selectedOrder.paymentMethod === 'credit-card' ? 'Credit Card' : 
                       selectedOrder.paymentMethod === 'paypal' ? 'PayPal' : 
                       selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                       selectedOrder.paymentMethod === 'razorpay' ? 'Razorpay' :
                       selectedOrder.paymentMethod.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())) :
                      'N/A'}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>Payment Status</p>
                  <p className="capitalize" style={{ color: colors.text.primary }}>
                    {selectedOrder.paymentStatus || 'N/A'}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>Tracking Number</p>
                  <p style={{ color: colors.text.primary }}>
                    {selectedOrder.trackingNumber || 'N/A'}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.background}33` }}>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>Order Date</p>
                  <p style={{ color: colors.text.primary }}>
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>
              
              {selectedOrder.paymentDetails && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
                  <p className="text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>Payment Details</p>
                  <pre style={{ color: colors.text.primary, whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(selectedOrder.paymentDetails, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Notes */}
          {selectedOrder.notes && (
            <Card className="mt-6" style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
              <CardHeader>
                <CardTitle style={{ color: colors.text.primary }}>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ color: colors.text.primary }}>{selectedOrder.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Product Availability Alerts */}
          {selectedOrder.items?.some((item: any) => !item.product?.isActive || item.product?.stockQuantity < item.quantity) && (
            <Card className="mb-6" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 text-red-500">⚠️</div>
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: '#b91c1c' }}>Product Availability Alert</h3>
                    <ul className="mt-2 space-y-1">
                      {selectedOrder.items?.map((item: any, index: number) => {
                        const warnings = [];
                        if (!item.product?.isActive) {
                          warnings.push('Product is currently unavailable');
                        }
                        if (item.product?.stockQuantity < item.quantity) {
                          warnings.push(`Insufficient stock (Available: ${item.product?.stockQuantity || 0}, Ordered: ${item.quantity})`);
                        }
                        
                        return warnings.length > 0 ? (
                          <li key={index} className="text-sm" style={{ color: '#b91c1c' }}>
                            <span className="font-medium">{item.product?.name || 'Product'}:</span> {warnings.join(', ')}
                          </li>
                        ) : null;
                      }).filter(Boolean)}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Timeline */}
          <Card className="mt-6" style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
            <CardHeader>
              <CardTitle style={{ color: colors.text.primary }}>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.accent }}></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium" style={{ color: colors.text.primary }}>Order Placed</p>
                      <p className="text-sm" style={{ color: colors.text.secondary }}>
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                    </div>
                    <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
                      Order confirmed and processing started
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 w-0.5 h-8 -mt-1 ml-1.5" style={{ backgroundColor: `${colors.text.secondary}33` }}></div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: selectedOrder.status === 'processing' || 
                                        selectedOrder.status === 'shipped' || 
                                        selectedOrder.status === 'delivered' 
                          ? colors.accent 
                          : `${colors.text.secondary}33` 
                      }}
                    ></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p 
                        className="font-medium" 
                        style={{ 
                          color: selectedOrder.status === 'processing' || 
                                 selectedOrder.status === 'shipped' || 
                                 selectedOrder.status === 'delivered' 
                            ? colors.text.primary 
                            : `${colors.text.secondary}80` 
                        }}
                      >
                        Processing
                      </p>
                      {selectedOrder.status === 'processing' && (
                        <p className="text-sm" style={{ color: colors.text.secondary }}>
                          {formatDate(selectedOrder.updatedAt || selectedOrder.createdAt)}
                        </p>
                      )}
                    </div>
                    <p 
                      className="text-sm mt-1" 
                      style={{ 
                        color: selectedOrder.status === 'processing' || 
                               selectedOrder.status === 'shipped' || 
                               selectedOrder.status === 'delivered' 
                          ? colors.text.secondary 
                          : `${colors.text.secondary}80` 
                      }}
                    >
                      Order is being prepared for shipment
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div 
                    className="flex-shrink-0 w-0.5 h-8 -mt-1 ml-1.5" 
                    style={{ 
                      backgroundColor: selectedOrder.status === 'shipped' || 
                                      selectedOrder.status === 'delivered' 
                        ? `${colors.text.secondary}33` 
                        : 'transparent' 
                    }}
                  ></div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: selectedOrder.status === 'shipped' || 
                                        selectedOrder.status === 'delivered' 
                          ? colors.accent 
                          : `${colors.text.secondary}33` 
                      }}
                    ></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p 
                        className="font-medium" 
                        style={{ 
                          color: selectedOrder.status === 'shipped' || 
                                 selectedOrder.status === 'delivered' 
                            ? colors.text.primary 
                            : `${colors.text.secondary}80` 
                        }}
                      >
                        Shipped
                      </p>
                      {selectedOrder.status === 'shipped' && (
                        <p className="text-sm" style={{ color: colors.text.secondary }}>
                          {selectedOrder.updatedAt ? formatDate(selectedOrder.updatedAt) : 'N/A'}
                        </p>
                      )}
                    </div>
                    <p 
                      className="text-sm mt-1" 
                      style={{ 
                        color: selectedOrder.status === 'shipped' || 
                               selectedOrder.status === 'delivered' 
                          ? colors.text.secondary 
                          : `${colors.text.secondary}80` 
                      }}
                    >
                      Order has been shipped
                    </p>
                    {selectedOrder.status === 'shipped' && selectedOrder.trackingNumber && (
                      <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
                        <span className="font-medium">Tracking Number:</span> {selectedOrder.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex">
                  <div 
                    className="flex-shrink-0 w-0.5 h-8 -mt-1 ml-1.5" 
                    style={{ 
                      backgroundColor: selectedOrder.status === 'delivered' 
                        ? `${colors.text.secondary}33` 
                        : 'transparent' 
                    }}
                  ></div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: selectedOrder.status === 'delivered' 
                          ? colors.accent 
                          : `${colors.text.secondary}33` 
                      }}
                    ></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p 
                        className="font-medium" 
                        style={{ 
                          color: selectedOrder.status === 'delivered' 
                            ? colors.text.primary 
                            : `${colors.text.secondary}80` 
                        }}
                      >
                        Delivered
                      </p>
                      {selectedOrder.status === 'delivered' && selectedOrder.updatedAt && (
                        <p className="text-sm" style={{ color: colors.text.secondary }}>
                          {formatDate(selectedOrder.updatedAt)}
                        </p>
                      )}
                    </div>
                    <p 
                      className="text-sm mt-1" 
                      style={{ 
                        color: selectedOrder.status === 'delivered' 
                          ? colors.text.secondary 
                          : `${colors.text.secondary}80` 
                      }}
                    >
                      Order has been delivered to the customer
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Orders list view
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div 
        className="border-b px-6 py-4 flex justify-between items-center"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border
        }}
      >
        <div className="flex items-center gap-4">
          <Button
            onClick={navigateToDashboard}
            variant="outline"
            style={{ 
              borderColor: `${colors.text.secondary}33`, 
              color: colors.text.secondary,
              backgroundColor: 'transparent'
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <h1 
            className="font-serif text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            Order Management
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isRefreshing}
            style={{ 
              borderColor: `${colors.text.secondary}33`, 
              color: colors.text.secondary,
              backgroundColor: 'transparent'
            }}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            style={{ 
              borderColor: `${colors.text.secondary}33`, 
              color: colors.text.secondary,
              backgroundColor: 'transparent'
            }}
          >
            <X className="h-4 w-4 mr-2" />
            Exit Admin
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <Card style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle style={{ color: colors.text.primary }}>
                Orders ({orders.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <div className="text-sm" style={{ color: colors.text.secondary }}>
                  Real-time updates enabled
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12" style={{ color: colors.text.secondary }}>
                <ShoppingCart className="h-12 w-12 mx-auto mb-4" style={{ color: colors.text.secondary }} />
                <p className="mb-4">No orders found</p>
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div 
                    key={order._id} 
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ 
                      backgroundColor: `${colors.background}33`
                    }}
                    onClick={() => viewOrderDetails(order)}
                  >
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: `${colors.accent}20` }}>
                        <Package className="h-5 w-5" style={{ color: colors.accent }} />
                      </div>
                      <div>
                        <h3 className="font-medium flex items-center gap-2" style={{ color: colors.text.primary }}>
                          <Hash className="h-4 w-4" />
                          {order.trackingNumber || order._id.substring(0, 8)}
                        </h3>
                        <p className="text-sm flex items-center gap-1" style={{ color: colors.text.secondary }}>
                          <User className="h-3 w-3" />
                          {order.userId?.firstName} {order.userId?.lastName}
                        </p>
                        <p className="text-xs flex items-center gap-1" style={{ color: colors.text.tertiary }}>
                          <Calendar className="h-3 w-3" />
                          {formatDateShort(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold" style={{ color: colors.text.primary }}>
                          {formatPrice(order.totalAmount)}
                        </p>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={order.status} />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          viewOrderDetails(order);
                        }}
                        style={{ color: colors.text.secondary }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
