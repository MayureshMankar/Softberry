import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  User, 
  Mail, 
  Lock, 
  Package, 
  Clock,
  CheckCircle,
  TruckIcon,
  Edit2,
  Save,
  X
} from "lucide-react";

// Added the Link import here to ensure it's only imported once
import { Link } from "wouter";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; email: string }) => {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(editForm);
  };

  const handleCancelEdit = () => {
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  // Fetch orders from API
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ["profileOrders"],
    queryFn: async () => {
      const response = await fetch("/api/orders", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      
      return response.json();
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-900/30 text-green-300 border-green-500/30"><CheckCircle className="h-3 w-3 mr-1" />Delivered</Badge>;
      case "processing":
        return <Badge className="bg-blue-900/30 text-blue-300 border-blue-500/30"><Clock className="h-3 w-3 mr-1" />Processing</Badge>;
      case "shipped":
        return <Badge className="bg-yellow-900/30 text-yellow-300 border-yellow-500/30"><TruckIcon className="h-3 w-3 mr-1" />Shipped</Badge>;
      default:
        return <Badge className="bg-gray-900/30 text-gray-300 border-gray-500/30">{status}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.text.primary }}>
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: colors.text.primary }}>My Profile</h1>
            <p style={{ color: colors.text.secondary }}>Manage your account settings and view your order history</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="font-serif flex items-center" style={{ color: colors.text.primary }}>
                      <User className="h-5 w-5 mr-2" />
                      Profile Information
                    </CardTitle>
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                        style={{ 
                          borderColor: `${colors.text.primary}33`, 
                          color: colors.text.primary,
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveProfile}
                          size="sm"
                          style={{ 
                            backgroundColor: colors.accent, 
                            color: colors.background 
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                          disabled={updateProfileMutation.isPending}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          size="sm"
                          style={{ 
                            borderColor: `${colors.text.primary}33`, 
                            color: colors.text.primary,
                            backgroundColor: 'transparent'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ff000008'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" style={{ color: colors.text.primary }}>First Name</Label>
                      {isEditing ? (
                        <Input
                          id="firstName"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                          style={{ 
                            borderColor: `${colors.border}33`, 
                            color: colors.text.primary,
                            backgroundColor: colors.surface
                          }}
                        />
                      ) : (
                        <p className="font-medium mt-1" style={{ color: colors.text.primary }}>{user?.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName" style={{ color: colors.text.primary }}>Last Name</Label>
                      {isEditing ? (
                        <Input
                          id="lastName"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                          style={{ 
                            borderColor: `${colors.border}33`, 
                            color: colors.text.primary,
                            backgroundColor: colors.surface
                          }}
                        />
                      ) : (
                        <p className="font-medium mt-1" style={{ color: colors.text.primary }}>{user?.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" style={{ color: colors.text.primary }}>Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        style={{ 
                          borderColor: `${colors.border}33`, 
                          color: colors.text.primary,
                          backgroundColor: colors.surface
                        }}
                      />
                    ) : (
                      <p className="font-medium mt-1" style={{ color: colors.text.primary }}>{user?.email}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Password Section */}
              <Card style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center" style={{ color: colors.text.primary }}>
                    <Lock className="h-5 w-5 mr-2" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium" style={{ color: colors.text.primary }}>Password</h4>
                      <p className="text-sm" style={{ color: colors.text.secondary }}>Last updated 30 days ago</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      style={{ 
                        borderColor: `${colors.text.primary}33`, 
                        color: colors.text.primary,
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Summary */}
            <div className="space-y-6">
              <Card style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
                <CardHeader>
                  <CardTitle className="font-serif" style={{ color: colors.text.primary }}>Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span style={{ color: colors.text.secondary }}>Member since</span>
                    <span className="font-medium" style={{ color: colors.text.primary }}>January 2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: colors.text.secondary }}>Total orders</span>
                    <span className="font-medium" style={{ color: colors.text.primary }}>{orders.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: colors.text.secondary }}>Total spent</span>
                    <span className="font-medium" style={{ color: colors.text.primary }}>
                      {formatPrice(orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Order History */}
          <div className="mt-12">
            <Card style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-serif flex items-center" style={{ color: colors.text.primary }}>
                    <Package className="h-5 w-5 mr-2" />
                    Order History
                  </CardTitle>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/my-orders">View All Orders</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-champagne mx-auto mb-4" style={{ borderColor: colors.accent }}></div>
                    <p style={{ color: colors.text.secondary }}>Loading your orders...</p>
                  </div>
                ) : ordersError ? (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 mx-auto mb-4" style={{ color: colors.text.secondary }} />
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>Error loading orders</h3>
                    <p className="mb-4" style={{ color: colors.text.secondary }}>There was a problem fetching your orders.</p>
                    <Button asChild
                      style={{ 
                        backgroundColor: colors.accent, 
                        color: colors.background 
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                    >
                      <Link href="/my-orders">View All Orders</Link>
                    </Button>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order: any) => (
                      <div key={order._id} style={{ borderColor: `${colors.border}33` }} className="border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold" style={{ color: colors.text.primary }}>Order #{order._id?.substring(0, 8).toUpperCase()}</h4>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-sm mb-1" style={{ color: colors.text.secondary }}>
                              {formatDate(order.createdAt)} • {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                            </p>
                            <p className="text-sm" style={{ color: colors.text.secondary }}>
                              {order.items?.slice(0, 2).map((item: any) => item.product?.name || "Product").join(', ')}
                              {order.items?.length > 2 && ` and ${order.items.length - 2} more`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg" style={{ color: colors.accent }}>{formatPrice(order.totalAmount)}</p>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              style={{ 
                                borderColor: `${colors.text.primary}33`, 
                                color: colors.text.primary,
                                backgroundColor: 'transparent'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Link href={`/my-orders#${order._id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 mx-auto mb-4" style={{ color: colors.text.secondary }} />
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>No orders yet</h3>
                    <p className="mb-4" style={{ color: colors.text.secondary }}>Start shopping to see your orders here.</p>
                    <Button
                      asChild
                      style={{ 
                        backgroundColor: colors.accent, 
                        color: colors.background 
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                    >
                      <Link href="/products">Browse Products</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}