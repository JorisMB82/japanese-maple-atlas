# Contributing to the Japanese Maple Atlas

The Atlas is a governed botanical repository. Contributions are welcome when they improve evidence, correct errors, preserve uncertainty, or add rights-cleared material without bypassing editorial review.

## Before contributing

1. Search existing issues and repository records.
2. Open the appropriate contribution proposal issue.
3. Identify the exact target object or proposed new record.
4. Provide full source or observation provenance.
5. State evidence scope, limitations, conflicts, and uncertainty.
6. Confirm rights for any submitted media.

## Repository-native submission

Create a contributor identity in `editorial-inbox/contributors/` when one does not already exist. Then scaffold a submission:

```bash
npm run contribution:new -- \
  --target RC-001 \
  --type evidence-addition \
  --title "Add verified seasonal observation" \
  --contributor CTR-CONTRIBUTOR-ID
```

Complete the generated JSON and run:

```bash
npm run validate:contributions
npm run compile:atlas
npm test
npm run build
```

## Editorial lifecycle

Every substantive contribution follows:

1. Evidence Collection
2. Evidence Evaluation
3. Assertion Extraction
4. Assertion Matrix
5. Approved Assertion Register
6. Unresolved Register
7. Rejected Register
8. Editorial Synthesis
9. Five-Pass Review
10. Corrected Reference Standard
11. Editorial Verification
12. Freeze

The five review passes cover botanical accuracy, evidence traceability, terminology and consistency, editorial quality, and governance/release readiness.

## Merge standard

A contribution is mergeable only when contributor inputs validate, generated files are current, repository integrity passes, the production build succeeds, and unresolved high-severity issues are recorded or resolved.

Do not edit generated JSON in `atlas-repository/` or `lib/repository-registry.js` directly.
