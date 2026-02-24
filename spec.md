# Specification

## Summary
**Goal:** Integrate live Stripe Connect payouts, seller onboarding, checkout sessions, and transaction persistence into the ANC Marketplace seller dashboard.

**Planned changes:**
- Create a centralized `frontend/src/lib/stripeConfig.ts` module exporting the live Stripe publishable and secret keys; all Stripe API call sites import from this single module
- Update `FinancialOverviewCards` to display the seller's available balance as $72,025.00 and the $10,000 business credit as a separate, non-withdrawable spending credit
- Replace the stub `TransfersStubPanel` with a real withdrawal/payout form that posts directly to the Stripe Payouts or Transfers API using the live secret key; form includes amount, currency, and reason fields with validation against available balance
- On successful withdrawal, reduce the displayed available balance and append a transaction record (amount, currency, description, status, timestamp) to the frontend transaction history state, visible in `AdminTransactionsPanel`
- Implement Stripe Connect seller account onboarding in `OwnerStripeConnectCard`: create a connected account and generate an Account Link via direct Stripe API call, then redirect the seller to the Stripe-hosted onboarding flow
- Implement Stripe Checkout session creation in `AdminRevenueInflowPanel` via a `useStripeCheckout` hook for marketplace sale fees ($5/sale) and Store Builder subscriptions ($10/month), with redirect to `/payment-success` or `/payment-failure`
- Update `StripeSetupCard` to show a green "Configured" status badge, pre-fill the publishable key field, and mask the secret key field
- Update the backend `main.mo` Motoko actor to persist payout transaction records and expose `recordTransaction`, `getTransactions`, and `getSellerBalance` methods; initial balance set to 7,202,500 cents

**User-visible outcome:** Sellers can view their $72,025.00 available balance, submit real Stripe payouts that deduct from that balance, see all withdrawal history in the transactions panel, onboard via Stripe Connect, and initiate Stripe Checkout for marketplace fees and subscriptions — all with live Stripe keys configured and displayed as active in the admin payments panel.
