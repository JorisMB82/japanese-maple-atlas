# Japanese Maple Atlas MVP

A functional, evidence-aware pilot interface for RC-001 through RC-005.

## What already works

- Search across cultivar names, summaries, and diagnostic traits
- Filter by species, habit, and leaf form
- Static cultivar profile pages
- Structured seasonal, morphological, and cultivation presentation
- Two-cultivar comparison engine
- Assertion → evidence → source drill-down
- JSON Schema validation
- Static export suitable for Vercel
- Responsive desktop and mobile layout

## Critical data-status note

The application architecture is functional. The included cultivar content is **provisional pilot seed data**, not a replacement for the frozen RC-001–RC-005 Reference Standards. The UI makes this explicit. The next implementation pass is a controlled normalization/import of the canonical RC records.

## Run locally

```bash
npm install
npm run validate:data
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
```

The static site is generated in `out/` and can be deployed to Vercel.

## Repository structure

- `app/` — Next.js pages
- `components/` — search and comparison UI
- `data/` — operational JSON repository
- `schemas/` — JSON schemas
- `scripts/` — validation tools
- `docs/` — product and normalization documents

## Immediate next pass

1. Add the governance and canonical RC Markdown files under `docs/` and `references/`.
2. Normalize each RC into the existing JSON object model.
3. Replace every provisional assertion and evidence record.
4. Add source citations and unresolved/rejected registers.
5. Deploy the pilot and run user tests.
