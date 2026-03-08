import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  MessageCircle,
  Package,
  ShieldCheck,
  Star,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { PRODUCTS } from "./MarketplacePage";

// ── Helpers ───────────────────────────────────────────────────────────────────

const STORES = [
  {
    id: "store-1",
    name: "ANC Electronics N Services",
    tagline: "Quality electronics and tech services",
    description:
      "ANC Electronics N Services is your go-to destination for premium electronics, accessories, and professional tech repair services. We pride ourselves on quality products and excellent customer support.",
    category: "Electronics",
    productCount: 12,
    rating: 4.8,
    sellerName: "Angela Miller",
    businessType: "LLC",
  },
  {
    id: "store-2",
    name: "Tech Gadgets Plus",
    tagline: "The latest gadgets at great prices",
    description:
      "Tech Gadgets Plus brings you the newest and most innovative technology products at competitive prices. From smart home devices to personal electronics, we have something for every tech enthusiast.",
    category: "Electronics",
    productCount: 8,
    rating: 4.5,
    sellerName: "Marcus Johnson",
    businessType: "Sole Proprietor",
  },
  {
    id: "store-3",
    name: "Home Essentials Co",
    tagline: "Everything for your home",
    description:
      "Home Essentials Co curates the best home and garden products to make your living space more comfortable and beautiful. From garden tools to decorative accents, we carry products you will love.",
    category: "Home & Garden",
    productCount: 20,
    rating: 4.7,
    sellerName: "Sarah Williams",
    businessType: "LLC",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "bg-blue-100 text-blue-800",
  Clothing: "bg-pink-100 text-pink-800",
  Services: "bg-violet-100 text-violet-800",
  "Home & Garden": "bg-green-100 text-green-800",
  "Arts & Crafts": "bg-amber-100 text-amber-800",
  Other: "bg-gray-100 text-gray-800",
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
      <span className="text-sm text-muted-foreground ml-1 font-medium">
        {rating}
      </span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MarketplaceStorePage() {
  const { storeId } = useParams({ strict: false }) as { storeId: string };

  const store = STORES.find((s) => s.id === storeId);
  const storeProducts = PRODUCTS.filter((p) => p.storeId === storeId);

  if (!store) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Store not found
          </h2>
          <p className="text-muted-foreground mb-6">
            This store may have been removed or the link is incorrect.
          </p>
          <Link to="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Store header banner ─────────────────────────────────────────── */}
      <div className="bg-primary relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute top-4 right-32 w-24 h-24 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-16 w-36 h-36 rounded-full bg-white/5" />
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10 relative">
          {/* Back navigation */}
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Store avatar */}
            <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center flex-shrink-0">
              <Store className="h-10 w-10 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
                  {store.name}
                </h1>
                <Badge
                  className={`text-xs ${CATEGORY_COLORS[store.category] ?? "bg-gray-100 text-gray-800"}`}
                >
                  {store.category}
                </Badge>
              </div>
              <p className="text-primary-foreground/75 text-base mb-3">
                {store.tagline}
              </p>
              <StarRating rating={store.rating} />
            </div>

            <Button
              data-ocid="store.contact.button"
              variant="secondary"
              className="gap-2 shrink-0"
              onClick={() =>
                toast.info("Messaging coming soon — stay tuned!", {
                  icon: <MessageCircle className="h-4 w-4" />,
                })
              }
            >
              <MessageCircle className="h-4 w-4" />
              Contact Seller
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        {/* ── Products ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-5">
            Products from this Store
          </h2>

          {storeProducts.length === 0 ? (
            <div
              data-ocid="store.products.empty_state"
              className="text-center py-16 border border-dashed border-border rounded-xl"
            >
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium text-foreground mb-1">
                No products listed yet
              </p>
              <p className="text-sm text-muted-foreground">
                This seller hasn't added any products yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {storeProducts.map((product, idx) => (
                <Card
                  key={product.id}
                  data-ocid={`store.product.item.${idx + 1}`}
                  className="group overflow-hidden hover:shadow-lg transition-shadow border border-border"
                >
                  {/* Product image placeholder */}
                  <div className="h-44 bg-muted flex items-center justify-center relative">
                    <Package className="h-14 w-14 text-muted-foreground opacity-25" />
                    <Badge
                      className={`absolute top-2 right-2 text-xs ${CATEGORY_COLORS[product.category] ?? "bg-gray-100 text-gray-800"}`}
                    >
                      {product.category}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xl font-bold text-primary mb-1">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </p>
                    <Link to={`/marketplace/product/${product.id}` as never}>
                      <Button size="sm" className="w-full">
                        View Product
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* ── About section ─────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Description */}
          <Card className="border border-border">
            <CardContent className="p-6">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" />
                About This Store
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {store.description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium text-foreground">Seller:</span>
                  {store.sellerName}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Business Type:
                  </span>
                  {store.businessType}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Member since 2024
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buyer protection */}
          <Card className="border border-border bg-muted/30">
            <CardContent className="p-6">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                Buyer Protection
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  Funds held in escrow until you confirm receipt
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  20-day auto-release if no response from buyer
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  Dispute resolution available for all purchases
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">$5</span>
                  Non-refundable platform fee per sale
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
