# Specification

## Summary
**Goal:** Add legal policy pages and cookie consent, update footer with compliance/contact details, and require authenticated users to accept and digitally sign key policies before using marketplace-critical features.

**Planned changes:**
- Update the shared layout to include a site-wide footer on every page with: “© ANC Electronics N More”, “PCI Compliant # 201100278838”, the provided business/contact info exactly as supplied, a Partners line mentioning “Authorize.net” and “Zen dash”, and a row/strip of major payment card brand logos (including Visa and Mastercard).
- Add new routed pages for Shipping Policy, Returns Policy, and Terms & Conditions, and link them from the footer on all pages.
- Replace the existing Privacy Policy page body content with the user-uploaded privacy policy text while keeping the current route/path unchanged.
- Add a cookie consent banner/popup with Accept/Reject actions that persist the user’s choice locally and include a link to the Privacy Policy page.
- Implement a policy acceptance + digital signature flow for authenticated users (customers and sellers) covering: Privacy Policy, Shipping Policy, Returns Policy, Terms & Conditions; store per-user acceptance records (policy identifier, policy version/last-updated value, signature text, timestamp).
- Enforce policy signing by blocking marketplace-critical actions (at minimum checkout/purchasing and seller/business tools) until all required policies are signed, and provide a direct path to complete missing signatures.
- Register new policy routes in the app router and ensure footer links work on both desktop and mobile without breaking existing routes.

**User-visible outcome:** Users can view all legal policies from the footer, manage cookie consent, and—when signed in—must accept and digitally sign required policies before completing checkout or using seller/business tools; the footer shows updated compliance, partner, contact, and payment logo information across the site.
