# Specification

## Summary
**Goal:** Enable Internet Identity users to complete registration by creating and managing a basic user profile, and gate authenticated areas until profile setup is complete.

**Planned changes:**
- Backend: Allow an authenticated Internet Identity principal with no prior roles to create/save (and later update) their own UserProfile, then fetch it via getCallerUserProfile.
- Backend: Automatically grant the standard signed-in user role after successful profile creation using the existing access-control role system.
- Backend: Make getCallerUserProfile return null/none (instead of trapping Unauthorized) when the caller is authenticated but has not completed profile setup.
- Frontend: Add a routable Profile Setup page/route that renders the existing ProfileSetup component.
- Frontend: Enforce a registration gate that redirects authenticated users without a saved profile to Profile Setup before accessing authenticated areas (e.g., Settings, Messages, Purchase History, Wishlist).
- Frontend: Update the authenticated header/user menu to show a clear “finish profile setup” navigation option when authenticated but profile is missing, while keeping existing login/logout behavior intact.

**User-visible outcome:** Users can sign in with Internet Identity, complete a Profile Setup flow to create their account profile, and then access authenticated pages; users who haven’t completed profile setup are redirected to Profile Setup and see a clear prompt/link in the header to finish registration.
