# Specification

## Summary
**Goal:** Ensure the entire site renders with a light/white background on all pages, regardless of the user’s OS/system dark mode setting.

**Planned changes:**
- Update the global styling/theme configuration so the default background is white and does not automatically switch to dark based on system theme.
- Ensure layout-level containers (e.g., app layout and header areas using the global background token) use the light/white background across all routes.

**User-visible outcome:** When visiting any page (including /, /customer-faq, /privacy-policy), the site background appears white/light and does not turn black/dark even if the device is set to dark mode.
