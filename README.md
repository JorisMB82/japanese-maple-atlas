# Japanese Maple Atlas

An evidence-aware botanical knowledge platform for discovering, comparing, and inspecting Japanese maple cultivars.

## Sprint 6 / v0.6.0

The Atlas Compiler now makes the frozen Reference Standards the operational source of truth.

- RC-001 through RC-005 are preserved as frozen Markdown inputs;
- canonical cultivar records are compiled, not manually duplicated;
- 110 assertions link to 35 evidence objects and five frozen sources;
- generated files are protected by SHA-256 hashes and drift checks;
- the manifest reports 166 first-class repository objects;
- the existing discovery, comparison, profile, evidence, relationship, and media interfaces consume the generated repository.

## Data status

RC-001 through RC-005 are canonical compiled records derived from frozen Reference Standard v1.0 documents. Identity plates remain editorial illustrations and are not diagnostic evidence.

## Run locally

```bash
npm install
npm run compile:atlas:check
npm run validate:repository
npm run dev
```

Open `http://localhost:3000`.

## Compile after an approved RC revision

```bash
npm run compile:atlas
npm test
```

Do not edit generated repository JSON or `lib/repository-registry.js` directly.

## Production build

```bash
npm run build
```

The static export is written to `out/`.

## Repository structure

- `atlas-repository/reference-standards/` — frozen compiler inputs
- `atlas-repository/` — generated normalized knowledge objects, indexes, manifest, hashes, and schemas
- `scripts/compile-atlas.mjs` — deterministic compiler
- `scripts/validate-repository.mjs` — integrity and canonicality validation
- `app/` — routes and page composition
- `components/` — reusable product interface components
- `lib/` — generated registry and repository query helpers
- `docs/` — architecture, compiler, implementation, media, and normalization records

## Product principle

The repository is the source of truth. The application is a derived interface that makes governed botanical knowledge searchable, comparable, and inspectable.
