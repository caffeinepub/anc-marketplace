# Specification

## Summary
**Goal:** Change the app’s primary theme color from green to navy blue across the UI and PWA/browser theme metadata.

**Planned changes:**
- Update global CSS theme variables in `frontend/src/index.css` (both `:root` and `.dark`) so primary/ring/sidebar and related accents use a navy-blue palette instead of green.
- Update any custom CSS styles that still reference the old green hue (e.g., logo text gradient and company name outline effects) to use navy blue.
- Update PWA/browser theme metadata to navy blue (e.g., `frontend/index.html` meta theme colors and `frontend/public/manifest.json` `theme_color`) to match the new palette.

**User-visible outcome:** The app’s buttons, links, focus rings, sidebar highlights, and browser/PWA theme color display in navy blue in both light and dark mode with readable contrast.
