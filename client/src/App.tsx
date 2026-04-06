import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Wishlist from "@/pages/Wishlist";
import GiftCards from "@/pages/GiftCards";
import StoreLocator from "@/pages/StoreLocator";
import Shipping from "@/pages/Shipping";
import Returns from "@/pages/Returns";
import SizeGuide from "@/pages/SizeGuide";
import FAQ from "@/pages/FAQ";
import OrderTracking from "@/pages/OrderTracking";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Cookies from "@/pages/Cookies";
import MyOrders from "@/pages/MyOrders";
import CompareProducts from "@/pages/CompareProducts";
import AddressBook from "@/pages/AddressBook";
import PaymentMethods from "@/pages/PaymentMethods";
import Notifications from "@/pages/Notifications";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProducts from "@/pages/AdminProducts";
import AdminOrders from "@/pages/AdminOrders";
import AdminAddProduct from "@/pages/AdminAddProduct";
import AdminEditProduct from "@/pages/AdminEditProduct";
import AdminRoute from "@/components/admin/AdminRoute";

// Admin Route Components
const AdminDashboardRoute = () => <AdminRoute component={AdminDashboard} />;
const AdminProductsRoute = () => <AdminRoute component={AdminProducts} />;
const AdminOrdersRoute = () => <AdminRoute component={AdminOrders} />;
const AdminAddProductRoute = () => <AdminRoute component={AdminAddProduct} />;
const AdminEditProductRoute = () => <AdminRoute component={AdminEditProduct} />;

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-champagne mx-auto mb-4"></div>
          <p className="text-warm-gray">Loading...</p>
        </div>
      </div>
    );
  }

  // For now, always show authenticated routes since we have a guest user
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/products" component={Products} />
      <Route path="/product/:slug" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-confirmation" component={OrderConfirmation} />
      <Route path="/order-tracking" component={OrderTracking} />
      <Route path="/order-tracking/:trackingNumber" component={OrderTracking} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/gift-cards" component={GiftCards} />
      <Route path="/store-locator" component={StoreLocator} />
      <Route path="/shipping" component={Shipping} />
      <Route path="/returns" component={Returns} />
      <Route path="/size-guide" component={SizeGuide} />
      <Route path="/faq" component={FAQ} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/cookies" component={Cookies} />
      <Route path="/profile" component={Profile} />
      <Route path="/my-orders" component={MyOrders} />
      <Route path="/compare" component={CompareProducts} />
      <Route path="/address-book" component={AddressBook} />
      <Route path="/payment-methods" component={PaymentMethods} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      {/* Admin Routes - More specific routes first */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboardRoute} />
      <Route path="/admin/products/add" component={AdminAddProductRoute} />
      <Route path="/admin/products/edit/:id" component={AdminEditProductRoute} />
      <Route path="/admin/products" component={AdminProductsRoute} />
      <Route path="/admin/orders" component={AdminOrdersRoute} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;