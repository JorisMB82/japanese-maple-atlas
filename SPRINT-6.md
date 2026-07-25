# Sprint 6 — Atlas Compiler

## Status

Ready for review.

## Capability shipped

Sprint 6 turns the five frozen Reference Standards into the operational source of canonical repository content.

The release includes:

- deterministic JavaScript Atlas Compiler;
- RC-001 through RC-005 stored as immutable compiler inputs;
- 166 normalized first-class repository objects;
- 110 approved or approved-qualified assertions;
- 35 traceable evidence objects;
- one source object and source hash per frozen RC;
- generated object and search indexes;
- generated static JavaScript registry;
- repository manifest and SHA-256 hash registry;
- compiler drift detection;
- expanded repository validation;
- compiler architecture, specification, and implementation documentation;
- removal of provisional botanical content from the canonical repository layer.

## Review gate

Before merge:

1. inspect the five frozen RC input hashes;
2. spot-check each generated cultivar against its At-a-glance table;
3. inspect qualified history and diagnostic assertions;
4. confirm the 166-object manifest;
5. run `npm test`;
6. run `npm run build` in an environment with installed dependencies.

## Stop condition

Sprint 6 ends with the compiler and initial five-record canonical repository ready for review. Expansion to RC-006 is outside this sprint.
