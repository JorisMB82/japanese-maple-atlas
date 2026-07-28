# HANDOFF-EDITORIAL-013 — Wave 1 G4 Cohort

**Handoff status:** READY FOR REPOSITORY-QUALITY VALIDATION AND CTO REVIEW  
**Inspected main:** `774be47d4709700a3c217af9aca093bb2d6a38c3`  
**Editorial branch:** `content/rc-006-010`  
**Substantive content head before this manifest:** `c30f473c3b7755810945105173252a3e0f4f3b24`  
**Current gate:** G4  
**Next receiver:** CTO / engineering and integration  
**Publication status:** RC-006 through RC-010 remain not public

The `headCommit` in the structured object records the exact substantive content head immediately before this self-referential handoff file was committed. The final branch/PR head is the authoritative delivery SHA and will be recorded in the pull request and final execution report.

## 1. Baseline reconciliation

The expected checkpoint `56169aa9fe3e21231f1a680bb6f97d4230192780` was verified and then `main` advanced through engineering-only branch-protection governance. The editorial branch was reconciled to current `main` at `774be47d4709700a3c217af9aca093bb2d6a38c3` before the final G4 package was assembled.

No cultivar assignment changed. RC-001 through RC-005 were not edited. No media, programme-register, compiler, schema, validator, application, CI or generated repository file was modified.

## 2. Cohort assessment

| Record | G4 assessment | Freeze-candidate result | Material owner decision |
| --- | --- | --- | --- |
| RC-006 ‘Osakazuki’ | **CONDITIONAL** | Candidate after owner acceptance | ‘Taihai’, group formulations, ‘Ōsakasuki’ and absent primary provenance |
| RC-007 ‘Butterfly’ | **CONDITIONAL** | Candidate after owner acceptance | ‘Kochō-no-mai’ relationship with unresolved history |
| RC-008 ‘Shishi-gashira’ | **CONDITIONAL** | Candidate after owner acceptance | ‘Ribesifolium’, ‘Crispifolium’ and ‘Mejishi’ with unresolved priority/scope |
| RC-009 ‘Katsura’ | **PASS** | Suitable for owner freeze consideration | No material nomenclatural condition |
| RC-010 ‘Mikawa-yatsubusa’ | **PASS** | Suitable for owner freeze consideration | No material nomenclatural condition |

The three CONDITIONAL records remain usable descriptive records, but the Project Owner must explicitly accept the stated naming risks before a freeze decision.

## 3. Mandatory source-sidecar correction

All five sidecars now:

- use top-level status `approved` following editorial/source review;
- use deterministic string arrays for `sourceLocations`;
- preserve locator type, accession/specimen/photograph identifier, date and URL where applicable;
- retain authority assessments, limitations and evidence-domain mappings;
- avoid any schema extension.

The string contract was sufficient. No engineering change request is required.

Source-sidecar approval applies only to editorial source objects. It does not freeze a cultivar record, clear media rights, authenticate a plant or make a record public.

## 4. Exact changed-file list

### Canonical editorial records

1. `atlas-repository/reference-standards/RC-006.md`
2. `atlas-repository/reference-standards/RC-007.md`
3. `atlas-repository/reference-standards/RC-008.md`
4. `atlas-repository/reference-standards/RC-009.md`
5. `atlas-repository/reference-standards/RC-010.md`

### Editorial source sidecars

6. `atlas-repository/reference-standards/sources/RC-006.sources.json`
7. `atlas-repository/reference-standards/sources/RC-007.sources.json`
8. `atlas-repository/reference-standards/sources/RC-008.sources.json`
9. `atlas-repository/reference-standards/sources/RC-009.sources.json`
10. `atlas-repository/reference-standards/sources/RC-010.sources.json`

### G4 handoffs and decision record

