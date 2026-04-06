import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  X,
  Heart,
  LogOut,
  ChevronDown,
  Package,
  MapPin,
  CreditCard,
  Bell
} from "lucide-react";

export function Header() {
  const [location] = useLocation();
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isCustomerServiceDropdownOpen, setIsCustomerServiceDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Scroll listener for transparent header on homepage
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      setIsProductsDropdownOpen(false);
      setIsCustomerServiceDropdownOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const productsDropdownLinks = [
    { href: "/products", label: "All Collections" },
    { href: "/products?isNewArrival=true", label: "New Arrivals" },
    { href: "/products?isBestSeller=true", label: "Best Sellers" },
    { href: "/gift-cards", label: "Gift Cards" },
  ];

  const customerServiceLinks = [
    { href: "/shipping", label: "Shipping Info" },
    { href: "/returns", label: "Returns & Exchanges" },
    { href: "/size-guide", label: "Size Guide" },
    { href: "/faq", label: "FAQ" },
    { href: "/order-tracking", label: "Track Your Order" },
  ];

  const userAccountLinks = [
    { href: "/profile", label: "Profile", icon: User },
    { href: "/my-orders", label: "My Orders", icon: Package },
    { href: "/address-book", label: "Address Book", icon: MapPin },
    { href: "/payment-methods", label: "Payment Methods", icon: CreditCard },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return location === href;
    }
    return location.startsWith(href);
  };

  const handleProductsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
    setIsCustomerServiceDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };

  const handleCustomerServiceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCustomerServiceDropdownOpen(!isCustomerServiceDropdownOpen);
    setIsProductsDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsProductsDropdownOpen(false);
    setIsCustomerServiceDropdownOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled || location !== "/" ? "border-b backdrop-blur-xl" : "border-transparent"
      }`}
      style={{
        backgroundColor: isScrolled || location !== "/" ? `${colors.background}E6` : "transparent",
        borderColor: isScrolled || location !== "/" ? colors.borderLight : "transparent",
        boxShadow: isScrolled ? "0 4px 12px rgba(0,0,0,0.05)" : "none"
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.accent }}
              >
                <span 
                  className="font-serif font-bold text-sm"
                  style={{ color: colors.background }}
                >
                  S
                </span>
              </div>
              <span 
                className="font-serif text-xl font-bold"
                style={{ color: colors.text.primary }}
              >
                Soft Berry
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <div key={link.href} className="relative">
                {link.href === "/products" ? (
                  <button
                    onClick={handleProductsClick}
                    className={`flex items-center font-medium transition-colors duration-200 ${
                      isActiveLink(link.href) ? 'font-semibold' : ''
                    }`}
                    style={{ 
                      color: isActiveLink(link.href) 
                        ? colors.accent 
                        : colors.text.secondary 
                    }}
                  >
                    {link.label}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                ) : (
                  <Link href={link.href}>
                    <span 
                      className={`font-medium transition-colors duration-200 ${
                        isActiveLink(link.href) ? 'font-semibold' : ''
                      }`}
                      style={{ 
                        color: isActiveLink(link.href) 
                          ? colors.accent 
                          : colors.text.secondary 
                      }}
                    >
                      {link.label}
                    </span>
                  </Link>
                )}

                {/* Products Dropdown */}
                {link.href === "/products" && isProductsDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-56 rounded-lg shadow-lg py-2"
                    style={{ 
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {productsDropdownLinks.map((dropdownLink) => (
                      <Link 
                        key={dropdownLink.href} 
                        href={dropdownLink.href}
                        onClick={() => setIsProductsDropdownOpen(false)}
                      >
                        <div 
                          className="px-4 py-2 text-sm transition-colors duration-200"
                          style={{ 
                            color: colors.text.secondary,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.accent;
                            e.currentTarget.style.color = colors.background;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = colors.text.secondary;
                          }}
                        >
                          {dropdownLink.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Customer Service Dropdown */}
            <div className="relative">
              <button
                onClick={handleCustomerServiceClick}
                className={`flex items-center font-medium transition-colors duration-200`}
                style={{ 
                  color: isCustomerServiceDropdownOpen 
                    ? colors.accent 
                    : colors.text.secondary 
                }}
              >
                Customer Service
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {isCustomerServiceDropdownOpen && (
                <div 
                  className="absolute top-full right-0 mt-2 w-56 rounded-lg shadow-lg py-2"
                  style={{ 
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {customerServiceLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      onClick={() => setIsCustomerServiceDropdownOpen(false)}
                    >
                      <div 
                        className="px-4 py-2 text-sm transition-colors duration-200"
                        style={{ 
                          color: colors.text.secondary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.accent;
                          e.currentTarget.style.color = colors.background;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = colors.text.secondary;
                        }}
                      >
                        {link.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Search Button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="hidden sm:flex"
              style={{ color: colors.text.secondary }}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button 
              variant="ghost" 
              size="icon"
              asChild
              style={{ color: colors.text.secondary }}
            >
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              asChild
              style={{ color: colors.text.secondary }}
            >
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.background
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleUserClick}
                  style={{ color: isUserDropdownOpen ? colors.accent : colors.text.secondary }}
                >
                  <User className="h-5 w-5" />
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>

                {isUserDropdownOpen && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-64 rounded-lg shadow-lg py-2"
                    style={{ 
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    <div className="px-4 py-2 border-b" style={{ borderColor: `${colors.border}33` }}>
                      <p className="font-medium" style={{ color: colors.text.primary }}>{user.firstName} {user.lastName}</p>
                      <p className="text-sm" style={{ color: colors.text.secondary }}>{user.email}</p>
                    </div>
                    {userAccountLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link 
                          key={link.href} 
                          href={link.href}
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <div 
                            className="px-4 py-2 text-sm flex items-center transition-colors duration-200"
                            style={{ 
                              color: colors.text.secondary,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = colors.accent;
                              e.currentTarget.style.color = colors.background;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.color = colors.text.secondary;
                            }}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {link.label}
                          </div>
                        </Link>
                      );
                    })}
                    <div className="border-t" style={{ borderColor: `${colors.border}33` }}>
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                          // Redirect to home page after logout
                          window.location.href = '/';
                        }}
                        className="w-full px-4 py-2 text-sm flex items-center transition-colors duration-200"
                        style={{ 
                          color: colors.text.secondary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.accent;
                          e.currentTarget.style.color = colors.background;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = colors.text.secondary;
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                asChild
                className="hidden sm:flex"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.background
                }}
              >
                <Link href="/login">Login</Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ color: colors.text.secondary }}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden border-t py-4"
            style={{ borderColor: colors.borderLight }}
          >
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span 
                    className={`block font-medium transition-colors duration-200 ${
                      isActiveLink(link.href) ? 'font-semibold' : ''
                    }`}
                    style={{ 
                      color: isActiveLink(link.href) 
                        ? colors.accent 
                        : colors.text.secondary 
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              
              {/* Mobile Products Dropdown */}
              <div className="space-y-2 pl-4">
                <h3 className="font-medium" style={{ color: colors.text.primary }}>Collections</h3>
                {productsDropdownLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span 
                      className="block py-1 text-sm"
                      style={{ color: colors.text.tertiary }}
                    >
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
              
              {/* Mobile Customer Service Dropdown */}
              <div className="space-y-2 pl-4">
                <h3 className="font-medium" style={{ color: colors.text.primary }}>Customer Service</h3>
                {customerServiceLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span 
                      className="block py-1 text-sm"
                      style={{ color: colors.text.tertiary }}
                    >
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
              
              {/* Mobile User Menu */}
              {user && (
                <div className="space-y-2 pl-4">
                  <h3 className="font-medium" style={{ color: colors.text.primary }}>Account</h3>
                  {userAccountLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span 
                        className="block py-1 text-sm"
                        style={{ color: colors.text.tertiary }}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="block py-1 text-sm text-left"
                    style={{ color: colors.text.tertiary }}
                  >
                    Logout
                  </button>
                </div>
              )}
              
              {!user && (
                <Button 
                  asChild
                  className="w-fit"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.background
                  }}
                >
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
