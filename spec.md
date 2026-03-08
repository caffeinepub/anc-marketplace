# ANC Marketplace — Public-Facing Storefront

## Current State

The app has a full seller onboarding flow, seller/business dashboards, admin center, product management, and Stripe payment integration. The `StorePage.tsx` file exists but is completely empty. There is no public-facing marketplace where customers can browse seller storefronts and products. The `StoreBuilderPage.tsx` is a subscription upsell page, not the marketplace itself.

Routes exist for `/seller-dashboard`, `/seller-onboarding`, `/store-builder`, but there is no `/marketplace` or similar customer-facing browse route.

## Requested Changes (Diff)

### Add

- **Public Marketplace Page** (`/marketplace`) — Landing page for the public storefront. Shows:
  - Hero banner: "Shop ANC Marketplace"
  - Category filter bar (Electronics, Clothing, Services, Home & Garden, Arts & Crafts, Other)
  - Search bar
  - Grid of seller storefronts (store cards) with store name, logo placeholder, tagline, product count, rating
  - Featured Products section (grid of product cards with image, name, price, seller name, "Add to Cart" / "View" buttons)
  - "Become a Seller" CTA banner at bottom

- **Individual Store Page** (`/marketplace/store/$storeId`) — Public storefront for a seller/business:
  - Store header: banner image, store name, logo, description, rating, "Follow" button
  - Product listings grid for that store
  - About the seller section

- **Product Detail Page** (`/marketplace/product/$productId`) — Individual product page:
  - Product images (placeholder carousel)
  - Product name, price, description, category, stock
  - Seller info card linking to their store
  - "Add to Cart" / "Buy Now" buttons (Stripe Checkout flow)
  - Escrow/hold notice: funds held until delivery confirmed, $5 platform fee disclosed

- **Cart + Checkout** (`/cart`) — Simple cart page:
  - List of items with quantity control and remove
  - Order summary with subtotal, $5 platform fee per seller, total
  - "Proceed to Checkout" → Stripe Checkout session

- **Seller Deploy to Marketplace** — In `SellerDashboardPage.tsx`, add a prominent "Deploy to Marketplace" button/card. When clicked, marks the storefront as published and shows confirmation. Published storefronts appear on `/marketplace`.

- **Nav update** — Add "Marketplace" link to the main navigation (Layout.tsx) pointing to `/marketplace`.

### Modify

- **`StorePage.tsx`** — Implement as the individual store/storefront view (reuse for `/marketplace/store/$storeId` pattern).
- **`App.tsx`** — Add routes for `/marketplace`, `/marketplace/store/$storeId`, `/marketplace/product/$productId`, and `/cart`.
- **`SellerDashboardPage.tsx`** — Add "Deploy to Marketplace" action card.
- **`Layout.tsx`** — Add "Marketplace" link in desktop nav and mobile menu.

### Remove

- Nothing removed.

## Implementation Plan

1. Create `MarketplacePage.tsx` — public browse page with mock seller storefronts and products (frontend only, using local state/mock data since backend product catalog endpoints are not yet defined).
2. Create `MarketplaceStorePage.tsx` — individual seller storefront page.
3. Create `MarketplaceProductPage.tsx` — individual product detail page with Stripe checkout hook.
4. Create `CartPage.tsx` — simple cart with Stripe checkout session creation.
5. Update `StorePage.tsx` — populate it as a redirect or alias to `MarketplaceStorePage`.
6. Update `SellerDashboardPage.tsx` — add "Deploy to Marketplace" card with published/unpublished toggle state stored in localStorage.
7. Update `App.tsx` — register new routes.
8. Update `Layout.tsx` — add Marketplace nav link.

All product/storefront data will be managed as frontend mock data (seeded sample storefronts and products) since no backend product catalog API exists yet. The Stripe checkout integration for product purchases uses the existing `createCheckoutSession` backend call.
