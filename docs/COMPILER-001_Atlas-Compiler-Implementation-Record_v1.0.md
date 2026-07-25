# COMPILER-001 — Atlas Compiler Implementation Record

**Version:** 1.0  
**Status:** Implemented and validated  
**Sprint:** 6

## Implementation

The compiler is implemented in `scripts/compile-atlas.mjs` using the existing JavaScript/Node.js architecture and no runtime dependency beyond Node core modules.

Commands:

```bash
npm run compile:atlas
npm run compile:atlas:check
npm run validate:repository
npm test
npm run build
```

## Generated baseline

| Control | Result |
|---|---:|
| Frozen inputs | 5 |
| Cultivars | 5 |
| Assertions | 110 |
| Evidence objects | 35 |
| Sources | 5 |
| Taxa | 2 |
| Relationships | 4 |
| Media | 5 |
| Total first-class objects | 166 |
| Validation errors | 0 |

## Repository hashes

The authoritative values are generated into:

- `atlas-repository/hashes.json`;
- `atlas-repository/manifest.json`;
- `atlas-repository/indexes/object-index.json`.

Reviewers should compare all three rather than copying a hash into prose that could later become stale.

## Compatibility

The generated cultivars retain the fields consumed by the existing discovery, comparison, profile, media, and evidence components. The generated JavaScript registry preserves static imports required by Next.js static export.

## Superseded pilot layer

Sprint 6 replaces the provisional pilot cultivar, assertion, evidence, and source data with compiled canonical content. The Sprint 5 identity illustrations remain first-class media objects and remain explicitly non-evidentiary.

## Validation result

Compiler determinism, source hashes, generated hashes, object counts, schemas, links, canonical statuses, registry imports, and repository hash all pass with zero errors.
