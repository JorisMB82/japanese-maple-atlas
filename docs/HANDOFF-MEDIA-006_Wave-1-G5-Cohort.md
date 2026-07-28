# HANDOFF-MEDIA-006 — Wave 1 RC-006–RC-010 G5 Cohort

**Handoff status:** BLOCKED — planning and candidate research complete; no approved source asset or approved governed-gap sidecar  
**Inspected `main`:** `1af3d20c574e851ce55d01f9639caa8fda3a8e54`  
**Branch:** `media/rc-006-010`  
**Engineering dependency:** RESOLVED through PR #17, squash commit `a010c2c8ee76dbd8735d1390e09aa06664b1b009`  
**Ownership boundary:** Media-owned files and governed media assets only  
**Next receiver:** CTO / engineering and integration

## 1. Reconciliation

The media branch was rebuilt on the governed photograph-pipeline baseline, retained the valid eleven-file PR #14 package, incorporated current main and recorded the former processor request as resolved. The current main branch-protection Decision Record is preserved without modification.

The raster pipeline can process governed JPEG/PNG sources. It does not approve candidate rights, provenance, identity or editorial use.

## 2. Cohort files

Shared media files:

- `atlas-repository/media-coverage.json`
- `docs/MEDIA-003_Wave-1-Acquisition-and-Rights-Operations_v1.0.md`
- `docs/MEDIA-004_RC-001-RC-005-Photographic-Uplift-v1.0.md`
- `docs/checklists/MEDIA-001_Asset-Quality-and-Metadata-Checklist.md`
- `docs/registers/MEDIA-CANDIDATE-REGISTER_RC-006-RC-010.md`
- `docs/templates/MEDIA-001_Editorial-Assignment-to-Media.md`
- `docs/templates/MEDIA-002_G5-Media-Handoff-Packet.md`
- `docs/templates/MEDIA-003_Contributor-Rights-and-Provenance-Record.md`
- `docs/HANDOFF-MEDIA-ENGINEERING-001_RC-006-Photograph-Pipeline-Request.md`

Record-specific plans and status handoffs:

| RC | Acquisition plan | G5 status |
| --- | --- | --- |
| RC-006 | `docs/MEDIA-005_RC-006-Osakazuki-Acquisition-Plan_v1.0.md` | `docs/HANDOFF-MEDIA-001_RC-006-Osakazuki-G5-Status.md` |
| RC-007 | `docs/MEDIA-006_RC-007-Butterfly-Acquisition-Plan_v1.0.md` | `docs/HANDOFF-MEDIA-002_RC-007-Butterfly-G5-Status.md` |
| RC-008 | `docs/MEDIA-007_RC-008-Shishi-gashira-Acquisition-Plan_v1.0.md` | `docs/HANDOFF-MEDIA-003_RC-008-Shishi-gashira-G5-Status.md` |
| RC-009 | `docs/MEDIA-008_RC-009-Katsura-Acquisition-Plan_v1.0.md` | `docs/HANDOFF-MEDIA-004_RC-009-Katsura-G5-Status.md` |
| RC-010 | `docs/MEDIA-009_RC-010-Mikawa-yatsubusa-Acquisition-Plan_v1.0.md` | `docs/HANDOFF-MEDIA-005_RC-010-Mikawa-yatsubusa-G5-Status.md` |

## 3. Per-record assessment

| RC | Assessment | Primary blocker | Candidate direction |
| --- | --- | --- | --- |
| RC-006 ‘Osakazuki’ | BLOCKED | no selected preserved original, final rights/identity package or sidecar; scaled leaf detail unresolved | JCRA accession-linked seasonal set; item-level Commons habit/samara alternatives |
| RC-007 ‘Butterfly’ | BLOCKED | no selected preserved original, final rights/identity package or sidecar; representative variegation distribution unresolved | JCRA seasonal set; David J. Stang CC BY-SA garden/nursery images |
| RC-008 ‘Shishi-gashira’ | BLOCKED | no selected preserved original, permission/accession mapping or sidecar; RC-010 comparison unresolved | JCRA accession xx0090; David J. Stang CC BY-SA alternatives |
| RC-009 ‘Katsura’ | BLOCKED | no approved early-spring original, seasonal sequence, final rights/identity package or sidecar | JCRA 1 May sequence; Commons alternatives; planned same-accession capture |
| RC-010 ‘Mikawa-yatsubusa’ | BLOCKED | no selected preserved original, final rights/identity package or sidecar; Commons identity ambiguity and RC-008 comparison unresolved | JCRA accession 030154; qualified Commons lead; planned paired capture |

## 4. Asset, provenance and sidecar disposition

No source image has been copied into the repository. No original-byte SHA-256 has been calculated. No provenance record has been completed because no asset has passed selection and rights review. No `RC-006.media.json` through `RC-010.media.json` has been created.

This is deliberate. The project has not approved a governed gap for any of these records, and an empty or approved sidecar would imply a gate that has not been earned.

## 5. Validation status

The engineering photograph pipeline passed its full repository-quality workflow when merged. For this media branch:

- changed files are media documentation and `atlas-repository/media-coverage.json` only;
- no source asset or derivative was generated, so there is no new visual derivative to inspect;
- final PR workflow status must be recorded against the reconciled PR head before merge consideration;
- no G5 PASS is claimed from documentation-only validation.

## 6. Structured cohort handoff

```json
{
  "inspectedMainSha": "1af3d20c574e851ce55d01f9639caa8fda3a8e54",
  "branch": "media/rc-006-010",
  "engineeringDependency": {
    "status": "RESOLVED",
    "mergedCommit": "a010c2c8ee76dbd8735d1390e09aa06664b1b009"
  },
  "records": [
    {"recordId":"RC-006","currentGate":"G5","assessment":"BLOCKED","mediaSidecar":"","sourceAssets":[],"ownerDecisionRequired":false,"requestedNextAction":"Complete item-level rights, original preservation, identity review and scaled leaf-detail acquisition."},
    {"recordId":"RC-007","currentGate":"G5","assessment":"BLOCKED","mediaSidecar":"","sourceAssets":[],"ownerDecisionRequired":false,"requestedNextAction":"Complete item-level rights, original preservation, identity review and representative variegation coverage."},
    {"recordId":"RC-008","currentGate":"G5","assessment":"BLOCKED","mediaSidecar":"","sourceAssets":[],"ownerDecisionRequired":false,"requestedNextAction":"Complete permission, accession mapping, original preservation and RC-010 comparison planning."},
    {"recordId":"RC-009","currentGate":"G5","assessment":"BLOCKED","mediaSidecar":"","sourceAssets":[],"ownerDecisionRequired":false,"requestedNextAction":"Secure a governed early-spring source and complete the seasonal identity and rights package."},
    {"recordId":"RC-010","currentGate":"G5","assessment":"BLOCKED","mediaSidecar":"","sourceAssets":[],"ownerDecisionRequired":false,"requestedNextAction":"Complete JCRA permission/accession mapping or resolve the Commons identity ambiguity and RC-008 comparison."}
  ],
  "ownershipBoundary": "Media-owned files and governed media assets only",
  "nextReceiver": "CTO / engineering and integration",
  "cohortRequestedAction": "Review the reconciled planning and BLOCKED G5 packages; do not enter G6 until a matching approved media asset or approved governed gap exists."
}
```

## 7. Requested action

CTO / engineering and integration should review the reconciled ownership boundary and confirm that the branch remains compatible with the current photograph contract. No record is ready for G6. Media resumes source acquisition and permission work after this planning package is accepted.
