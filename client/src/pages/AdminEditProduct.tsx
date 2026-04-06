import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { 
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function AdminEditProduct() {
  const { colors } = useTheme();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const params = useParams();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    originalPrice: "",
    brand: "",
    category: "",
    slug: "",
    volume: "",
    fragranceFamily: "",
    topNotes: "",
    middleNotes: "",
    baseNotes: "",
    longevity: "",
    sillage: "",
    gender: "Unisex",
    stockQuantity: "",
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    isLimitedEdition: false,
    imageUrl: ""
  });

  // Check if user is admin
  const checkAdminStatus = () => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      setLocation("/admin/login");
      return false;
    }
    return true;
  };

  // Get product ID from URL
  useEffect(() => {
    console.log("AdminEditProduct useEffect called"); // Debug log
    console.log("Params:", params); // Debug log
    if (!checkAdminStatus()) return;
    
    // Extract the product ID from the URL using wouter's useParams
    const id = params.id;
    console.log("Product ID from params:", id); // Debug log
    if (id) {
      setProductId(id);
      fetchProduct(id);
    } else {
      setError("Invalid product ID");
      setLoading(false);
    }
  }, [params.id]);

  // Fetch product data
  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/products/${id}`, {
        headers: {
          "Authorization": "Client-Admin-Secret"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
      }
      
      const product = await response.json();
      
      // Convert array fields to comma-separated strings
      const topNotes = Array.isArray(product.topNotes) ? product.topNotes.join(', ') : '';
      const middleNotes = Array.isArray(product.middleNotes) ? product.middleNotes.join(', ') : '';
      const baseNotes = Array.isArray(product.baseNotes) ? product.baseNotes.join(', ') : '';
      
      // Convert brand and category objects to strings if needed
      const brand = product.brand?.name || product.brand || "";
      const category = product.category?.name || product.category || "";
      
      setFormData({
        name: product.name || "",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        price: product.price?.toString() || "",
        originalPrice: product.originalPrice?.toString() || "",
        brand,
        category,
        slug: product.slug || "",
        volume: product.volume || "",
        fragranceFamily: product.fragranceFamily || "",
        topNotes,
        middleNotes,
        baseNotes,
        longevity: product.longevity || "",
        sillage: product.sillage || "",
        gender: product.gender || "Unisex",
        stockQuantity: product.stockQuantity?.toString() || "",
        isActive: product.isActive !== undefined ? product.isActive : true,
        isFeatured: product.isFeatured || false,
        isNewArrival: product.isNewArrival || false,
        isBestSeller: product.isBestSeller || false,
        isLimitedEdition: product.isLimitedEdition || false,
        imageUrl: product.imageUrl || ""
      });
    } catch (err) {
      const errorMessage = "Failed to load product: " + (err as Error).message;
      setError(errorMessage);
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrl
    }));
    setError(null);
  };

  const handleImageUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkAdminStatus() || !productId) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Validate required fields
      if (!formData.name || !formData.price || !formData.brand || !formData.category || !formData.slug) {
        throw new Error("Please fill in all required fields (Name, Price, Brand, Category, Slug)");
      }
      
      // Convert array fields from comma-separated strings to arrays
      const topNotes = formData.topNotes.split(',').map(note => note.trim()).filter(note => note);
      const middleNotes = formData.middleNotes.split(',').map(note => note.trim()).filter(note => note);
      const baseNotes = formData.baseNotes.split(',').map(note => note.trim()).filter(note => note);
      
      const productData = {
        ...formData,
        price: parseInt(formData.price),
        originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        topNotes,
        middleNotes,
        baseNotes
      };
      
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Authorization": "Client-Admin-Secret",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update product: ${response.status} ${response.statusText}`);
      }
      
      const updatedProduct = await response.json();
      setSuccess("Product updated successfully!");
      
      // Redirect to products page after a short delay
      setTimeout(() => {
        setLocation("/admin/products");
      }, 1500);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      console.error("Error updating product:", err);
    } finally {
      setSaving(false);
    }
  };

  const navigateToProducts = () => {
    if (checkAdminStatus()) {
      setLocation("/admin/products");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setLocation("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: colors.text.primary }} />
          <p style={{ color: colors.text.secondary }}>Loading product...</p>
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
            onClick={navigateToProducts}
            variant="ghost"
            size="sm"
            style={{ color: colors.text.secondary }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Products
          </Button>
          <div>
            <h1 
              className="font-serif text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Edit Product
            </h1>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              Update product details
            </p>
          </div>
        </div>
        <div className="flex gap-2">
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

      <div className="p-6 max-w-4xl mx-auto">
        <Card style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <CardHeader>
            <CardTitle style={{ color: colors.text.primary }}>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div 
                className="p-3 rounded-md text-sm mb-4 flex items-start gap-2"
                style={{ 
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  border: "1px solid #ef4444"
                }}
              >
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div 
                className="p-3 rounded-md text-sm mb-4"
                style={{ 
                  backgroundColor: "rgba(34, 197, 94, 0.1)",
                  color: "#22c55e",
                  border: "1px solid #22c55e"
                }}
              >
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                      Product Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderColor: colors.border,
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                      Brand *
                    </label>
                    <Input
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="Enter brand name"
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderColor: colors.border,
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                      Category *
                    </label>
                    <Input
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Enter category"
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderColor: colors.border,
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                      Slug *
                    </label>
                    <Input
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="Enter URL-friendly slug"
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderColor: colors.border,
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                      Price (₹) *
                    </label>
                    <Input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter price"
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderColor: colors.border,
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                      Original Price (₹)
                    </label>
                    <Input
                      name="originalPrice"
                      type="number"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="Enter original price (optional)"
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderColor: colors.border,
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                      Stock Quantity
                    </label>
                    <Input
                      name="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      placeholder="Enter stock quantity"
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderColor: colors.border,
                      }}
                    />
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                      Short Description
                    </label>
                    <Textarea
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      placeholder="Enter short description"
                      rows={3}
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderColor: colors.border,
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                      Full Description
                    </label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter full product description"
                      rows={4}
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderColor: colors.border,
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                      Volume/Size
                    </label>
                    <Input
                      name="volume"
                      value={formData.volume}
                      onChange={handleInputChange}
                      placeholder="Enter size (e.g., 30ml, 50g, 3.5g)"
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderColor: colors.border,
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                    Product Type
                    </label>
                    <Input
                    name="fragranceFamily"
                      value={formData.fragranceFamily}
                      onChange={handleInputChange}
                    placeholder="Enter type (e.g., Makeup, Skincare, Serum)"
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderColor: colors.border,
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-md"
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderColor: colors.border,
                      }}
                    >
                      <option value="Unisex">Unisex</option>
                      <option value="Feminine">Feminine</option>
                      <option value="Masculine">Masculine</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                      Product Image
                    </label>
                    <ImageUpload 
                      onImageUploaded={handleImageUpload}
                      onError={handleImageUploadError}
                      className="w-full"
                    />
                    {formData.imageUrl && (
                      <div className="mt-2 text-sm" style={{ color: colors.text.secondary }}>
                        Current image: {formData.imageUrl}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Product Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                    Key Ingredients (comma separated)
                  </label>
                  <Input
                    name="topNotes"
                    value={formData.topNotes}
                    onChange={(e) => handleArrayInputChange(e, "topNotes")}
                    placeholder="e.g., Hyaluronic Acid, Vitamin C, Retinol"
                    style={{ 
                      backgroundColor: colors.background,
                      color: colors.text.primary,
                      borderColor: colors.border,
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                    Benefits/Features (comma separated)
                  </label>
                  <Input
                    name="middleNotes"
                    value={formData.middleNotes}
                    onChange={(e) => handleArrayInputChange(e, "middleNotes")}
                    placeholder="e.g., Hydrating, Anti-Aging, Brightening"
                    style={{ 
                      backgroundColor: colors.background,
                      color: colors.text.primary,
                      borderColor: colors.border,
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                    Certifications (comma separated)
                  </label>
                  <Input
                    name="baseNotes"
                    value={formData.baseNotes}
                    onChange={(e) => handleArrayInputChange(e, "baseNotes")}
                    placeholder="e.g., Cruelty-Free, Vegan, Paraben-Free"
                    style={{ 
                      backgroundColor: colors.background,
                      color: colors.text.primary,
                      borderColor: colors.border,
                    }}
                  />
                </div>
              </div>
              
              {/* Product Characteristics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                    Duration/Wear Time
                  </label>
                  <Input
                    name="longevity"
                    value={formData.longevity}
                    onChange={handleInputChange}
                    placeholder="e.g., 12-Hour Wear, 24h Hydration"
                    style={{ 
                      backgroundColor: colors.background,
                      color: colors.text.primary,
                      borderColor: colors.border,
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.text.primary }}>
                    Coverage/Intensity
                  </label>
                  <Input
                    name="sillage"
                    value={formData.sillage}
                    onChange={handleInputChange}
                    placeholder="e.g., Full Coverage, Light, Medium"
                    style={{ 
                      backgroundColor: colors.background,
                      color: colors.text.primary,
                      borderColor: colors.border,
                    }}
                  />
                </div>
              </div>
              
              {/* Status Toggles */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    id="isActive"
                    className="mr-2"
                  />
                  <label htmlFor="isActive" style={{ color: colors.text.primary }}>Active</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    id="isFeatured"
                    className="mr-2"
                  />
                  <label htmlFor="isFeatured" style={{ color: colors.text.primary }}>Featured</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isNewArrival"
                    checked={formData.isNewArrival}
                    onChange={handleInputChange}
                    id="isNewArrival"
                    className="mr-2"
                  />
                  <label htmlFor="isNewArrival" style={{ color: colors.text.primary }}>New Arrival</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    checked={formData.isBestSeller}
                    onChange={handleInputChange}
                    id="isBestSeller"
                    className="mr-2"
                  />
                  <label htmlFor="isBestSeller" style={{ color: colors.text.primary }}>Best Seller</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isLimitedEdition"
                    checked={formData.isLimitedEdition}
                    onChange={handleInputChange}
                    id="isLimitedEdition"
                    className="mr-2"
                  />
                  <label htmlFor="isLimitedEdition" style={{ color: colors.text.primary }}>Limited Edition</label>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={navigateToProducts}
                  style={{ 
                    borderColor: colors.border, 
                    color: colors.text.primary,
                    backgroundColor: 'transparent'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  style={{ 
                    backgroundColor: colors.accent,
                    color: colors.background
                  }}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
