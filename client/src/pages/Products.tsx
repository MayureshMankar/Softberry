import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import type { ProductWithDetails, Category, Brand } from "@shared/schema";

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    gender: searchParams.get('gender') || '',
    fragranceFamily: searchParams.get('fragranceFamily') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    sortOrder: searchParams.get('sortOrder') || 'desc',
  });
  
  const [showFilters, setShowFilters] = useState(false);

  const { data: products = [], isLoading: loadingProducts } = useQuery<ProductWithDetails[]>({
    queryKey: ["/api/products", filters],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      gender: '',
      fragranceFamily: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== 'newest' && value !== 'desc');

  const formatPrice = (price: string) => {
    return `₹${parseFloat(price).toLocaleString()}`;
  };

  return (
    <div className="bg-cream font-sans min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="bg-luxury-black text-cream py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="font-serif text-5xl font-bold mb-4">Luxury Fragrances</h1>
            <p className="text-warm-gray text-lg max-w-2xl mx-auto">
              Discover our complete collection of premium perfumes from the world's most prestigious fragrance houses
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl font-bold text-luxury-black flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-champagne hover:text-burgundy"
                    data-testid="clear-filters-button"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-luxury-black mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray h-4 w-4" />
                    <Input
                      placeholder="Search fragrances..."
                      value={filters.search}
                      onChange={(e) => updateFilter('search', e.target.value)}
                      className="pl-10"
                      data-testid="search-input"
                    />
                  </div>
                </div>

                <Separator />

                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-luxury-black mb-2 block">Category</label>
                  <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)} data-testid="category-select">
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand */}
                <div>
                  <label className="text-sm font-medium text-luxury-black mb-2 block">Brand</label>
                  <Select value={filters.brand} onValueChange={(value) => updateFilter('brand', value)} data-testid="brand-select">
                    <SelectTrigger>
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Brands</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.slug}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender */}
                <div>
                  <label className="text-sm font-medium text-luxury-black mb-2 block">Gender</label>
                  <Select value={filters.gender} onValueChange={(value) => updateFilter('gender', value)} data-testid="gender-select">
                    <SelectTrigger>
                      <SelectValue placeholder="All Genders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Genders</SelectItem>
                      <SelectItem value="Men">Men</SelectItem>
                      <SelectItem value="Women">Women</SelectItem>
                      <SelectItem value="Unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fragrance Family */}
                <div>
                  <label className="text-sm font-medium text-luxury-black mb-2 block">Fragrance Family</label>
                  <Select value={filters.fragranceFamily} onValueChange={(value) => updateFilter('fragranceFamily', value)} data-testid="fragrance-family-select">
                    <SelectTrigger>
                      <SelectValue placeholder="All Families" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Families</SelectItem>
                      <SelectItem value="Floral">Floral</SelectItem>
                      <SelectItem value="Oriental">Oriental</SelectItem>
                      <SelectItem value="Woody">Woody</SelectItem>
                      <SelectItem value="Fresh">Fresh</SelectItem>
                      <SelectItem value="Chypre">Chypre</SelectItem>
                      <SelectItem value="Gourmand">Gourmand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-luxury-black mb-2 block">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min ₹"
                      value={filters.minPrice}
                      onChange={(e) => updateFilter('minPrice', e.target.value)}
                      type="number"
                      data-testid="min-price-input"
                    />
                    <Input
                      placeholder="Max ₹"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', e.target.value)}
                      type="number"
                      data-testid="max-price-input"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle & Sort */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                  data-testid="mobile-filter-toggle"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {filters.search && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Search: {filters.search}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('search', '')} />
                      </Badge>
                    )}
                    {filters.category && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Category: {categories.find(c => c.slug === filters.category)?.name}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('category', '')} />
                      </Badge>
                    )}
                    {filters.brand && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Brand: {brands.find(b => b.slug === filters.brand)?.name}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('brand', '')} />
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <Select value={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-');
                updateFilter('sortBy', sortBy);
                updateFilter('sortOrder', sortOrder);
              }} data-testid="sort-select">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest-desc">Newest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="rating-desc">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Count */}
            <div className="mb-6">
              <p className="text-warm-gray">
                {loadingProducts ? 'Loading...' : `${products.length} products found`}
              </p>
            </div>

            {/* Products Grid */}
            {loadingProducts ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, index) => (
                  <Card key={index} className="rounded-2xl overflow-hidden shadow-lg border-0">
                    <Skeleton className="h-64 w-full" />
                    <div className="p-6">
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-1/3 mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-warm-gray/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-warm-gray" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-luxury-black mb-2">No Products Found</h3>
                  <p className="text-warm-gray mb-6">
                    We couldn't find any products matching your criteria. Try adjusting your filters.
                  </p>
                  <Button onClick={clearFilters} data-testid="no-results-clear-button">
                    Clear Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="products-grid">
                {products.map((product) => (
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
