# Specification

## Summary
**Goal:** Allow the admin login to accept the password `joana 123` (with a single internal space) end-to-end, without collapsing internal whitespace during credential checks.

**Planned changes:**
- Update `frontend/src/hooks/useAdminPasswordGate.ts` so `verifyLogin` trims only leading/trailing whitespace and preserves internal spaces when calling `actor.verifyAdminLogin`.
- Ensure the frontend login flow treats `('joana', 'joana 123')` as valid and `('joana', 'joana123')` as invalid (space remains significant).
- Update `backend/main.mo` to set the default stored `adminPassword` to the exact string `joana 123` and ensure `verifyAdminLogin` compares via direct equality without stripping/collapsing whitespace.

**User-visible outcome:** Admins can successfully log in using username `joana` and password `joana 123` (including the internal space), including when accidental leading/trailing spaces are present.
