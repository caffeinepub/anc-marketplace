# Specification

## Summary
**Goal:** Revert to Version 63 and remove Admin Center authentication guards to restore access while preserving all user data and role infrastructure.

**Planned changes:**
- Revert application deployment to Version 63 (last stable working version)
- Remove Internet Identity authentication checks blocking Admin Center frontend access
- Remove backend authentication requirements for Admin Center data and operations
- Preserve all role-based permissions infrastructure and data models for future re-enablement
- Ensure all user data, financial records, transactions, deposits, connections, and balances remain intact

**User-visible outcome:** Admin Center becomes accessible without authentication barriers, displaying all tabs and panels with "Connecting to backend..." status as in Version 63. All existing user data and financial information remains preserved and accessible.
