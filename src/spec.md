# Specification

## Summary
**Goal:** Fix the Admin Center backend connection issue that prevents the dashboard from loading after Internet Identity authentication was added.

**Planned changes:**
- Diagnose and fix the backend actor initialization blocking issue in the Admin Center page
- Ensure authenticated admin users can successfully establish backend connection after Internet Identity login
- Restore display of account totals showing aggregate deposited amounts across all user accounts
- Restore display of deposit methods breakdown showing payment method analysis
- Restore display of complete transaction history records with all transaction details
- Restore all dashboard menu options and navigation controls that were functional before authentication

**User-visible outcome:** After logging in with Internet Identity, admin users will see the Admin Center dashboard load successfully with account totals, deposit method breakdowns, transaction history, and all menu options visible without getting stuck on "Initializing..." or "Connecting to backend..." messages.