11. `docs/HANDOFF-EDITORIAL-008_RC-006-Osakazuki-G4-Review.md`
12. `docs/HANDOFF-EDITORIAL-009_RC-007-Butterfly-G4-Review.md`
13. `docs/HANDOFF-EDITORIAL-010_RC-008-Shishi-gashira-G4-Review.md`
14. `docs/HANDOFF-EDITORIAL-011_RC-009-Katsura-G4-Review.md`
15. `docs/HANDOFF-EDITORIAL-012_RC-010-Mikawa-yatsubusa-G4-Review.md`
16. `docs/HANDOFF-EDITORIAL-013_Wave-1-G4-Cohort.md`
17. `docs/DR-EDITORIAL-002_Wave-1-G4-Review-Recommendations.md`

No evidence matrix was changed because the G4 work corrected governance, source-locator representation and editorial determinations without adding or reversing a substantive evidence claim.

## 5. Freeze-candidate boundary

Every record retains:

- freeze date: `Pending`;
- final approval decision: `Pending`;
- publication status: `Not public`;
- a record status that does not match approved/frozen compiler patterns.

No record claims G5, G6, G7, G8 or G9. Only the Project Owner may provide a later freeze/publication decision.

## 6. Validation plan and delivery evidence

The final PR head must pass the complete repository-quality workflow. Minimum commands represented by repository scripts and required for this package are:

1. `npm run validate:contributions`
2. `npm run validate:reference-standards`
3. `npm run compile:atlas:dry-run`
4. `npm run compile:atlas:check`
5. `npm run validate:schemas`
6. `npm run validate:repository`
7. `npm run test:unit`
8. `npm run test:integration`
9. `npm run build`

The final execution report and pull-request checks are the authoritative validation record. The cohort must not proceed to integration unless the complete repository-quality workflow passes.

Expected invariants to be confirmed by the final PR diff and checks:

- RC-006 through RC-010 remain outside the compiled public corpus;
- generated repository outputs do not change to include RC-006 through RC-010;
- RC-001 through RC-005 remain unchanged and published;
- no media or engineering-owned file is modified.

## 7. Structured handoff

