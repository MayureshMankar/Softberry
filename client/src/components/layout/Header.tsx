import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartDrawer } from "@/components/cart/CartDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Crown, Search, User, Heart, ShoppingBag, Menu, ChevronDown } from "lucide-react";

export function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-luxury-black text-cream sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center">
              <Crown className="text-luxury-black text-xl" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-champagne">Royals</h1>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className={`hover:text-champagne transition-colors duration-300 font-medium ${location === '/' ? 'text-champagne' : ''}`}>
              Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:text-champagne transition-colors duration-300 font-medium flex items-center">
                Collections <ChevronDown className="ml-1 h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-luxury-black border-champagne/20" data-testid="collections-dropdown">
                <DropdownMenuItem asChild>
                  <Link href="/products?gender=Men" className="text-cream hover:text-champagne">
                    Men's Fragrances
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products?gender=Women" className="text-cream hover:text-champagne">
                    Women's Fragrances
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products?gender=Unisex" className="text-cream hover:text-champagne">
                    Unisex Collection
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products?isLimitedEdition=true" className="text-cream hover:text-champagne">
                    Limited Editions
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/products" className={`hover:text-champagne transition-colors duration-300 font-medium ${location === '/products' ? 'text-champagne' : ''}`}>
              Shop All
            </Link>
            
            <Link href="/about" className="hover:text-champagne transition-colors duration-300 font-medium">
              About
            </Link>
            
            <Link href="/contact" className="hover:text-champagne transition-colors duration-300 font-medium">
              Contact
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-champagne transition-colors duration-300"
              data-testid="search-button"
            >
              <Search className="h-5 w-5" />
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-champagne transition-colors duration-300"
                    data-testid="user-menu-trigger"
                  >
                    {user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-luxury-black border-champagne/20" data-testid="user-dropdown">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="text-cream hover:text-champagne">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="text-cream hover:text-champagne">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="text-cream hover:text-champagne">
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/api/logout" className="text-cream hover:text-champagne">
                      Sign Out
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-champagne transition-colors duration-300"
                onClick={() => window.location.href = '/api/login'}
                data-testid="login-button"
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="hover:text-champagne transition-colors duration-300"
              data-testid="wishlist-button"
            >
              <Heart className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative hover:text-champagne transition-colors duration-300"
              onClick={() => setIsCartOpen(true)}
              data-testid="cart-button"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-champagne text-luxury-black text-xs h-5 w-5 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* Mobile menu trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden hover:text-champagne transition-colors duration-300"
                  data-testid="mobile-menu-trigger"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-luxury-black text-cream border-l-champagne/20">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg hover:text-champagne transition-colors">
                    Home
                  </Link>
                  <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-lg hover:text-champagne transition-colors">
                    Shop All
                  </Link>
                  <Link href="/products?gender=Men" onClick={() => setIsMobileMenuOpen(false)} className="text-base text-warm-gray hover:text-champagne transition-colors ml-4">
                    Men's Fragrances
                  </Link>
                  <Link href="/products?gender=Women" onClick={() => setIsMobileMenuOpen(false)} className="text-base text-warm-gray hover:text-champagne transition-colors ml-4">
                    Women's Fragrances
                  </Link>
                  <Link href="/products?gender=Unisex" onClick={() => setIsMobileMenuOpen(false)} className="text-base text-warm-gray hover:text-champagne transition-colors ml-4">
                    Unisex Collection
                  </Link>
                  <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg hover:text-champagne transition-colors">
                    About
                  </Link>
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg hover:text-champagne transition-colors">
                    Contact
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  );
}
