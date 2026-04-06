import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LogOut, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Plus, 
  Eye, 
  Star,
  Loader2
} from "lucide-react";

export default function AdminDashboard() {
  const { colors } = useTheme();
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    featuredProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format price helper function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      // Check if user is still admin
      const isAdmin = localStorage.getItem("isAdmin");
      if (isAdmin !== "true") {
        setLocation("/admin/login");
        return;
      }
      
      // Fetch product stats from the API
      const productsResponse = await fetch("/api/admin/products", {
        headers: {
          "Authorization": "Client-Admin-Secret"
        }
      });
      
      // Handle special redirect response
      if (productsResponse.status === 418) {
        const data = await productsResponse.json();
        if (data.redirectTo) {
          localStorage.removeItem("isAdmin");
          setLocation(data.redirectTo);
          return;
        }
      }
      
      if (!productsResponse.ok) {
        if (productsResponse.status === 401 || productsResponse.status === 403) {
          // If unauthorized, redirect to login
          localStorage.removeItem("isAdmin");
          setLocation("/admin/login");
          return;
        }
        throw new Error(`Failed to fetch products: ${productsResponse.status} ${productsResponse.statusText}`);
      }
      
      const products = await productsResponse.json();
      
      // Fetch order stats from the API
      const ordersResponse = await fetch("/api/admin/orders", {
        headers: {
          "Authorization": "Client-Admin-Secret"
        }
      });
      
      // Handle special redirect response for orders
      if (ordersResponse.status === 418) {
        const data = await ordersResponse.json();
        if (data.redirectTo) {
          localStorage.removeItem("isAdmin");
          setLocation(data.redirectTo);
          return;
        }
      }
      
      let orders = [];
      if (ordersResponse.ok) {
        orders = await ordersResponse.json();
      }
      
      // Calculate stats based on the fetched data
      const totalProducts = products.length;
      const activeProducts = products.filter((p: any) => p.isActive).length;
      const featuredProducts = products.filter((p: any) => p.isFeatured).length;
      
      setStats({
        totalProducts,
        activeProducts,
        featuredProducts,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0),
        totalUsers: 0 // Placeholder for now
      });
    } catch (err) {
      const errorMessage = "Failed to load dashboard data: " + (err as Error).message;
      setError(errorMessage);
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Remove admin status from localStorage
    localStorage.removeItem("isAdmin");
    // Redirect to admin login
    setLocation("/admin/login");
  };

  const navigateToProducts = () => {
    setLocation("/admin/products");
  };

  const navigateToOrders = () => {
    setLocation("/admin/orders");
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = "default",
    isCurrency = false
  }: { 
    title: string; 
    value: number | string; 
    icon: any; 
    color?: "default" | "green" | "blue" | "yellow" | "red" | "purple";
    isCurrency?: boolean;
  }) => {
    const colorClasses = {
      default: colors.text.primary,
      green: "#4ade80",
      blue: "#60a5fa",
      yellow: "#fbbf24",
      red: "#f87171",
      purple: "#c084fc",
    };

    // Format value for display
    const displayValue = isCurrency 
      ? formatPrice(typeof value === 'number' ? value : 0)
      : value;

    return (
      <Card style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>{title}</p>
              <p className="text-3xl font-bold" style={{ color: colors.text.primary }}>{displayValue}</p>
            </div>
            <Icon className="h-8 w-8" style={{ color: colorClasses[color] }} />
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: colors.text.primary }} />
          <p style={{ color: colors.text.secondary }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center p-6 rounded-lg" style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: colors.text.primary }}>Error</h2>
          <p className="mb-4" style={{ color: colors.text.secondary }}>{error}</p>
          <Button 
            onClick={fetchStats}
            style={{ backgroundColor: colors.accent, color: colors.background }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
        <h1 
          className="font-serif text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          Admin Dashboard
        </h1>
        <Button
          onClick={handleLogout}
          variant="outline"
          style={{ 
            borderColor: `${colors.text.secondary}33`, 
            color: colors.text.secondary,
            backgroundColor: 'transparent'
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard 
            title="Total Products" 
            value={stats.totalProducts} 
            icon={Package} 
            color="blue" 
          />
          <StatCard 
            title="Active Products" 
            value={stats.activeProducts} 
            icon={Eye} 
            color="green" 
          />
          <StatCard 
            title="Featured" 
            value={stats.featuredProducts} 
            icon={Star} 
            color="yellow" 
          />
          <StatCard 
            title="Total Orders" 
            value={stats.totalOrders} 
            icon={ShoppingCart} 
            color="purple" 
          />
          <StatCard 
            title="Total Revenue" 
            value={stats.totalRevenue} 
            icon={TrendingUp} 
            color="green" 
            isCurrency={true}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={navigateToProducts}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Package className="h-8 w-8 mb-3" style={{ color: colors.text.secondary }} />
                  <h3 className="text-lg font-semibold mb-1" style={{ color: colors.text.primary }}>Products</h3>
                  <p className="text-sm mb-3" style={{ color: colors.text.secondary }}>Manage your product catalog</p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-normal"
                    style={{ color: colors.accent }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToProducts();
                    }}
                  >
                    View all <span className="ml-1">→</span>
                  </Button>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: colors.text.primary }}>{stats.totalProducts}</div>
                  <div className="text-xs" style={{ color: colors.text.secondary }}>items</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={navigateToOrders}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <ShoppingCart className="h-8 w-8 mb-3" style={{ color: colors.text.secondary }} />
                  <h3 className="text-lg font-semibold mb-1" style={{ color: colors.text.primary }}>Orders</h3>
                  <p className="text-sm mb-3" style={{ color: colors.text.secondary }}>Manage customer orders</p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-normal"
                    style={{ color: colors.accent }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToOrders();
                    }}
                  >
                    View all <span className="ml-1">→</span>
                  </Button>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: colors.text.primary }}>{stats.totalOrders}</div>
                  <div className="text-xs" style={{ color: colors.text.secondary }}>orders</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }} 
            className="opacity-60"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Users className="h-8 w-8 mb-3" style={{ color: colors.text.secondary }} />
                  <h3 className="text-lg font-semibold mb-1" style={{ color: colors.text.primary }}>Customers</h3>
                  <p className="text-sm mb-3" style={{ color: colors.text.secondary }}>Manage customer accounts</p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-normal opacity-50"
                    style={{ color: colors.accent }}
                    disabled
                  >
                    Coming soon
                  </Button>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: colors.text.primary }}>{stats.totalUsers}</div>
                  <div className="text-xs" style={{ color: colors.text.secondary }}>users</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}