# Specification

## Summary
**Goal:** Configure payment webhook calls to a Zapier endpoint, display the webhook URL in the admin payments panel, and fix the Admin Center access control so the authenticated admin can access it.

**Planned changes:**
- In `main.mo`, add a configurable constant for the Zapier webhook URL (`https://hooks.zapier.com/hooks/catch/26632326/u0i6cx6/`) and trigger an HTTP POST with payment details (amount, type, user, timestamp) on every payment event (order payment, deposit, Stripe checkout completion, payout, fee collection); failed webhook calls must not block the primary transaction
- In the admin payments panel (`PaymentsPanel.tsx` and related components), add a read-only field labeled "Payment Webhook Endpoint" displaying the active Zapier webhook URL
- Fix the Admin Center access control initialization so the authenticated owner/admin principal is correctly recognized on page load, eliminating the "Admin Access Required" lock screen for admin users while still showing it for non-admins

**User-visible outcome:** Payment events automatically notify the configured Zapier webhook; admins can see the active webhook URL in the Payments tab; and the authenticated admin user can successfully enter the Admin Center without hitting the lock screen.
