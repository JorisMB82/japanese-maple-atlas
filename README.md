# Japanese Maple Atlas

An evidence-aware botanical knowledge platform for discovering, comparing, and inspecting Japanese maple cultivars.

## Release 0.2

The pilot now provides a coherent product experience:

- searchable and filterable cultivar directory;
- structured cultivar profiles;
- seasonal-expression timelines;
- diagnostic-trait summaries;
- side-by-side comparison with differences-only mode;
- assertion → evidence → source traceability;
- source register;
- responsive desktop and mobile interface;
- static-export deployment for Vercel.

## Data status

The software is functional. RC-001 through RC-005 still use explicitly marked provisional pilot data pending controlled import of the frozen Reference Standards. No pilot statement should be treated as canonical botanical content.

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

The static export is written to `out/`.

## Repository structure

- `app/` — routes and page composition
- `components/` — reusable product interface components
- `data/` — operational JSON repository
- `lib/` — repository query helpers
- `schemas/` — machine-readable validation rules
- `scripts/` — repository validation
- `docs/` — implementation and normalization records

## Product principle

The repository is the source of truth. The application is a derived interface that makes structured botanical knowledge searchable, comparable, and inspectable.
