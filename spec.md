# ANC Marketplace – Admin Center: Balance Checkout + Menu Item Completion

## Current State

- Available Balance is a hardcoded constant (`CORRECT_AVAILABLE_BALANCE_CENTS = 7_368_116`) in `FinancialOverviewCards.tsx`; no deduction happens when payments succeed
- Payroll Savings is stored in `localStorage` as `admin_payroll_savings`; other balances are read-only constants
- `StripeDepositCard` (Financial tab): "Deposit via Stripe Checkout" button redirects user to a Stripe-hosted payment page
- `PaymentsPanel` (Payments tab): "Send Payment" submits but does NOT deduct from the available balance
- `TransferPanel` (Transfer tab): executes transfers but does NOT deduct from source balance
- `EmployeePaymentsPanel` (Employees tab): all buttons only `console.log`; no real payment logic, no balance deduction
- `AdminMessagingPanel` (Messaging tab): "Coming Soon" stub — Compose button shows a toast only
- `FeeConfigurationPanel` (Financial tab): Save button is disabled; no actual save capability
- Settings tab: only shows AdminAccessLinksPanel (same as Overview)
- Analytics tab: renders when data is present but has no empty-state chart or date filtering

## Requested Changes (Diff)

### Add

- **Shared mutable balance store** (`useAdminBalance` hook): localStorage-backed reactive state for available balance, payroll savings, and credit. Exposes `deductFromBalance(amountCents, source)` and `addToBalance(amountCents, source)` so all panels can mutate it and reflect changes in real time.
- **Admin internal checkout flow** (Financial tab, within `StripeDepositCard` or a new sibling card): Instead of redirecting to Stripe, show a "Pay from Available Balance" section where the admin can enter an amount, confirm, and the balance is immediately deducted from available balance with a success confirmation and transaction record — no Stripe redirect.
- **Employee Payments real logic**: Connect `handleManualPayment` and `handleScheduledPayment` to deduct the payment amount from available balance, record to `localStorage` transaction log, show success/error toast, and display a recent-payments list.
- **Scheduled Payments list**: Show stored scheduled payment entries with a "Run Now" button that processes and deducts from balance.
- **Messaging Panel full build**: Replace "Coming Soon" stub with a working compose-and-send UI that stores messages in `localStorage`, lists message threads by recipient (user type filter: all / seller / customer / business), shows message history per thread, mark-as-read toggle on each message.
- **Settings tab real content**: Replace the duplicate `AdminAccessLinksPanel` with a proper Settings panel including: App Configuration (app name, support email, contact phone — editable), Platform Policy section (escrow hold period, auto-release days — editable), and a Danger Zone (reset balance overrides to canonical values).
- **FeeConfigurationPanel real save**: Enable the Save button and persist the sale fee to `localStorage` under `admin_fee_config`. Read that value back on load so the fee reflects saved changes.

### Modify

- **`FinancialOverviewCards`**: Read available balance and payroll savings from the shared `useAdminBalance` hook (reactive state) instead of the static constant, so the cards update when deductions happen.
- **`PaymentsPanel`**: After a successful non-Stripe payment, call `deductFromBalance(amountCents, 'available')` to subtract from available balance.
- **`TransferPanel`**: After a successful transfer, call `deductFromBalance(amountCents, source)` for the source account and `addToBalance(amountCents, destination)` where applicable (e.g., payroll_savings destination adds to payroll savings).

### Remove

- "Coming Soon" badge and stub content from AdminMessagingPanel.
- "Backend integration pending" alert from EmployeePaymentsPanel.
- Disabled Save button logic from FeeConfigurationPanel (replace with working save).
- Duplicate `AdminAccessLinksPanel` from Settings tab.

## Implementation Plan

1. Create `src/frontend/src/hooks/useAdminBalance.ts` — a custom hook that manages available balance, payroll savings, and credit available in `localStorage`, initialized to canonical constants. Exports `balance`, `deductFromBalance(cents, source)`, `addToBalance(cents, source)`, and `refreshBalance()`. Uses a simple event-emitter pattern (`storage` events + custom window events) so all components stay in sync.

2. Update `FinancialOverviewCards.tsx` to use `useAdminBalance()` for available balance and payroll savings display.

3. Add "Pay from Available Balance" card/section in `StripeDepositCard.tsx` — a second section below the existing Stripe Checkout section that allows paying an amount directly from the platform ledger balance (no Stripe redirect). On submit: validate amount ≤ available balance, call `deductFromBalance`, record to `admin_payment_transactions` localStorage, show success message with updated balance.

4. Update `PaymentsPanel.tsx` — on successful payment, call `deductFromBalance(amountCents, 'available')`.

5. Update `TransferPanel.tsx` — on successful transfer, call `deductFromBalance(amountCents, source)` and `addToBalance(amountCents, dest)` where applicable.

6. Rebuild `EmployeePaymentsPanel.tsx` — connect both Manual Payment and Scheduled Payment forms to `deductFromBalance`, add `localStorage` records for both, show recent payments list, add "Run Now" to scheduled payments.

7. Rebuild `AdminMessagingPanel.tsx` — full compose/send/thread UI using `localStorage` for message persistence.

8. Rebuild Settings tab content in `AdminCenterPage.tsx` — new `AdminSettingsPanel` component with app config fields, policy fields, and danger zone.

9. Update `FeeConfigurationPanel.tsx` — enable save, persist to `localStorage`, read back on mount.
