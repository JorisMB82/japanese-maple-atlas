# SPEC-001 — Reference Standard Compiler Specification

**Version:** 1.0  
**Status:** Implemented

## Inputs

Exactly five UTF-8 Markdown files named `RC-001.md` through `RC-005.md` in `atlas-repository/reference-standards/`.

Each input must provide:

- an embedded RC identifier matching its filename;
- a frozen or approved status;
- a Reference Standard version;
- a freeze date;
- an accepted cultivar name;
- and an At-a-glance table whose first column is `Attribute`.

## Normalization contract

The compiler normalizes:

- accepted scientific and cultivar names;
- taxon linkage;
- habit and architecture;
- leaf morphology;
- spring, summer, and autumn expression;
- dimensions and qualitative growth;
- flowers and fruit;
- exposure, soil, and hardiness;
- propagation and cultivar continuity;
- history and provenance;
- diagnostic limits;
- and confidence.

Field aliases are explicit per RC because the frozen documents legitimately use different editorial labels. Botanical values are read from the inputs, not duplicated in an application data file.

## Assertion contract

Each cultivar receives 22 deterministic assertions covering identity, morphology, seasonal expression, dimensions, reproduction, cultivation, continuity, history, diagnosis, and confidence.

Assertions use only these states:

- `approved`;
- `approved-qualified`.

History, dimensions, diagnosis, and confidence assertions retain qualification by default.

## Evidence contract

Each cultivar receives seven grouped evidence objects. Every assertion links to exactly one evidence object; every evidence object links back to its supported assertions and frozen source. Evidence records carry the input SHA-256.

## Identifier contract

- cultivars: `RC-NNN`;
- assertions: `AST-NNNNNN`;
- evidence: `EVD-NNNNNN`;
- sources: `SRC-NNNNNN`;
- taxa: `TAX-*`;
- relationships: `REL-NNNNNN`;
- media: `MED-RC-NNN-IDENTITY-NNN`.

Identifiers are stable for this compiler major version while the ordered five-record cohort and assertion contract remain unchanged.

## Generated files

The compiler owns:

- `atlas-repository/cultivars/*.json`;
- `atlas-repository/assertions/*.json`;
- `atlas-repository/evidence/*.json`;
- `atlas-repository/sources/*.json`;
- `atlas-repository/taxonomy/*.json`;
- `atlas-repository/relationships/*.json`;
- `atlas-repository/media/*.json`;
- `atlas-repository/indexes/*.json`;
- `atlas-repository/manifest.json`;
- `atlas-repository/hashes.json`;
- `lib/repository-registry.js`.

Generated files carry no hand-maintained content.

## Failure conditions

Compilation or validation fails for missing inputs, identifier mismatch, absent At-a-glance table, unparseable accepted name, object-count drift, duplicate IDs, missing links, source-hash mismatch, generated drift, provisional canonical data, or disagreement among manifest, index, and hash registry.
