import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Package,
  Search,
  ShoppingBag,
  Star,
  Store,
} from "lucide-react";
import { useMemo, useState } from "react";

// ── Sample Data ──────────────────────────────────────────────────────────────

const STORES = [
  {
    id: "store-1",
    name: "ANC Electronics N Services",
    tagline: "Quality electronics and tech services",
    category: "Electronics",
    productCount: 12,
    rating: 4.8,
    sellerName: "Angela Miller",
  },
  {
    id: "store-2",
    name: "Tech Gadgets Plus",
    tagline: "The latest gadgets at great prices",
    category: "Electronics",
    productCount: 8,
    rating: 4.5,
    sellerName: "Marcus Johnson",
  },
  {
    id: "store-3",
    name: "Home Essentials Co",
    tagline: "Everything for your home",
    category: "Home & Garden",
    productCount: 20,
    rating: 4.7,
    sellerName: "Sarah Williams",
  },
];

export const PRODUCTS = [
  {
    id: "prod-1",
    name: "Wireless Bluetooth Headphones",
    price: 7999,
    category: "Electronics",
    storeId: "store-1",
    storeName: "ANC Electronics N Services",
    stock: 15,
  },
  {
    id: "prod-2",
    name: "USB-C Charging Hub 7-Port",
    price: 4999,
    category: "Electronics",
    storeId: "store-1",
    storeName: "ANC Electronics N Services",
    stock: 30,
  },
  {
    id: "prod-3",
    name: "Smart LED Desk Lamp",
    price: 3499,
    category: "Electronics",
    storeId: "store-2",
    storeName: "Tech Gadgets Plus",
    stock: 22,
  },
  {
    id: "prod-4",
    name: "Wireless Phone Charger Pad",
    price: 2499,
    category: "Electronics",
    storeId: "store-2",
    storeName: "Tech Gadgets Plus",
    stock: 45,
  },
  {
    id: "prod-5",
    name: "Premium Garden Tool Set",
    price: 8999,
    category: "Home & Garden",
    storeId: "store-3",
    storeName: "Home Essentials Co",
    stock: 10,
  },
  {
    id: "prod-6",
    name: "Decorative Throw Pillow Set (2)",
    price: 3999,
    category: "Home & Garden",
    storeId: "store-3",
    storeName: "Home Essentials Co",
    stock: 18,
  },
  {
    id: "prod-7",
    name: "Tech Repair Service - Phone",
    price: 5900,
    category: "Services",
    storeId: "store-1",
    storeName: "ANC Electronics N Services",
    stock: 99,
  },
  {
    id: "prod-8",
    name: "Laptop Tune-Up Service",
    price: 7900,
    category: "Services",
    storeId: "store-1",
    storeName: "ANC Electronics N Services",
    stock: 99,
  },
];

const CATEGORIES = [
  "All",
  "Electronics",
  "Clothing",
  "Services",
  "Home & Garden",
  "Arts & Crafts",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "bg-blue-100 text-blue-800",
  Clothing: "bg-pink-100 text-pink-800",
  Services: "bg-violet-100 text-violet-800",
  "Home & Garden": "bg-green-100 text-green-800",
  "Arts & Crafts": "bg-amber-100 text-amber-800",
  Other: "bg-gray-100 text-gray-800",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

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
          className={`h-3.5 w-3.5 ${
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingBag className="h-9 w-9 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              ANC Marketplace
            </h1>
          </div>
          <p className="text-lg md:text-xl opacity-80 mb-8 max-w-2xl mx-auto">
            Shop from sellers and businesses across the country — quality
            products, services, and more.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              data-ocid="marketplace.search_input"
              placeholder="Search products, stores, and services…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-base bg-white text-foreground border-transparent shadow-lg focus-visible:ring-2 focus-visible:ring-white"
            />
          </div>
        </div>
      </section>

      {/* ── Category tabs ────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-white border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex items-center gap-1 py-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                data-ocid="marketplace.category.tab"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">
        {/* ── Featured Stores ───────────────────────────────────────────── */}
        {activeCategory === "All" && !search && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Featured Stores
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Trusted sellers ready to serve you
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {STORES.map((store, idx) => (
                <Card
                  key={store.id}
                  data-ocid={`marketplace.store.item.${idx + 1}`}
                  className="group overflow-hidden hover:shadow-lg transition-shadow border border-border"
                >
                  {/* Store banner */}
                  <div className="h-20 bg-primary relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-2 right-4 w-16 h-16 rounded-full bg-white" />
                      <div className="absolute -bottom-4 left-8 w-24 h-24 rounded-full bg-white" />
                    </div>
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center">
                        <Store className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <Badge
                      className={`absolute top-3 right-3 text-xs font-medium ${CATEGORY_COLORS[store.category] ?? "bg-gray-100 text-gray-800"}`}
                    >
                      {store.category}
                    </Badge>
                  </div>

                  <CardContent className="pt-4 pb-5 px-4">
                    <h3 className="font-bold text-foreground text-base leading-tight mb-1 group-hover:text-primary transition-colors">
                      {store.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {store.tagline}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <StarRating rating={store.rating} />
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Package className="h-3.5 w-3.5" />
                        {store.productCount} products
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">
                      Seller:{" "}
                      <span className="font-medium text-foreground">
                        {store.sellerName}
                      </span>
                    </p>

                    <Link to={`/marketplace/store/${store.id}` as never}>
                      <Button
                        size="sm"
                        className="w-full gap-2"
                        variant="outline"
                      >
                        Visit Store <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* ── Products grid ────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {activeCategory === "All" ? "All Products" : activeCategory}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-xl">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-foreground mb-1">
                No products found
              </p>
              <p className="text-sm text-muted-foreground">
                Try a different category or search term
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product, idx) => (
                <Card
                  key={product.id}
                  data-ocid={`marketplace.product.item.${idx + 1}`}
                  className="group overflow-hidden hover:shadow-lg transition-shadow border border-border"
                >
                  {/* Product image placeholder */}
                  <div className="h-44 bg-muted flex items-center justify-center relative overflow-hidden">
                    <Package className="h-14 w-14 text-muted-foreground opacity-30" />
                    <Badge
                      className={`absolute top-2 right-2 text-xs ${CATEGORY_COLORS[product.category] ?? "bg-gray-100 text-gray-800"}`}
                    >
                      {product.category}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground text-sm leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2 truncate">
                      by {product.storeName}
                    </p>
                    <p className="text-xl font-bold text-primary mb-3">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </p>

                    <Link to={`/marketplace/product/${product.id}` as never}>
                      <Button
                        size="sm"
                        className="w-full"
                        disabled={product.stock === 0}
                      >
                        View Product
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* ── Become a Seller CTA ───────────────────────────────────────── */}
        <section className="rounded-2xl bg-primary text-primary-foreground p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-4 left-10 w-32 h-32 rounded-full bg-white" />
            <div className="absolute bottom-4 right-10 w-48 h-48 rounded-full bg-white" />
          </div>
          <div className="relative">
            <Store className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl font-bold mb-3">Ready to start selling?</h2>
            <p className="text-lg opacity-80 mb-6 max-w-lg mx-auto">
              Join ANC Marketplace — no monthly fees, just a small $5 platform
              fee per sale. Reach thousands of customers.
            </p>
            <Link to="/seller-onboarding">
              <Button
                data-ocid="marketplace.become_seller.button"
                size="lg"
                variant="secondary"
                className="gap-2 font-semibold"
              >
                Get Started as a Seller <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
