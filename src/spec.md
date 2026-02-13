# Specification

## Summary
**Goal:** Improve header navigation menu background color and readability across desktop and mobile.

**Planned changes:**
- Update desktop header dropdown menus (Customer, Sellers & Businesses, Legal, authenticated user menu) to use a white or very light blue background with readable text and strong-contrast hover/focus states.
- Update the mobile slide-over menu (SheetContent) to use a white or very light blue background with clearly readable links/sections and preserved spacing/alignment/tap targets.
- Apply styling via app-level component composition/props/classes (e.g., in `frontend/src/components/Layout.tsx`) without editing read-only UI component source files under `frontend/src/components/ui`.

**User-visible outcome:** Navigation menus on desktop and mobile display on a white or very light blue background with clearly readable menu items and accessible hover/focus states, without layout regressions.
