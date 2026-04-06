import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  Check,
  X
} from "lucide-react";

export default function AdminProducts() {
  const { colors } = useTheme();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterFeatured, setFilterFeatured] = useState<"all" | "featured" | "normal">("all");

  // Format price helper function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Check if user is admin
  const checkAdminStatus = () => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      setLocation("/admin/login");
      return false;
    }
    return true;
  };

  // Fetch products using React Query
  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      if (!checkAdminStatus()) {
        throw new Error("Unauthorized");
      }
      
      const response = await fetch("/api/admin/products", {
        headers: {
          "Authorization": "Client-Admin-Secret",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("isAdmin");
          setLocation("/admin/login");
          throw new Error("Unauthorized");
        }
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    },
    refetchOnWindowFocus: false,
    retry: 1
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Client-Admin-Secret"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status} ${response.statusText}`);
      }
      
      return productId;
    },
    onSuccess: (productId) => {
      queryClient.setQueryData(['admin-products'], (oldData: any[] = []) => 
        oldData.filter(product => product._id !== productId)
      );
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ productId, currentStatus }: { productId: string; currentStatus: boolean }) => {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Authorization": "Client-Admin-Secret",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(['admin-products'], (oldData: any[] = []) => 
        oldData.map(product => 
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
      toast({
        title: "Product updated",
        description: `Product status updated successfully.`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update product: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ productId, currentStatus }: { productId: string; currentStatus: boolean }) => {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Authorization": "Client-Admin-Secret",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          isFeatured: !currentStatus
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(['admin-products'], (oldData: any[] = []) => 
        oldData.map(product => 
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
      toast({
        title: "Product updated",
        description: `Product featured status updated successfully.`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update product: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products.filter((product: any) => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand?.name || product.brand || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category?.name || product.category || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = filterStatus === "all" || 
        (filterStatus === "active" && product.isActive) || 
        (filterStatus === "inactive" && !product.isActive);
      
      // Featured filter
      const matchesFeatured = filterFeatured === "all" || 
        (filterFeatured === "featured" && product.isFeatured) || 
        (filterFeatured === "normal" && !product.isFeatured);
      
      return matchesSearch && matchesStatus && matchesFeatured;
    });
  }, [products, searchTerm, filterStatus, filterFeatured]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setLocation("/admin/login");
  };

  const navigateToDashboard = () => {
    if (checkAdminStatus()) {
      setLocation("/admin");
    }
  };

  const navigateToAddProduct = () => {
    if (checkAdminStatus()) {
      setLocation("/admin/products/add");
    }
  };

  const handleEditProduct = (productId: string) => {
    if (checkAdminStatus()) {
      setLocation(`/admin/products/edit/${productId}`);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (!checkAdminStatus()) return;
    
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleToggleActive = (productId: string, currentStatus: boolean) => {
    if (!checkAdminStatus()) return;
    toggleActiveMutation.mutate({ productId, currentStatus });
  };

  const handleToggleFeatured = (productId: string, currentStatus: boolean) => {
    if (!checkAdminStatus()) return;
    toggleFeaturedMutation.mutate({ productId, currentStatus });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: colors.text.primary }} />
          <p style={{ color: colors.text.secondary }}>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div 
          className="text-center p-6 rounded-lg max-w-md w-full mx-4"
          style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
        >
          <AlertCircle className="h-12 w-12 mx-auto mb-4" style={{ color: "#ef4444" }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: colors.text.primary }}>Error</h2>
          <p className="mb-4" style={{ color: colors.text.secondary }}>{(error as Error).message}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              onClick={() => refetch()}
              style={{ backgroundColor: colors.accent, color: colors.background }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button 
              variant="outline"
              onClick={navigateToDashboard}
              style={{ 
                borderColor: colors.border, 
                color: colors.text.primary,
                backgroundColor: 'transparent'
              }}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div 
        className="border-b px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border
        }}
      >
        <div className="flex items-center gap-4">
          <Button
            onClick={navigateToDashboard}
            variant="ghost"
            size="sm"
            style={{ color: colors.text.secondary }}
          >
            ← Dashboard
          </Button>
          <div>
            <h1 
              className="font-serif text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Product Management
            </h1>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              Manage your product catalog ({filteredProducts.length} of {products.length} products)
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            style={{ 
              borderColor: colors.border, 
              color: colors.text.primary,
              backgroundColor: 'transparent'
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            style={{ 
              borderColor: colors.border, 
              color: colors.text.primary,
              backgroundColor: 'transparent'
              }}
          >
            <span>🚪</span>
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.text.secondary }} />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              style={{ 
                backgroundColor: colors.surface,
                color: colors.text.primary,
                borderColor: colors.border,
              }}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="appearance-none pl-3 pr-8 py-2 rounded-md text-sm"
                style={{ 
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderColor: colors.border,
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.text.secondary }} />
            </div>
            
            <div className="relative">
              <select
                value={filterFeatured}
                onChange={(e) => setFilterFeatured(e.target.value as any)}
                className="appearance-none pl-3 pr-8 py-2 rounded-md text-sm"
                style={{ 
                  backgroundColor: colors.surface,
                  color: colors.text.primary,
                  borderColor: colors.border,
                }}
              >
                <option value="all">All Types</option>
                <option value="featured">Featured</option>
                <option value="normal">Normal</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.text.secondary }} />
            </div>
          </div>
        </div>

        {/* Products List */}
        <Card style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle style={{ color: colors.text.primary }}>Products</CardTitle>
            <Button 
              onClick={navigateToAddProduct}
              size="sm"
              style={{ backgroundColor: colors.accent, color: colors.background }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto mb-4" style={{ color: colors.text.secondary }} />
                <h3 className="text-lg font-medium mb-1" style={{ color: colors.text.primary }}>No products found</h3>
                <p className="mb-4" style={{ color: colors.text.secondary }}>
                  {products.length === 0 
                    ? "Get started by adding a new product." 
                    : "Try adjusting your search or filter criteria."}
                </p>
                <Button 
                  onClick={navigateToAddProduct}
                  style={{ backgroundColor: colors.accent, color: colors.background }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product: any) => (
                  <div 
                    key={product._id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg"
                    style={{ backgroundColor: `${colors.background}80`, border: `1px solid ${colors.border}` }}
                  >
                    <div className="flex-1 mb-3 sm:mb-0">
                      <div className="flex items-start gap-3">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-md flex items-center justify-center" style={{ backgroundColor: colors.background }}>
                            <Package className="h-6 w-6" style={{ color: colors.text.secondary }} />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium" style={{ color: colors.text.primary }}>{product.name}</h3>
                          <p className="text-sm" style={{ color: colors.text.secondary }}>
                            {product.brand?.name || product.brand} • {product.category?.name || product.category}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-medium" style={{ color: colors.text.primary }}>
                              {formatPrice(product.price)}
                            </span>
                            <button
                              onClick={() => handleToggleActive(product._id, product.isActive)}
                              className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                              style={{ 
                                backgroundColor: product.isActive ? `${colors.accent}20` : `${colors.text.secondary}20`,
                                color: product.isActive ? colors.accent : colors.text.secondary
                              }}
                            >
                              {product.isActive ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                              {product.isActive ? "Active" : "Inactive"}
                            </button>
                            {product.isFeatured && (
                              <button
                                onClick={() => handleToggleFeatured(product._id, product.isFeatured)}
                                className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                style={{ backgroundColor: "#fbbf2420", color: "#fbbf24" }}
                              >
                                <Check className="h-3 w-3" />
                                Featured
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => alert(`View product details for ${product.name}`)}
                        style={{ color: colors.text.secondary }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditProduct(product._id)}
                        style={{ color: colors.text.secondary }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product._id)}
                        style={{ color: colors.text.secondary }}
                      >
                        <Trash2 className="h-4 w-4" />
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
