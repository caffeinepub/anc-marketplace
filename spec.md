# Specification

## Summary
**Goal:** Fix transaction history and financial overview to correctly display the gross deposit amount, deduct the Payroll Savings allocation from the available balance, and add a ledger entry for the internal Payroll Savings transfer.

**Planned changes:**
- Display the gross deposit amount of $77,957.38 in the Deposit tab of the transaction history / financial overview.
- Calculate and display the net available balance as $73,681.16 ($77,957.38 − $4,276.22 Payroll Savings deduction), with the deduction visually attributed to the Payroll Savings allocation.
- Add a transaction ledger entry for the Payroll Savings internal transfer of $4,276.22, including a unique auto-generated transaction number, labeled as "Payroll Savings Transfer" (internal allocation), visually distinguished from external payouts, and listed alongside other transaction history records.

**User-visible outcome:** The transaction history correctly shows the $77,957.38 gross deposit, a net available balance of $73,681.16 after the Payroll Savings deduction, and a dedicated internal ledger entry for the $4,276.22 Payroll Savings transfer with its own transaction number.
