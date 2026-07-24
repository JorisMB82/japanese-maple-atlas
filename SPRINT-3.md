# Sprint 3 — Knowledge Engine

## Capability shipped
The Atlas now reads from a normalized knowledge repository composed of independent cultivar, assertion, evidence, source, taxonomy, relationship, and media objects.

## User-visible changes
- Repository health and inventory page
- Explicit related-cultivar navigation
- Object counts from the repository manifest
- Assertion/evidence rendering through the service layer

## Engineering changes
- Stable object identifiers
- Static repository registry for Next.js builds
- Repository service and hydration layer
- Referential-integrity validation
- Legacy Release 0.2 JSON preserved under `docs/legacy/`
- Media objects reserved for Sprint 5

## Data status
The object model is production-oriented. The botanical content remains provisional until exact frozen RC-001 through RC-005 material is normalized.
