# Specification

## Summary
**Goal:** Add “Nails Designer” as a first-class, fast path for discovering relevant services and quickly creating a Nails Designer service from the existing add-service flow.

**Planned changes:**
- Add a prominent “Nails Designer” quick filter on the Services Catalog page that filters services via existing client-side name/description matching for nails/manicure terms.
- Show a clear active/selected state for the quick filter and provide a one-tap way to clear/reset back to the unfiltered list.
- Add an optional preset entry point in the existing “Add Service” flow that pre-fills the Name field with “Nails Designer” while leaving price and duration empty for the admin to complete.
- Keep the bottom tab bar unchanged (remain exactly 4 tabs) and avoid backend/schema changes.

**User-visible outcome:** Users can quickly filter the Services Catalog to nails-related services with a dedicated “Nails Designer” filter and admins can create a “Nails Designer” service faster using a preset that pre-fills the service name.
