# Sprint 9.5 — Testing and Quality Infrastructure

## Status

Implementation in progress. This record will be frozen after the final CI, production-build and release-readiness checks pass.

## Capability implemented

- governed quality thresholds and repository regression invariants;
- native Node unit tests for semantic search, knowledge graph and schema validation;
- integration tests for repository closure, hashes, compiler determinism and schema failure paths;
- production static-export route, link, content and asset regression tests;
- repository-wide JSON Schema conformance validation;
- native Node line, function and branch coverage enforcement;
- hardened multi-job GitHub Actions quality gates;
- release manifest, SHA-256 checksum and static bundle generation;
- manual and version-tag release automation;
- quality architecture and operational documentation.

## Version boundary

- Application and quality infrastructure version: 0.9.5
- Repository data version: 0.9.0
- Atlas Compiler: 1.2.0
- First-class repository objects: 235

Sprint 9.5 does not alter the five frozen Reference Standards or the Sprint 9 repository graph. It adds the permanent quality system governing future changes.

## Final verification

Pending final branch execution:

- repository and contributor validation;
- deterministic compiler drift check;
- fourteen-schema conformance validation;
- semantic-search validation;
- knowledge-graph validation;
- unit and integration tests;
- native coverage thresholds;
- production Next.js build;
- static-export regression suite;
- quality-infrastructure validation;
- release-manifest generation;
- Vercel preview deployment.

## Review and merge

When all checks pass, review the Sprint 9.5 pull request and use **Squash and merge** with:

`Sprint 9.5: establish testing and quality infrastructure`

After merge, begin Sprint 10 — Interactive Atlas Explorer — from `main`.
