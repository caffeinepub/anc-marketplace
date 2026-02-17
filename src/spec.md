# Specification

## Summary
**Goal:** Add a protected Seller Onboarding Wizard with step-by-step navigation and persisted progress so sellers can start onboarding now and resume later, using placeholder steps for upcoming features.

**Planned changes:**
- Add a new seller onboarding route/page (e.g., `/seller/onboarding`) that renders a multi-step wizard UI (step list + progress indicator/stepper + Next/Back + safe exit).
- Define initial onboarding steps in order: (1) Introduction/Overview, (2) Business + Identity Verification (placeholder), (3) Store Profile (placeholder), plus optional clearly-labeled placeholder steps for future expansion.
- Gate access to the onboarding route: show a login-required screen for unauthenticated users; redirect authenticated users without a completed basic profile to `/profile-setup` with a redirect back to onboarding.
- Add backend support to persist and fetch the caller’s onboarding progress (at minimum `currentStep` and `updatedAt`).
- Add a React Query hook to load onboarding state on entry and save progress on step navigation/completion, restoring the last step after refresh/return.

**User-visible outcome:** Logged-in users with a completed basic profile can enter a new seller onboarding wizard, move between placeholder steps with clear progress, leave safely, and return later to resume where they left off.
