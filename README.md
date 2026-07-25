# Japanese Maple Atlas

An evidence-aware botanical knowledge platform for discovering, comparing and governing Japanese maple cultivar knowledge.

## Sprint 7 / v0.7.0

The Atlas now provides a repository-native editorial workflow and contributor pipeline:

- five frozen Reference Standards remain the canonical botanical source;
- the deterministic Atlas Compiler produces 203 first-class repository objects;
- contributors, submissions, twelve-stage workflows and five-pass reviews are governed objects;
- contributor inputs are source controlled and SHA-256 protected;
- GitHub issue forms and pull-request templates structure external contributions;
- draft and incomplete work cannot silently modify canonical publication content;
- the application exposes editorial and contribution interfaces;
- repository validation checks contributor identity, workflow completeness, review links, hashes and generated drift.

## Repository principle

The repository is the source of truth. The application is a derived interface. Contributions enter through governed inputs and only approved, validated repository knowledge may reach publication outputs.

## Run locally

```bash
npm install
npm run validate:contributions
npm run compile:atlas:check
npm run validate:repository
npm run dev
```

Open `http://localhost:3000`.

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
- `scripts/compile-atlas.mjs` — deterministic compiler
- `scripts/validate-contributions.mjs` — contributor-input validation
- `scripts/validate-repository.mjs` — repository integrity validation
- `app/` — public, editorial and contribution routes
- `components/` — reusable interface components
- `docs/` — architecture, editorial, contributor and implementation records
