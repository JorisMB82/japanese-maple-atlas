# Sprint 10 — Interactive Atlas Explorer

## Status

Implementation complete and ready for review.

## Capability implemented

- dedicated `/explorer` research workspace;
- semantic search and contextual repository facets;
- shareable URL state across query, filters, sort, view, lens, focus and selection;
- four coordinated views: gallery, trait matrix, seasonal expression and relationships;
- six analysis lenses: overview, identity, morphology, seasonal, cultivation and evidence;
- focused record inspector with direct profile and graph access;
- five guided investigation presets;
- browser-local saved views;
- governed research sets containing up to five cultivars;
- direct comparison handoff for the first two selected cultivars;
- portable JSON export with repository version, hash and canonicality;
- deterministic explorer-state and projection services;
- dedicated explorer validation and unit coverage;
- production static-export regression coverage;
- updated navigation, home page, about page, quality gates and documentation.

## Version boundary

- Application version: 0.10.0
- Repository data version: 0.9.0
- Atlas Compiler: 1.2.0
- First-class repository objects: 235

Sprint 10 does not alter the five frozen Reference Standards, compiled assertions, evidence records, source records, graph relationships or repository hashes. It adds a derived interactive workspace over those governed objects.

## Explorer contract

- Workspace state is validated against the current cultivar inventory.
- URL state is deterministic and shareable.
- Saved views remain local to the browser.
- Research sets are capped at five cultivar records.
- JSON exports identify repository provenance and remain derivative research aids.
- Relationship views preserve edge rationale, confidence and evidence context.
- Seasonal expression remains separated into spring, summer, autumn and winter interest.

## Final verification

- Contributor input validation: pending final CI confirmation.
- Deterministic compiler drift check: pending final CI confirmation.
- JSON Schema conformance validation: pending final CI confirmation.
- Repository integrity validation: pending final CI confirmation.
- Semantic-search validation: pending final CI confirmation.
- Knowledge-graph validation: pending final CI confirmation.
- Interactive-explorer validation: pending final CI confirmation.
- Unit and integration tests: pending final CI confirmation.
- Native Node coverage thresholds: pending final CI confirmation.
- Production Next.js static build: pending final CI confirmation.
- Static-export regression suite: pending final CI confirmation.
- Quality-infrastructure validation: pending final CI confirmation.
- Vercel preview deployment: pending final status check.
- `package.json` and `package-lock.json`: pending final synchronisation at 0.10.0.

## Review and merge

Use **Squash and merge** with:

`Sprint 10: implement interactive Atlas explorer`

After Sprint 10 is merged, halt feature development and conduct the planned user-testing exercise before beginning Sprint 11 — Media Pipeline and IIIF Readiness.
