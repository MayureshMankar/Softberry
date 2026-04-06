import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { ProductCard } from "@/components/product/ProductCard";
import { useTheme } from "@/contexts/ThemeContext";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";

// Import homepage data
import { 
  homepageProducts,
  homepageCategories,
  type HomepageProduct
} from "@/data/homepage-products";

interface Product {
  _id: { toString: () => string };
  name: string;
  price: number;
  imageUrl?: string;
  brand?: { name: string };
  category?: { name: string };
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  averageRating?: number;
  reviewCount?: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  gender?: string;
  description?: string;
}

// Convert homepage product to component expected format
const convertProduct = (product: HomepageProduct) => ({
  ...product,
  _id: { toString: () => product.id },
  brandId: undefined,
  categoryId: undefined,
  brand: { 
    name: product.brand, 
    _id: { toString: () => '1' }, 
    description: '', 
    slug: product.brand.toLowerCase().replace(/\s+/g, '-'), 
    createdAt: new Date() 
  },
  category: { 
    name: product.category, 
    _id: { toString: () => '1' }, 
    description: '', 
    slug: product.category.toLowerCase().replace(/\s+/g, '-'), 
    createdAt: new Date() 
  },
  createdAt: new Date(),
  updatedAt: new Date(),
} as any);

export default function Products() {
  const [location] = useLocation();
  const { colors } = useTheme();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  
  // Fetch products from API
  const { data: apiProducts = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    gender: searchParams.get('gender') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
  });
  
  const [showFilters, setShowFilters] = useState(false);

  // Use API products if available, otherwise fallback to static data
  const products = isLoading || error ? homepageProducts.map(convertProduct) : apiProducts;

  // Get unique brands from products
  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand?.name || ''))).filter(Boolean);
    return uniqueBrands.map((brand, index) => ({
      id: index + 1,
      name: brand,
      slug: brand.toLowerCase().replace(/\s+/g, '-')
    }));
  }, [products]);

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category?.name || ''))).filter(Boolean);
    return uniqueCategories.map((category, index) => ({
      id: index + 1,
      name: category,
      slug: category.toLowerCase().replace(/\s+/g, '-')
    }));
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // For static data, check isActive, for API data it's already filtered
      if ('isActive' in product && !product.isActive) return false;
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!product.name.toLowerCase().includes(searchLower) &&
            !(product.brand?.name || '').toLowerCase().includes(searchLower) &&
            !(product.description || '').toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      // Category filter
      if (filters.category && filters.category !== 'all') {
        if ((product.category?.name || '').toLowerCase().replace(/\s+/g, '-') !== filters.category) {
          return false;
        }
      }
      
      // Brand filter
      if (filters.brand && filters.brand !== 'all') {
        if ((product.brand?.name || '').toLowerCase().replace(/\s+/g, '-') !== filters.brand) {
          return false;
        }
      }
      
      // Gender filter
      if (filters.gender && filters.gender !== 'all') {
        if (product.gender !== filters.gender) {
          return false;
        }
      }
      
      // Price range filter
      if (filters.minPrice && product.price < parseInt(filters.minPrice)) {
        return false;
      }
      
      if (filters.maxPrice && product.price > parseInt(filters.maxPrice)) {
        return false;
      }
      
      return true;
    });
    
    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'rating-desc':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    return filtered;
  }, [products, filters]);

  const updateFilter = (key: string, value: string) => {
    const apiValue = value === 'all' ? '' : value;
    setFilters(prev => ({ ...prev, [key]: apiValue }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      gender: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== 'newest');

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
      <Header />
      
      {/* Page Header */}
      <section className="py-24" style={{ backgroundColor: colors.background }}>
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div 
              className="inline-flex items-center px-8 py-4 rounded-full border backdrop-blur-sm mb-8"
              style={{
                borderColor: `${colors.border}30`,
                backgroundColor: `${colors.surface}40`
              }}
            >
              <div 
                className="w-2 h-2 rounded-full mr-3 animate-pulse" 
                style={{ backgroundColor: colors.accent }}
              />
              <span 
                className="font-medium tracking-wider uppercase text-sm"
                style={{ color: colors.text.accent }}
              >
                Premium Collection
              </span>
            </div>
            
            <h1 
              className="font-serif text-5xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{ color: colors.text.primary }}
            >
              Luxury <span style={{ color: colors.text.accent }}>Cosmetics</span>
            </h1>
            <p 
              className="text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: colors.text.secondary }}
            >
              Discover our complete collection of premium beauty and skincare from the world's most prestigious brands
            </p>
            
            {/* Results Count */}
            <div 
              className="mt-8 inline-flex items-center px-6 py-3 rounded-2xl border"
              style={{
                borderColor: `${colors.border}20`,
                backgroundColor: `${colors.surface}40`
              }}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: colors.accent }}
              >
                <span 
                  className="font-bold text-sm"
                  style={{ color: colors.background }}
                >
                  {filteredProducts.length}
                </span>
              </div>
              <span 
                className="font-medium"
                style={{ color: colors.text.secondary }}
              >
                {filteredProducts.length} exquisite beauty products available
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col xl:flex-row gap-10">
          {/* Filters Sidebar */}
          <div className={`xl:w-96 ${showFilters ? 'block' : 'hidden xl:block'}`}>
            <div className="sticky top-32">
              <Card 
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: `${colors.border}20`
                }}
              >
                <div className="p-6">
                  {/* Filters Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Filter className="h-5 w-5 mr-3" style={{ color: colors.text.accent }} />
                      <h3 
                        className="font-serif text-xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        Refine Selection
                      </h3>
                    </div>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="transition-colors duration-200"
                        style={{
                          color: colors.text.secondary,
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${colors.accent}10`;
                          e.currentTarget.style.color = colors.text.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = colors.text.secondary;
                        }}
                      >
                        Clear All
                      </Button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Search */}
                    <div>
                      <label 
                        className="text-sm font-semibold mb-3 block"
                        style={{ color: colors.text.primary }}
                      >
                        Search Collection
                      </label>
                      <div className="relative">
                        <Search 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
                          style={{ color: colors.text.secondary }}
                        />
                        <Input
                          placeholder="Find your perfect product..."
                          value={filters.search}
                          onChange={(e) => updateFilter('search', e.target.value)}
                          className="pl-10 transition-colors duration-200"
                          style={{
                            backgroundColor: colors.background,
                            borderColor: `${colors.border}30`,
                            color: colors.text.primary
                          }}
                        />
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label 
                        className="text-sm font-semibold mb-3 block"
                        style={{ color: colors.text.primary }}
                      >
                        Category
                      </label>
                      <Select value={filters.category || 'all'} onValueChange={(value) => updateFilter('category', value)}>
                        <SelectTrigger 
                          className="transition-colors duration-200"
                          style={{
                            backgroundColor: colors.background,
                            borderColor: `${colors.border}30`,
                            color: colors.text.primary
                          }}
                        >
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent 
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: `${colors.border}20`
                          }}
                        >
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.slug}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Brand Filter */}
                    <div>
                      <label 
                        className="text-sm font-semibold mb-3 block"
                        style={{ color: colors.text.primary }}
                      >
                        Brand
                      </label>
                      <Select value={filters.brand || 'all'} onValueChange={(value) => updateFilter('brand', value)}>
                        <SelectTrigger 
                          className="transition-colors duration-200"
                          style={{
                            backgroundColor: colors.background,
                            borderColor: `${colors.border}30`,
                            color: colors.text.primary
                          }}
                        >
                          <SelectValue placeholder="All Brands" />
                        </SelectTrigger>
                        <SelectContent 
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: `${colors.border}20`
                          }}
                        >
                          <SelectItem value="all">All Brands</SelectItem>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.slug}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Gender Filter */}
                    <div>
                      <label 
                        className="text-sm font-semibold mb-3 block"
                        style={{ color: colors.text.primary }}
                      >
                        Gender
                      </label>
                      <Select value={filters.gender || 'all'} onValueChange={(value) => updateFilter('gender', value)}>
                        <SelectTrigger 
                          className="transition-colors duration-200"
                          style={{
                            backgroundColor: colors.background,
                            borderColor: `${colors.border}30`,
                            color: colors.text.primary
                          }}
                        >
                          <SelectValue placeholder="All Genders" />
                        </SelectTrigger>
                        <SelectContent 
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: `${colors.border}20`
                          }}
                        >
                          <SelectItem value="all">All Genders</SelectItem>
                          <SelectItem value="Men">Men</SelectItem>
                          <SelectItem value="Women">Women</SelectItem>
                          <SelectItem value="Unisex">Unisex</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label 
                        className="text-sm font-semibold mb-3 block"
                        style={{ color: colors.text.primary }}
                      >
                        Price Range
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Min ₹"
                          value={filters.minPrice}
                          onChange={(e) => updateFilter('minPrice', e.target.value)}
                          type="number"
                          className="transition-colors duration-200"
                          style={{
                            backgroundColor: colors.background,
                            borderColor: `${colors.border}30`,
                            color: colors.text.primary
                          }}
                        />
                        <Input
                          placeholder="Max ₹"
                          value={filters.maxPrice}
                          onChange={(e) => updateFilter('maxPrice', e.target.value)}
                          type="number"
                          className="transition-colors duration-200"
                          style={{
                            backgroundColor: colors.background,
                            borderColor: `${colors.border}30`,
                            color: colors.text.primary
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle & Sort Controls */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">
              <div className="flex items-center gap-6">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  className="xl:hidden transition-colors duration-200"
                  style={{
                    borderColor: `${colors.border}30`,
                    color: colors.text.secondary,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.accent}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                {/* Active Filters Pills */}
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {filters.search && (
                      <Badge 
                        className="flex items-center gap-2 transition-colors duration-200"
                        style={{
                          backgroundColor: `${colors.accent}20`,
                          color: colors.text.secondary,
                          borderColor: `${colors.accent}30`
                        }}
                      >
                        <Search className="h-3 w-3" />
                        "{filters.search}"
                        <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('search', '')} />
                      </Badge>
                    )}
                    {filters.category && (
                      <Badge 
                        className="flex items-center gap-2 transition-colors duration-200"
                        style={{
                          backgroundColor: `${colors.accent}20`,
                          color: colors.text.secondary,
                          borderColor: `${colors.accent}30`
                        }}
                      >
                        {homepageCategories.find(c => c.slug === filters.category)?.name}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('category', 'all')} />
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-4">
                <span 
                  className="font-medium text-sm"
                  style={{ color: colors.text.primary }}
                >
                  Sort by:
                </span>
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                  <SelectTrigger 
                    className="w-48 transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: `${colors.border}30`,
                      color: colors.text.primary
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent 
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: `${colors.border}20`
                    }}
                  >
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="rating-desc">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="max-w-lg mx-auto">
                  <div 
                    className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: `${colors.accent}20` }}
                  >
                    <Search 
                      className="h-12 w-12" 
                      style={{ color: colors.text.secondary }}
                    />
                  </div>
                  <h3 
                    className="font-serif text-2xl font-bold mb-4"
                    style={{ color: colors.text.primary }}
                  >
                    No Products Found
                  </h3>
                  <p 
                    className="text-lg mb-8"
                    style={{ color: colors.text.secondary }}
                  >
                    We couldn't find any products matching your criteria. Try adjusting your filters.
                  </p>
                  <Button 
                    onClick={clearFilters} 
                    className="font-semibold px-8 py-3 transition-all duration-300"
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
                    Reset All Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
}
