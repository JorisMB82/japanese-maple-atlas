# HANDOFF-MEDIA-ENGINEERING-002 — Catalogue Governed Visual Gap Contract

**Handoff status:** READY FOR ENGINEERING REVIEW  
**Inspected `main`:** `f8aeff982c5d155ae4880a618453dc38c40f008e`  
**Source policy:** `docs/MEDIA-014_Governed-Visual-Gap-Policy_v1.0.md`  
**Receiver:** CTO / engineering and integration

## 1. Request

Add a generic, publication-class-aware representation for an approved governed visual gap so an ordinary Catalogue Profile can satisfy C2 without creating a false media asset.

This request does not authorize a schema or application change from the media branch. Engineering should return a design and implementation proposal through its own branch and Decision Record if required.

## 2. Demonstrated contract need

The Catalogue Profile contract permits C2 through either:

- one approved primary visual; or
- an explicit governed visual gap.

The current media asset schema is designed for real assets and requires an asset path, preserved source checksum, identification metadata and four derivatives. Populating those fields for a gap would create false provenance and false derivative lineage.

The system therefore needs a first-class gap representation rather than an empty or fabricated asset.

## 3. Required semantics

The implementation must support:

- stable gap ID;
- stable cultivar identity;
- publication class;
- `state: governed-visual-gap`;
- controlled reason code and human-readable reason;
- reviewer and review date;
- candidate disposition summary;
- backfill priority;
- approved public display wording;
- `visualComplete:false`;
- `genericSubstituteAllowed:false`;
- identity-status disclosure;
- approval history;
- revision history;
- next-review date or trigger.

An unassigned programme slot must not receive a gap object.

## 4. Rendering rules

The public application must:

- render the approved disclosure instead of a broken image or generic cultivar substitute;
- avoid selecting a species-level or unrelated cultivar photograph as fallback;
- keep the profile visibly incomplete at the visual layer while allowing C2 to be satisfied;
- distinguish a governed gap from `visual candidate under review`;
- distinguish a gap from a separately approved non-evidentiary illustration;
- preserve accessibility without creating empty image alt text for a non-existent image.

## 5. Validation rules

Validation should reject:

- `visualComplete:true` on a gap;
- `genericSubstituteAllowed:true`;
- missing reviewer, date, reason, public wording or approval history;
- a gap attached to an unassigned slot;
- fake source checksum, asset path or derivative objects on a pure gap;
- a profile claiming C2 through an unapproved gap;
- simultaneous conflicting primary states without a governed precedence rule.

Validation should permit:

- one approved primary asset and no active gap;
- one approved active gap and no approved primary asset;
- historical/superseded gaps retained after an asset is approved;
- candidate references inside the gap’s audit record.

## 6. Compatibility requirements

- Do not alter existing RC-001–RC-005 illustration bytes or approved sidecars.
- Do not force Catalogue gaps into the Reference Standard asset schema.
- Preserve the ability for one stable media asset to support a Catalogue Profile and a later Reference Standard.
- Promotion must trigger review of whether the Catalogue gap remains sufficient; it must not automatically become a Reference Standard G5 PASS.
- Avoid cultivar-specific branches.

## 7. Suggested ownership boundary

Engineering owns:

- schema/data contract;
- compiler and validation behavior;
- application rendering;
- tests and migration compatibility.

Media owns:

- candidate evidence;
- gap reason and backfill priority;
- public wording recommendation;
- reviewer and approval history;
- identity and rights conclusion;
- later replacement with an approved asset.

Project Owner or delegated authority approves the Catalogue gap. Reference Standard gap sufficiency remains an explicit Project Owner decision.

## 8. Required engineering response

Return:

```json
{
  "requestId": "HANDOFF-MEDIA-ENGINEERING-002",
  "assessment": "ACCEPT | MODIFY | REJECT",
  "proposedDataLocation": "",
  "schemaFiles": [],
  "compilerFiles": [],
  "applicationFiles": [],
  "validationRules": [],
  "migrationImpact": [],
  "tests": [],
  "ownershipClarifications": [],
  "implementationBranch": "",
  "requestedMediaFollowUp": ""
}
```

## 9. Stop condition

Media will not create Catalogue gap sidecars for unassigned slots and will not fabricate empty asset objects while this request is under engineering review.