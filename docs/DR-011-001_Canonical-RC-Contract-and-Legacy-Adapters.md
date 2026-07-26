# DR-011-001 — Canonical RC Contract and Legacy Adapters

**Status:** Approved
**Decision date:** 2026-07-26
**Applies from:** Atlas Compiler 2.0.0

## Context

RC-001 through RC-005 were frozen before a single machine-readable Reference Standard profile existed. The pilot compiler therefore contained record-specific parsing branches. Adding RC-006 would have required additional JavaScript and would have made the compiler progressively less governable.

## Decision

1. RC-006 onward must conform to `canonical-rc-v1`.
2. RC-001 through RC-005 remain frozen and are interpreted through external legacy adapters in the approved compatibility registry.
3. New exceptions must be data-governed, documented and linked to a Decision Record; cultivar-specific compiler branches are prohibited.
4. Underlying evidence sources are represented through per-record provenance sidecars and mapped to evidence domains.
5. Visual assets are represented through per-record media sidecars.
6. Publication is transactional: all inputs and generated outputs must pass before canonical output replacement.

## Alternatives rejected

- Rewriting RC-001 through RC-005 to match the new template: rejected because it would modify frozen sources for an engineering convenience.
- Continuing record-specific compiler branches: rejected because it does not scale and obscures governance.
- Allowing arbitrary Markdown without a contract: rejected because failures would appear late and inconsistently.

## Consequences

- The compiler is generic for conforming RCs.
- Legacy handling remains explicit and reviewable.
- RC production requires structured source and media sidecars.
- The contract and registries become governed compiler inputs whose hashes are recorded.
