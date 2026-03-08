import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import type { CartItem } from "./MarketplaceProductPage";

// ── Cart helpers ──────────────────────────────────────────────────────────────

function getCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem("anc_cart") ?? "[]");
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem("anc_cart", JSON.stringify(items));
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [cartItems, setCartItems] = useState<CartItem[]>(getCart);
  const [checkingOut, setCheckingOut] = useState(false);

  // ── Mutations ────────────────────────────────────────────────────────────

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCartItems((prev) => {
      const updated = prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0);
      saveCart(updated);
      return updated;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveCart(updated);
      return updated;
    });
  }, []);

  // ── Order summary ────────────────────────────────────────────────────────

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const uniqueStores = new Set(cartItems.map((i) => i.storeId)).size;
  const platformFeeTotal = uniqueStores * 500; // $5 per seller in cents
  const grandTotal = subtotal + platformFeeTotal;

  // ── Checkout ─────────────────────────────────────────────────────────────

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!actor) {
      toast.error("Please log in to proceed to checkout.");
      return;
    }
    setCheckingOut(true);
    try {
      const items = cartItems.map((item) => ({
        productName: item.name,
        currency: "usd",
        quantity: BigInt(item.quantity),
        priceInCents: BigInt(item.price),
        productDescription: `Sold by ${item.storeName}`,
      }));

      const successUrl = `${window.location.origin}/payment-success`;
      const cancelUrl = `${window.location.origin}/cart`;

      const result = await actor.createCheckoutSession(
        items,
        successUrl,
        cancelUrl,
      );

      // Result may be a URL string or a JSON object with a url property
      let checkoutUrl = result;
      try {
        const parsed = JSON.parse(result) as { url?: string };
        if (parsed?.url) checkoutUrl = parsed.url;
      } catch {
        // result is already a URL string
      }

      if (checkoutUrl?.startsWith("http")) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Invalid checkout URL received");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(
        "Could not create checkout session. Please try again or contact support.",
      );
      setCheckingOut(false);
    }
  };

  // ── Empty state ──────────────────────────────────────────────────────────

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div data-ocid="cart.empty_state" className="text-center max-w-md">
          <ShoppingBag className="h-20 w-20 text-muted-foreground mx-auto mb-5 opacity-30" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything yet. Browse the marketplace to
            find something you'll love.
          </p>
          <Link to="/marketplace">
            <Button
              data-ocid="cart.continue_shopping.link"
              size="lg"
              className="gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Browse Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Filled cart ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate({ to: "/marketplace" })}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </button>
          <Separator orientation="vertical" className="h-5" />
          <h1 className="text-2xl font-bold text-foreground">Your Cart</h1>
          <span className="text-sm text-muted-foreground">
            ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Cart items ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, idx) => (
              <Card
                key={item.id}
                data-ocid={`cart.item.${idx + 1}`}
                className="border border-border"
              >
                <CardContent className="p-4 flex items-center gap-4">
                  {/* Product image placeholder */}
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-7 w-7 text-muted-foreground opacity-40" />
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm leading-snug truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      by {item.storeName}
                    </p>
                    <p className="text-sm font-bold text-primary mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Line total */}
                  <div className="text-right shrink-0 min-w-[70px]">
                    <p className="text-sm font-bold text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Remove */}
                  <Button
                    data-ocid={`cart.remove_item.button.${idx + 1}`}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Continue shopping link */}
            <Link
              to="/marketplace"
              data-ocid="cart.continue_shopping.link"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Continue shopping
            </Link>
          </div>

          {/* ── Order summary ────────────────────────────────────────────── */}
          <div className="space-y-4">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Platform fee ({uniqueStores} seller
                    {uniqueStores !== 1 ? "s" : ""} × $5.00)
                  </span>
                  <span className="font-medium">
                    {formatPrice(platformFeeTotal)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatPrice(grandTotal)}
                  </span>
                </div>

                <Button
                  data-ocid="cart.checkout.button"
                  size="lg"
                  className="w-full gap-2 mt-2"
                  onClick={handleCheckout}
                  disabled={checkingOut}
                >
                  {checkingOut ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating session…
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      Proceed to Checkout
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Escrow notice */}
            <Card className="border border-green-200 bg-green-50">
              <CardContent className="p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Escrow Protected
                  </p>
                  <p className="text-xs text-green-700 mt-0.5">
                    Payment is held securely until you confirm receipt of your
                    order.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
