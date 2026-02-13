# Specification

## Summary
**Goal:** Rebrand the platform to “ANC Marketplace” and add seller payout features: escrow-style held balance, payout profile/account number, payout transfer tracking, plus debit/credit card request application workflows.

**Planned changes:**
- Update all user-facing branding to “ANC Marketplace” across header, homepage hero/banner, footer, PWA manifest, and HTML meta/title tags; describe “ANC Electronics N Services” as a store within the marketplace (business/industrial products and services).
- Update backend seeded assistant knowledge base to reflect the new platform/store relationship and remove/adjust any entries that contradict holding seller funds temporarily.
- Add backend data structures and authenticated APIs for seller payout profiles (including a stable human-readable internal account number), held balance ledger credits, and payout transfer records with statuses.
- Add a seller-facing “Payouts” UI section to view platform account number, held balance, manage external payout account details (plain fields), and list payout transfers with status.
- Add backend storage/APIs for seller debit card request and credit card application records with status lifecycle and timestamp history.
- Extend the seller “Payouts” UI to include forms to request a business debit card and apply for a credit card, showing current status after submission.
- Update any relevant public-facing policy/terms copy where it explicitly conflicts with the new “temporary hold until transfer” capability.

**User-visible outcome:** The site appears as “ANC Marketplace” (with ANC Electronics N Services presented as a store within it). Logged-in sellers can view a platform payout account number and held balance, enter payout details, track payout transfers, and submit debit/credit card request applications with visible statuses.
