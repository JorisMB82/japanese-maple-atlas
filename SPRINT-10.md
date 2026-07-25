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

- Contributor input validation: PASS.
- Deterministic compiler drift check: PASS.
- JSON Schema conformance validation: PASS.
- Repository integrity validation: PASS — 235 first-class objects.
- Semantic-search validation: PASS.
- Knowledge-graph validation: PASS — 7 nodes, 26 edges and 10 relationship types.
- Interactive-explorer validation: PASS — 5 projected cultivars and 5 guided investigations.
- Unit tests: PASS — 34 of 34 tests in the native coverage suite.
- Integration tests: PASS.
- Native Node aggregate coverage: PASS — 98.53% lines, 82.74% branches and 97.81% functions.
- Production Next.js static build: PASS.
- Static-export regression suite: PASS, including `/explorer`, internal links and Next.js assets.
- Quality-infrastructure validation: PASS.
- Release manifest and Sprint 10 CI artifacts: PASS.
- `package.json` and `package-lock.json`: synchronised at 0.10.0.
- Vercel preview: provider build-rate limit encountered; the independent production build and static export completed successfully.
- Temporary Sprint 10 synchronisation and patch workflows: removed.

## CI artifacts

The final quality workflow retains:

1. `sprint-10-coverage` — native Node test and coverage evidence;
2. `sprint-10-quality-evidence` — regression output, release manifest, summary and checksums;
3. `sprint-10-static-export` — the complete production-ready static website.

## Review and merge

Use **Squash and merge** with:

`Sprint 10: implement interactive Atlas explorer`

After Sprint 10 is merged, halt feature development and conduct the planned user-testing exercise before beginning Sprint 11 — Media Pipeline and IIIF Readiness.
