# Specification

## Summary
**Goal:** Fix the Admin Center backend initialization hang that prevents the dashboard from loading despite successful authentication.

**Planned changes:**
- Diagnose and fix the backend access control initialization logic that causes the Admin Center to hang indefinitely on "Connecting to backend..."
- Ensure the authenticated principal (whlz5-24wky-cak5n-dcfue-ja2x5-...) is properly registered in the backend access control system
- Update the frontend to properly handle completion of backend initialization and transition from loading state to the full dashboard interface
- Add error handling for initialization failures

**User-visible outcome:** The Admin Center will successfully load past the "Connecting to backend..." spinner and display the full dashboard interface, allowing users to access all admin functionality after authentication.
