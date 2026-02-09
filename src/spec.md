# Specification

## Summary
**Goal:** Make the Admin Dashboard fully functional end-to-end by wiring it to real Motoko backend methods, adding an owner/admin bootstrap flow, enabling real role management, ensuring deep-linked tabs work, and applying a consistent non-blue/purple visual theme.

**Planned changes:**
- Add a one-time owner/admin initialization flow in the UI that calls backend admin bootstrap methods to initialize access control and set the owner principal, then gate all admin actions with backend admin permission checks.
- Replace placeholder/throwing Admin Dashboard and role-management React Query hooks with real implementations backed by Motoko actor methods so the Users tab can list users, show role summaries, and assign/update roles with proper refetch/invalidation.
- Ensure non-admin callers are rejected by backend admin APIs with explicit unauthorized errors, and show a clear access-denied state in the frontend (no crashes).
- Sync Admin Quick Access links and Admin Dashboard tab state via router search params (e.g., `/admin?tab=users`) to support deep linking and correct initial tab activation.
- Confirm the Roadmap admin tab is fully wired: load roadmap data from backend-provided AdminDashboardData and (if present) trigger `updateMarketplaceRoadmap` to refresh displayed roadmap entries.
- Apply a coherent, distinctive Admin Dashboard visual theme (colors/typography/spacing/component styling) that avoids a predominantly blue/purple palette and keeps all user-facing text in English.

**User-visible outcome:** An authenticated first-time admin can initialize ownership from the UI, admins can open `/admin` (including deep-linked tabs), view/update users and roles, and view/refresh roadmap data; non-admins see a clear permission-denied experience.
