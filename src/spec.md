# Specification

## Summary
**Goal:** Make all previously built pages easily accessible from the site header via role-grouped dropdown navigation (desktop and mobile), and add a site-wide Privacy Policy menu option.

**Planned changes:**
- Update the main header navigation (desktop) to include dropdown menus:
  - “Customer” dropdown linking to Store (/store), Customer FAQ (/customer-faq), Customer Blog (/customer-blog).
  - “Sellers & Businesses” dropdown linking to Store Builder (/store-builder), App Center (/app-center), Funnels (/funnels), Sellers & Businesses FAQ (/sellers-businesses-faq), Sellers & Businesses Blog (/sellers-businesses-blog), Affiliate (/affiliate).
- Update the mobile menu (Sheet) to provide the same dropdown navigation options/links as desktop.
- Add a site-wide dropdown menu option linking to Privacy Policy (/privacy-policy), visible for both unauthenticated and authenticated users, without removing the existing footer link.
- Ensure navigation uses TanStack Router link navigation (no full page reload) and that existing header elements (promo banner, “Connect with the appointment dashboard53” button, user profile dropdown) continue to work as-is.

**User-visible outcome:** Users on desktop and mobile can open the “Customer” and “Sellers & Businesses” dropdowns to reach all key existing pages, and can always access the Privacy Policy from the header dropdown menu.
