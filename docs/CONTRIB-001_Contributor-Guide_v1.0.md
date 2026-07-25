# CONTRIB-001 — Contributor Guide

**Version:** 1.0  
**Status:** Approved for Sprint 7

## Contribution principles

Contributors must distinguish evidence from interpretation, preserve material uncertainty, use stable identifiers, provide full provenance and confirm media rights.

## Contribution types

- new record;
- evidence addition;
- correction;
- qualification;
- media contribution;
- relationship proposal;
- governance change.

## Required fields

Every submission identifies the target, contributor, type, title, summary, status, date, version and editorial workflow. Evidence, uncertainty and rights attestations are mandatory before freeze.

## Commands

```bash
npm run contribution:new -- --target RC-001 --type evidence-addition --title "Title" --contributor CTR-CONTRIBUTOR-ID
npm run validate:contributions
npm run compile:atlas
npm test
npm run build
```

## Editorial outcomes

Submissions may be draft, submitted, in triage, needing revision, under review, accepted, rejected or withdrawn. Rejection does not erase the editorial record; it preserves the decision trail.
