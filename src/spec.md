# Specification

## Summary
**Goal:** Fix and align admin login credentials to username `joana` and password `joana123` (no space) and reliably unblock access to the Admin panel after successful login.

**Planned changes:**
- Update frontend admin credential validation (including `useAdminPasswordGate`) to accept only `joana/joana123` and reject the legacy spaced password `joana 123`.
- Update backend credential verification (`verifyAdminLogin`) to accept only `joana/joana123` and reject `joana 123`.
- Ensure successful login refreshes/updates admin permission checks so `AdminAccessGate` immediately allows admin routes (Inventory, Expenses) for the same session/identity; show an error if verification succeeds but backend admin status still fails after refetch.
- Validate and adjust the owner/admin navigation flow: Profile “PAINEL DO DONO” routes to Admin Login when not authenticated, and routes directly to Inventory when authenticated; blocked admin routes provide a working path to Admin Login and a re-login action when permissions are missing.

**User-visible outcome:** Logging in with `joana/joana123` grants immediate access to admin pages (Inventory/Expenses) via “PAINEL DO DONO”, while `joana/joana 123` is rejected and blocked admin pages guide the user to re-authenticate.
