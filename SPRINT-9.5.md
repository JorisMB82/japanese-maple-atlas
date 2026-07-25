# Sprint 9.5 — Testing and Quality Infrastructure

## Status

Implementation complete and ready for review.

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

- Contributor input validation: PASS.
- Deterministic compiler drift check: PASS.
- JSON Schema conformance validation: PASS across fourteen governed object and index classes.
- Repository integrity validation: PASS — 235 first-class objects.
- Semantic-search validation: PASS.
- Knowledge-graph validation: PASS — 7 nodes, 26 edges and 10 relationship types.
- Native Node unit coverage suite: PASS — 27 of 27 tests.
- Aggregate covered-code results: 99.51% lines, 86.50% branches and 98.06% functions.
- Integration test suite: PASS, including isolated fresh compilation and repeated-build determinism.
- Production Next.js static build: PASS.
- Static-export regression suite: PASS — 4 of 4 route, content, link and asset checks.
- Quality-infrastructure self-validation: PASS.
- Release evidence generation: PASS — 58 static export files and 65 checksummed release files.
- Vercel preview deployment: READY.
- `package.json` and `package-lock.json`: synchronised at 0.9.5.

## CI artifacts

The quality workflow retains three downloadable ZIP artifacts:

1. `sprint-9-5-coverage` — the complete native Node test and coverage report;
2. `sprint-9-5-quality-evidence` — regression results, release manifest, release summary and SHA-256 checksum inventory;
3. `sprint-9-5-static-export` — the complete production-ready static website generated under `out/`.

These ZIP files are validation and release evidence. They do not replace the Git repository or the Vercel deployment.

## Review and merge

Review pull request #5 and use **Squash and merge** with:

`Sprint 9.5: establish testing and quality infrastructure`

After merge, begin Sprint 10 — Interactive Atlas Explorer — from `main`.
