import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Loader2,
  Package,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PRODUCTS } from "./MarketplacePage";

// ── Helpers ───────────────────────────────────────────────────────────────────

const STORE_RATINGS: Record<string, number> = {
  "store-1": 4.8,
  "store-2": 4.5,
  "store-3": 4.7,
};

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "bg-blue-100 text-blue-800",
  Clothing: "bg-pink-100 text-pink-800",
  Services: "bg-violet-100 text-violet-800",
  "Home & Garden": "bg-green-100 text-green-800",
  "Arts & Crafts": "bg-amber-100 text-amber-800",
  Other: "bg-gray-100 text-gray-800",
};

const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  "prod-1":
    "Experience rich, immersive audio with deep bass and crystal-clear highs. These premium Bluetooth headphones offer up to 30 hours of battery life and fold flat for easy portability.",
  "prod-2":
    "Power all your devices from a single hub with 7 USB-C and USB-A ports supporting fast charging and 4K video passthrough. Compact enough to travel with, powerful enough for your desk.",
  "prod-3":
    "Light your workspace perfectly with smart color temperature adjustment and stepless dimming. The flexible arm and memory function keep your ideal settings ready every time you sit down.",
  "prod-4":
    "Simply set your phone down and charging begins — no cables, no fuss. Compatible with all Qi-enabled devices and supports up to 15W fast wireless charging.",
  "prod-5":
    "A complete set of 8 ergonomic garden tools crafted from hardened carbon steel and weatherproof handles. Everything you need for planting, weeding, and maintaining a thriving garden.",
  "prod-6":
    "Refresh your living room in seconds with this set of two premium throw pillows in complementary designs. Filled with plush microfiber fill and removable, machine-washable covers.",
  "prod-7":
    "Get your smartphone back in top condition with our professional repair service. We diagnose and fix cracked screens, battery issues, charging ports, and software problems — same-day service available.",
  "prod-8":
    "Breathe new life into your laptop with a comprehensive tune-up: malware removal, driver updates, disk cleanup, startup optimization, and a full hardware check for peak performance.",
};

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-1">{rating}</span>
    </div>
  );
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  storeId: string;
  storeName: string;
}

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

function addToCart(product: {
  id: string;
  name: string;
  price: number;
  storeId: string;
  storeName: string;
}) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === product.id);
  if (existing) {
    existing.quantity += 1;
    saveCart(cart);
  } else {
    saveCart([
      ...cart,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        storeId: product.storeId,
        storeName: product.storeName,
      },
    ]);
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MarketplaceProductPage() {
  const { productId } = useParams({ strict: false }) as { productId: string };
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Product not found
          </h2>
          <p className="text-muted-foreground mb-6">
            This product may have been removed or the link is incorrect.
          </p>
          <Link to="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const description =
    PRODUCT_DESCRIPTIONS[product.id] ??
    `${product.name} is a quality product available from ${product.storeName}. Please contact the seller for more details.`;
  const storeRating = STORE_RATINGS[product.storeId] ?? 4.5;

  const handleAddToCart = () => {
    setAddingToCart(true);
    setTimeout(() => {
      addToCart(product);
      setAddingToCart(false);
      toast.success(`"${product.name}" added to cart!`, {
        action: {
          label: "View Cart",
          onClick: () => navigate({ to: "/cart" }),
        },
      });
    }, 400);
  };

  const handleBuyNow = () => {
    setBuyingNow(true);
    setTimeout(() => {
      addToCart(product);
      setBuyingNow(false);
      navigate({ to: "/cart" });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <button
          type="button"
          data-ocid="product.back.button"
          onClick={() => navigate({ to: "/marketplace" })}
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* ── Left: image ─────────────────────────────────────────────── */}
          <div>
            <div className="aspect-square bg-muted rounded-2xl flex items-center justify-center mb-4 border border-border overflow-hidden">
              <Package className="h-24 w-24 text-muted-foreground opacity-25" />
            </div>
            {/* Escrow notice */}
            <Card className="border border-green-200 bg-green-50">
              <CardContent className="p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Secure Escrow Protection
                  </p>
                  <p className="text-xs text-green-700 mt-0.5">
                    Funds are held securely until you confirm receipt. $5
                    platform fee applies.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Right: details ──────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Category badge */}
            <Badge
              className={`${CATEGORY_COLORS[product.category] ?? "bg-gray-100 text-gray-800"}`}
            >
              {product.category}
            </Badge>

            {/* Product name */}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>

            {/* Stock */}
            <p
              className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-destructive"}`}
            >
              {product.stock > 0
                ? `✓ ${product.stock} in stock`
                : "✗ Out of stock"}
            </p>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Product Description
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            <Separator />

            {/* Seller card */}
            <Card className="border border-border">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {product.storeName}
                    </p>
                    <StarRating rating={storeRating} />
                  </div>
                </div>
                <Link
                  data-ocid="product.store.link"
                  to={`/marketplace/store/${product.storeId}` as never}
                  className="text-sm text-primary hover:underline font-medium shrink-0"
                >
                  Visit Store →
                </Link>
              </CardContent>
            </Card>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                data-ocid="product.add_to_cart.button"
                size="lg"
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
              >
                {addingToCart ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
                {addingToCart ? "Adding…" : "Add to Cart"}
              </Button>

              <Button
                data-ocid="product.buy_now.button"
                size="lg"
                className="flex-1 gap-2"
                onClick={handleBuyNow}
                disabled={product.stock === 0 || buyingNow}
              >
                {buyingNow ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                {buyingNow ? "Processing…" : "Buy Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
