# Sprint 8 — Advanced Search and Semantic Filtering

## Status

Implementation complete and ready for review.

## Capability shipped

- governed semantic vocabulary for habit, leaf form, seasonal colour, exposure, size and cultivation risk;
- weighted and explainable relevance scoring;
- AND, OR, quoted phrase, field and exclusion query support;
- contextual semantic facets and result counts;
- URL-persisted discovery state;
- controlled spelling and no-result recovery suggestions;
- responsive semantic-search interface;
- dedicated semantic-search validation and permanent CI integration;
- updated application and implementation documentation.

## Architectural boundary

Sprint 8 improves discovery over the existing canonical repository. It does not change the five frozen Reference Standards or the 203 first-class repository objects produced by the Atlas Compiler in Sprint 7. Search interpretation improves retrieval but does not create botanical assertions.

## Final verification

- Contributor input validation: PASS.
- Atlas Compiler deterministic drift check: PASS.
- Repository integrity validation: PASS.
- Semantic search validation: PASS.
- Production Next.js build: PASS.
- Vercel preview deployment: READY.
- `package.json` and `package-lock.json`: synchronised at application version 0.8.0.
- Temporary lockfile workflow: removed.

## Review and merge

Review pull request #3 and use **Squash and merge**. Suggested squash title:

`Sprint 8: implement advanced search and semantic filtering`

Sprint 9 should begin only after this review branch is merged into `main`.
