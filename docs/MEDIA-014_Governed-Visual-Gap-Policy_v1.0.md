# MEDIA-014 — Governed Visual Gap Policy v1.0

**Status:** PROPOSED POLICY — media requirements complete; schema implementation request pending  
**Inspected `main`:** `f8aeff982c5d155ae4880a618453dc38c40f008e`  
**Branch:** `media/visual-coverage-001-025-planning`

## 1. Purpose

A governed visual gap is a transparent, reviewed publication state used when no candidate can presently satisfy the legal, provenance, identity, privacy or technical requirements for an approved primary visual.

It is not:

- a generic image substituted for the cultivar;
- a candidate photograph presented as approved;
- an empty sidecar used to imply progress;
- a permanent waiver of media governance;
- an assertion that no suitable image exists anywhere.

For an ordinary Catalogue Profile, an approved governed visual gap may satisfy C2. For a Reference Standard, whether a gap is sufficient for G5 remains a record-specific Project Owner decision under the full G5 framework.

## 2. Required gap fields

Every governed gap must contain:

| Field | Requirement |
| --- | --- |
| identity | stable cultivar identity or Reference Standard ID; never an unassigned programme slot |
| publicationClass | `catalogue-profile` or `reference-standard` |
| state | `governed-visual-gap` |
| reasonCode | controlled reason identifying the principal blocker |
| reason | concise factual explanation of why no candidate passed |
| reviewer | named reviewer or governed role |
| reviewedAt | ISO date/time |
| candidateStatus | summary of attempted candidates and their disposition |
| backfillPriority | `critical`, `high`, `normal`, or `low` |
| publicDisplayWording | approved user-facing disclosure |
| visualComplete | must be `false` |
| genericSubstituteAllowed | must be `false` |
| identityStatus | normally `uncertain` or the best supported non-visual identity state; never inferred from a missing image |
| revisionHistory | dated status and decision history |
| approvalHistory | approving authority, decision and date |
| nextReviewAt | date or trigger for reassessment |

## 3. Controlled reason codes

Recommended initial codes:

- `NO_CANDIDATE_FOUND` — reasonable discovery produced no item-level candidate;
- `RIGHTS_UNRESOLVED` — candidate exists but licence or permission is insufficient;
- `ORIGINAL_UNAVAILABLE` — lawful use may be possible but original bytes cannot be preserved;
- `IDENTITY_INSUFFICIENT` — available images cannot support a transparent cultivar-primary claim;
- `PRIVACY_BLOCKER` — publication would disclose unacceptable precise location or personal data;
- `TECHNICAL_INSUFFICIENT` — source cannot support a usable primary derivative without distortion or material artefact;
- `SEASON_OR_SUBJECT_MISSING` — available images do not show the minimum subject required for truthful representation;
- `OWNER_DEFERRED` — Project Owner has explicitly deferred asset completion while approving the transparent gap.

A legal or rights blocker must use a rights code rather than being buried in free-text notes.

## 4. Candidate-status evidence

The gap packet must list each material candidate reviewed, including:

- item or source locator;
- creator where known;
- preliminary rights posture;
- identity posture;
- reason rejected, blocked or deferred;
- date assessed.

A gap may be approved after one strong candidate fails when the failure is decisive, or after several weaker candidates fail. The reviewer must explain why further discovery is not proportionate before release.

## 5. Public display wording

Default Catalogue wording:

> No approved cultivar-specific image is currently available. The Atlas has recorded this as a governed visual gap and will add an image after rights, provenance and identity review.

Default Reference Standard wording, only when owner-approved:

> This Reference Standard currently has no approved photographic primary visual. Candidate images remain under rights, provenance or identity review; no generic substitute is shown.

Public wording must not expose private negotiation details, personal information or precise sensitive locations.

## 6. Review and backfill

Backfill priority guidance:

- `critical` — public comprehension is materially impaired or the visual gap creates confusion with another identity;
- `high` — the cultivar’s primary ornamental or diagnostic trait is visual and currently unavailable;
- `normal` — useful but text and existing non-evidentiary material adequately support the profile;
- `low` — historical, supplementary or low-impact visual need.

Review triggers include:

- a new contributor offer;
- an institutional permission response;
- an assignment or identity correction;
- a new open-licence candidate;
- a scheduled six- or twelve-month review;
- promotion from Catalogue Profile to Reference Standard.

## 7. Approval authority

Catalogue gap:

- media reviewer prepares the package;
- Project Owner or explicitly delegated Catalogue approver approves;
- CTO confirms contract compatibility when the data model is implemented.

Reference Standard gap:

- media reviewer prepares the package;
- Project Owner explicitly decides whether the record may satisfy G5 with the gap;
- engineering does not infer that an approved Catalogue gap is automatically sufficient for a later Reference Standard.

## 8. Sidecar and data-model recommendation

The current media schema is asset-oriented and requires fields such as `assetPath`, source checksum and four derivatives for an approved media asset. Those requirements must not be populated with placeholders for a gap.

Recommended implementation:

- represent the gap as a first-class media-state object distinct from an asset object;
- permit a profile or stable cultivar entity to reference either an approved primary media ID or an approved gap ID;
- retain gap approval and revision history independently;
- keep `visualComplete:false` even when C2 is satisfied through the gap;
- prevent the renderer from selecting a generic photograph as fallback;
- allow a disclosed non-evidentiary Atlas illustration only as a separately governed visual object, never as a hidden substitute.

No schema, compiler, validator or UI file is changed by this media package. Requirements are returned through `HANDOFF-MEDIA-ENGINEERING-002_Catalogue-Governed-Visual-Gap-Contract.md`.

## 9. Example logical object

```json
{
  "id": "MVG-CUL-000011-001",
  "cultivarId": "CUL-000011",
  "publicationClass": "catalogue-profile",
  "state": "governed-visual-gap",
  "reasonCode": "RIGHTS_UNRESOLVED",
  "reason": "Two cultivar-specific candidates were identified, but neither has a licence or permission permitting Atlas publication and derivatives.",
  "reviewer": "Media reviewer",
  "reviewedAt": "2026-07-28",
  "candidateStatus": [],
  "backfillPriority": "high",
  "publicDisplayWording": "No approved cultivar-specific image is currently available. The Atlas has recorded this as a governed visual gap and will add an image after rights, provenance and identity review.",
  "visualComplete": false,
  "genericSubstituteAllowed": false,
  "identityStatus": "uncertain",
  "nextReviewAt": "2027-01-28",
  "approvalHistory": [],
  "revisionHistory": []
}
```

This is a requirements example, not an implemented repository schema.

## 10. Prohibitions

- no gap for an unassigned slot;
- no fake media ID, checksum, dimensions or derivative paths;
- no stock or generic species image presented as the cultivar;
- no automatic gap approval after a search returns no immediate result;
- no permanent gap without review history;
- no rights blocker downgraded to a minor documentation note;
- no `visualComplete:true` for a governed gap.