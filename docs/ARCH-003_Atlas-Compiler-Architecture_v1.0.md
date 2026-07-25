# ARCH-003 — Atlas Compiler Architecture

**Version:** 1.0  
**Status:** Implemented  
**Release:** Sprint 6  
**Source branch:** `main`

## 1. Decision

The frozen Reference Standards are the authoritative editorial inputs for the pilot cohort. Machine-readable repository objects are generated artifacts and must not be edited independently.

The production flow is:

> Frozen Reference Standard → deterministic compiler → normalized repository objects → indexes and manifest → application service layer → public interface

## 2. Compiler boundary

The compiler reads only `atlas-repository/reference-standards/RC-001.md` through `RC-005.md` for canonical cultivar content. It uses a governed field-mapping layer to normalize metadata and the first At-a-glance table while preserving source wording, qualifications, source scope, freeze metadata, and file hashes.

The compiler is not permitted to:

- promote unresolved or rejected claims into approved assertions;
- infer clonal authentication from appearance;
- replace source-specific measurements with universal biological limits;
- collapse species, horticultural group, cultivar, specimen, scion, or rootstock identity;
- or silently accept a changed frozen input.

## 3. Object model

Sprint 6 compiles exactly 166 first-class repository objects:

- 5 cultivars;
- 110 assertions, 22 per cultivar;
- 35 evidence objects, 7 per cultivar;
- 5 frozen Reference Standard sources;
- 2 accepted taxa;
- 4 governed cultivar relationships;
- 5 media objects.

Indexes, schemas, the compiler registry, manifest, and hash register are generated support artifacts and are not counted as first-class objects.

## 4. Determinism

Given identical input bytes and compiler version, the compiler produces identical UTF-8 outputs, IDs, ordering, JSON formatting, object hashes, input hash, and repository hash.

No runtime timestamp enters generated content. The release date is controlled in the compiler version.

## 5. Integrity layers

1. **Input integrity:** each RC file has a SHA-256 hash recorded in its source object and `hashes.json`.
2. **Object integrity:** every first-class JSON object is hashed in the object index.
3. **Repository integrity:** the sorted object-path/hash set produces one repository hash.
4. **Generated drift:** `npm run compile:atlas:check` regenerates in memory and compares every generated file byte-for-byte.
5. **Graph integrity:** validation checks IDs, counts, references, source hashes, generated hashes, canonical status, and compiler invariants.

## 6. Application contract

`lib/repository-registry.js` is generated with explicit static imports so the existing Next.js architecture can consume the compiled repository during static export. The public interface continues to read through `lib/repository.js`; it does not parse Markdown at runtime.

## 7. Change rule

A frozen RC change requires a governed source revision. After approval:

1. update the RC Markdown;
2. run `npm run compile:atlas`;
3. review generated changes and hashes;
4. run `npm test`;
5. run `npm run build`;
6. merge the complete source-and-generated change as one review unit.