```json
{
  "inspectedMainSha": "774be47d4709700a3c217af9aca093bb2d6a38c3",
  "branch": "content/rc-006-010",
  "headCommit": "c30f473c3b7755810945105173252a3e0f4f3b24",
  "records": [
    {
      "recordId": "RC-006",
      "currentGate": "G4",
      "assessment": "CONDITIONAL",
      "changedFiles": [
        "atlas-repository/reference-standards/RC-006.md",
        "atlas-repository/reference-standards/sources/RC-006.sources.json",
        "docs/HANDOFF-EDITORIAL-008_RC-006-Osakazuki-G4-Review.md"
      ],
      "validationPerformed": [
        "source object and evidence-domain review",
        "deterministic sourceLocations normalization",
        "canonical section and non-public metadata review",
        "cross-record comparison review",
        "repository-quality workflow required on final PR head"
      ],
      "unresolvedIssues": [
        "historical scope of Taihai",
        "Amoenum/Elegans/Heptalobum group reconciliation",
        "JC Raulston Osakasuki spelling",
        "original selector and primary provenance",
        "commercial clonal uniformity"
      ],
      "materialRiskRequiringOwnerDecision": true,
      "requestedNextAction": "Project Owner accepts or rejects the listed naming conditions; CTO reviews compatibility and awaits matching G5 media."
    },
    {
      "recordId": "RC-007",
      "currentGate": "G4",
      "assessment": "CONDITIONAL",
      "changedFiles": [
        "atlas-repository/reference-standards/RC-007.md",
        "atlas-repository/reference-standards/sources/RC-007.sources.json",
        "docs/HANDOFF-EDITORIAL-009_RC-007-Butterfly-G4-Review.md"
      ],
      "validationPerformed": [
        "source object and evidence-domain review",
        "deterministic sourceLocations normalization",
        "canonical section and non-public metadata review",
        "cross-record comparison review",
        "repository-quality workflow required on final PR head"
      ],
      "unresolvedIssues": [
        "historical sequence of Kocho-no-mai",
        "original selector and primary provenance",
        "quantified reversion frequency",
        "cultivar-specific autumn trajectory",
        "commercial clonal uniformity"
      ],
      "materialRiskRequiringOwnerDecision": true,
      "requestedNextAction": "Project Owner accepts or rejects the synonym-history condition; CTO reviews compatibility and awaits matching G5 media."
    },
    {
      "recordId": "RC-008",
      "currentGate": "G4",
      "assessment": "CONDITIONAL",
      "changedFiles": [
        "atlas-repository/reference-standards/RC-008.md",
        "atlas-repository/reference-standards/sources/RC-008.sources.json",
        "docs/HANDOFF-EDITORIAL-010_RC-008-Shishi-gashira-G4-Review.md"
      ],
      "validationPerformed": [
        "source object and evidence-domain review",
        "deterministic sourceLocations normalization",
        "canonical section and non-public metadata review",
        "RC-008/RC-010 diagnostic distinction review",
        "repository-quality workflow required on final PR head"
      ],
      "unresolvedIssues": [
        "priority and scope of Ribesifolium, Crispifolium and Mejishi",
        "original selector and primary provenance",
        "standardized leaf and tuft measurements",
        "mature-crown development",
        "authenticated RC-010 comparison"
      ],
      "materialRiskRequiringOwnerDecision": true,
      "requestedNextAction": "Project Owner accepts or rejects the synonym-scope condition; CTO reviews compatibility and awaits matching G5 media."
    },
    {
      "recordId": "RC-009",
      "currentGate": "G4",
      "assessment": "PASS",
      "changedFiles": [
        "atlas-repository/reference-standards/RC-009.md",
        "atlas-repository/reference-standards/sources/RC-009.sources.json",
        "docs/HANDOFF-EDITORIAL-011_RC-009-Katsura-G4-Review.md"
      ],
      "validationPerformed": [
        "source object and evidence-domain review",
        "deterministic sourceLocations normalization",
        "canonical section and non-public metadata review",
        "cross-taxon Katsura disambiguation review",
        "repository-quality workflow required on final PR head"
      ],
      "unresolvedIssues": [
        "original selector and primary provenance",
        "standardized bud-break timing",
        "duration of spring margin colour",
        "authenticated leaf measurements",
        "commercial clonal uniformity"
      ],
      "materialRiskRequiringOwnerDecision": false,
      "requestedNextAction": "CTO reviews compatibility, awaits matching G5 media and returns the record to the Project Owner for freeze consideration when coherent."
    },
    {
      "recordId": "RC-010",
      "currentGate": "G4",
      "assessment": "PASS",
      "changedFiles": [
        "atlas-repository/reference-standards/RC-010.md",
        "atlas-repository/reference-standards/sources/RC-010.sources.json",
        "docs/HANDOFF-EDITORIAL-012_RC-010-Mikawa-yatsubusa-G4-Review.md"
      ],
      "validationPerformed": [
        "source object and evidence-domain review",
        "deterministic sourceLocations normalization",
        "canonical section and non-public metadata review",
        "RC-008/RC-010 diagnostic distinction review",
        "repository-quality workflow required on final PR head"
      ],
      "unresolvedIssues": [
        "original selector and primary provenance",
        "flower-colour source conflict",
        "mature-size distribution",
        "standardized leaf-overlap measurements",
        "commercial regional/discovery narratives"
      ],
      "materialRiskRequiringOwnerDecision": false,
      "requestedNextAction": "CTO reviews compatibility and the RC-008 distinction, awaits matching G5 media and returns the record to the Project Owner for freeze consideration when coherent."
    }
  ],
  "ownershipBoundary": "Editorial files only",
  "nextReceiver": "CTO / engineering and integration",
  "cohortRequestedAction": "Review G4 compatibility and await matching G5 media handoffs"
}
```

## 8. Stop boundary

Editorial stops after the reviewable PR and its final validation record. It does not begin RC-011, create an integration branch, approve media, alter the programme register, enter a freeze date or publish any Wave 1 record.
