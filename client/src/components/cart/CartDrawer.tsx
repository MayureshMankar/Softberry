import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cartItems, totalAmount, updateQuantity, removeFromCart, isUpdating, isRemoving } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `₹${numPrice.toLocaleString()}`;
  };

  const handleQuantityChange = (id: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      updateQuantity({ id, quantity: newQuantity });
    }
  };

  if (!isAuthenticated) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-96 bg-cream">
          <SheetHeader>
            <SheetTitle className="text-luxury-black font-serif">Shopping Cart</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
            <ShoppingBag className="h-16 w-16 text-warm-gray" />
            <p className="text-warm-gray text-center">
              Please sign in to view your cart
            </p>
            <Button
              onClick={() => {
                onOpenChange(false);
                window.location.href = '/api/login';
              }}
              className="bg-luxury-black text-cream hover:bg-champagne hover:text-luxury-black"
              data-testid="cart-login-button"
            >
              Sign In
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-96 bg-cream flex flex-col" data-testid="cart-drawer">
        <SheetHeader>
          <SheetTitle className="text-luxury-black font-serif flex items-center justify-between">
            Shopping Cart
            {cartItems.length > 0 && (
              <Badge className="bg-champagne text-luxury-black">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 space-y-4">
            <ShoppingBag className="h-16 w-16 text-warm-gray" />
            <p className="text-warm-gray text-center">
              Your cart is empty
            </p>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="border-luxury-black text-luxury-black hover:bg-luxury-black hover:text-cream"
              data-testid="continue-shopping-button"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto space-y-4 py-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow-sm"
                  data-testid={`cart-item-${item.id}`}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-warm-gray/10 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-luxury-black truncate">
                        {item.product.name}
                      </h4>
                      {item.product.brand && (
                        <p className="text-sm text-champagne">{item.product.brand.name}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-burgundy">
                          {formatPrice(item.product.price)}
                        </span>
                        {item.product.volume && (
                          <span className="text-sm text-warm-gray">{item.product.volume}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-warm-gray/10"
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        disabled={isUpdating}
                        data-testid={`decrease-quantity-${item.id}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-warm-gray/10"
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                        disabled={isUpdating}
                        data-testid={`increase-quantity-${item.id}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-warm-gray hover:text-red-500 hover:bg-red-50"
                      onClick={() => removeFromCart(item.id)}
                      disabled={isRemoving}
                      data-testid={`remove-item-${item.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <SheetFooter className="flex flex-col space-y-4">
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-serif text-lg font-bold text-luxury-black">
                  Total:
                </span>
                <span className="font-bold text-xl text-burgundy" data-testid="cart-total">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              
              <div className="space-y-2">
                <Button
                  asChild
                  className="w-full bg-luxury-black text-cream hover:bg-champagne hover:text-luxury-black font-medium"
                  data-testid="checkout-button"
                >
                  <Link href="/cart">
                    View Cart & Checkout
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-luxury-black text-luxury-black hover:bg-luxury-black hover:text-cream"
                  onClick={() => onOpenChange(false)}
                  data-testid="continue-shopping-drawer-button"
                >
                  Continue Shopping
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
