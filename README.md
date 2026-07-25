# Japanese Maple Atlas

An evidence-aware botanical knowledge platform for discovering, comparing and governing Japanese maple cultivar knowledge.

## Sprint 8 / application v0.8.0

The Atlas now provides advanced, explainable semantic discovery over the governed repository:

- ordinary horticultural terms map to controlled search concepts;
- exact, quoted, fielded, excluded and OR queries are supported;
- relevance scoring prioritises cultivar identity and diagnostic fields;
- every result can explain why it matched;
- semantic filters cover habit, leaf form, colour, exposure, scale and cultivation risk;
- contextual facet counts prevent dead-end filter combinations;
- discovery state is bookmarkable through the URL;
- no-result suggestions are limited to governed vocabulary;
- search behaviour is covered by dedicated validation and permanent CI.

The five frozen Reference Standards and the 203 first-class Sprint 7 repository objects remain unchanged. Search interpretation improves retrieval but does not create new botanical assertions.

## Repository principle

The repository is the source of truth. The application is a derived interface. Contributions enter through governed inputs and only approved, validated repository knowledge may reach publication outputs.

## Run locally

```bash
npm install
npm run validate:contributions
npm run compile:atlas:check
npm run validate:repository
npm run validate:search
npm run dev
```

Open `http://localhost:3000`.

## Search examples

```text
laceleaf upright
weeping red
yellow "partial shade"
leaf:laceleaf -habit:cascading
bark:"coral bark"
species:"Acer shirasawanum"
```

## Create a contribution

```bash
npm run contribution:new -- \
  --target RC-001 \
  --type evidence-addition \
  --title "Add verified observation" \
  --contributor CTR-CONTRIBUTOR-ID
```

Then complete the generated file under `editorial-inbox/submissions/` and run:

```bash
npm run compile:atlas
npm test
```

Do not edit generated JSON under `atlas-repository/` or `lib/repository-registry.js` directly.

## Production build

```bash
npm run build
```

The static export is written to `out/`.

## Repository structure

- `atlas-repository/reference-standards/` — frozen canonical compiler inputs
- `editorial-inbox/` — governed contributor and submission inputs
- `atlas-repository/` — generated knowledge, editorial objects, indexes, hashes and schemas
- `lib/search-vocabulary.mjs` — governed semantic concepts and aliases
- `lib/search-engine.mjs` — query parsing, relevance, explainability and facets
- `scripts/validate-search.mjs` — semantic-search validation
- `scripts/compile-atlas.mjs` — deterministic compiler
- `scripts/validate-contributions.mjs` — contributor-input validation
- `scripts/validate-repository.mjs` — repository integrity validation
- `app/` — public, editorial and contribution routes
- `components/` — reusable interface components
- `docs/` — architecture, editorial, search, contributor and implementation records
