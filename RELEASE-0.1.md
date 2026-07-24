# Release 0.1 — MVP Foundation

This release establishes the first working Japanese Maple Atlas application.

## Included capabilities

- Next.js application foundation
- Static-export configuration for Vercel
- Responsive cultivar browser
- Search and filters
- RC-001 through RC-005 pilot dataset
- Cultivar profile routes
- Two-cultivar comparison engine
- Assertion, evidence, and source drill-down
- JSON Schema and validation script
- Repository normalization protocol

## Data status

The application and repository interfaces are functional. The pilot content is explicitly provisional until the complete frozen RC-001 through RC-005 records are imported and normalized.

## Acceptance criteria

- `npm run validate:data` completes without an error.
- `npm run dev` opens the Atlas locally.
- `/cultivars/bloodgood` and the other pilot profile routes render.
- `/compare` compares two records.
- `npm run build` produces a static export suitable for Vercel.
