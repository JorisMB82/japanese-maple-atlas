# ROADMAP-002B — Visual-First Catalogue Amendment v1.0

**Status:** APPROVED — governing amendment to ROADMAP-002A  
**Approval date:** 2026-07-29  
**Decision authority:** Project Owner / Editor-in-Chief  
**Decision Record:** DR-STRATEGY-003  
**Scope:** Catalogue Profiles only; Reference Standard G5 is unchanged

## 1. Purpose

This amendment makes useful lawful imagery a normal Catalogue deliverable while preserving transparent uncertainty and legal reuse controls.

The Atlas will no longer require strong clonal-authentication evidence before every Catalogue photograph can be displayed. Instead, it will record reuse rights and specimen-identity confidence as separate governed dimensions.

## 2. Preserved commitments

The following remain unchanged:

- repository-first architecture and `main` as production source;
- stable `CUL-######` cultivar identity;
- C0–C3 Catalogue workflow;
- three-track engineering, editorial and media ownership;
- item-level attribution, provenance and privacy records;
- prohibition on copying images with unresolved reuse rights;
- prohibition on generic or different-cultivar substitutes;
- Reference Standard G1–G9 and G5 media requirements;
- deterministic validation, protected pull requests and rollback readiness.

## 3. Visual-First Catalogue outcome

A normal public Catalogue Profile should display at least three lawful visual items:

1. **habit-primary** — mature or whole-plant habit; normally the card and profile-primary image;
2. **foliage-detail** — leaf form, colour or texture;
3. **seasonal-diagnostic** — spring, autumn, bark, winter structure or another useful diagnostic role.

A fourth and fifth item may add alternate season, bark, buds, flowers, fruit, scale, archival context or another useful view.

The normal target is three to five displayed items per profile. Fewer than three requires a recorded exception and a retained backfill task.

## 4. Lawful reuse basis

A displayed image must use a governed lawful basis such as:

- `public-domain`;
- `creative-commons` with the exact licence recorded;
- `explicit-permission`;
- `contributor-owned` with Atlas publication permission;
- another documented open licence or statutory basis approved for the item.

The following are not sufficient on their own:

- attribution;
- a link to the source;
- a copyright warning;
- educational or non-commercial purpose;
- hotlinking;
- public web availability;
- a screenshot or cached derivative.

Rights-unresolved material may be retained only as internal or outbound reference candidates.

## 5. Identity-confidence model

Every displayed Catalogue image must declare one identity-confidence state:

### `documented`

The item is tied to a meaningful specimen, accession, determination, propagation or equivalent documented identity basis.

### `source-asserted`

The named source identifies the subject as the cultivar, but the Atlas has not independently authenticated the clone. Examples may include a botanical-garden label, nursery assertion, photographer metadata or named institutional record without sufficient accession mapping.

### `community-identified`

The photographer, grower, contributor or community identifies the subject as the cultivar, but the assertion has not been independently confirmed by the Atlas.

Source-asserted and community-identified items are illustrative, not cultivar-authentication evidence.

## 6. Required item metadata

Each displayed Catalogue visual must record:

- stable media ID scoped to `CUL-######`;
- cultivar ID;
- visual role;
- primary/card designation;
- asset path and source locator;
- creator and rights holder where known;
- lawful reuse basis;
- exact licence or permission record;
- attribution text;
- identity-confidence state;
- identification basis and limitation;
- caption and alt text;
- source-byte checksum and derivative lineage where the Atlas preserves the file;
- privacy treatment;
- review and revision history.

## 7. Public disclosure

The interface must show item-level attribution and identity-confidence disclosure. It must not hide uncertainty in a general footer.

For non-documented items, the interface should display wording equivalent to:

> Source-identified or community-identified; not independently authenticated by the Japanese Maple Atlas.

Profiles should provide governed actions to:

- report a possible misidentification;
- confirm or challenge the identification with evidence;
- submit a better or additional photograph.

## 8. Revised Catalogue C2

C2 is normally satisfied when:

- the required visual roles are covered by at least three lawful items;
- every item passes rights, attribution, privacy and technical validation;
- every item carries a valid identity-confidence state and qualification;
- one habit-primary item is designated for cards and the profile hero;
- no generic or different-cultivar substitute is present.

A recorded visual-role exception may temporarily permit fewer than three items. A governed visual gap remains available when no lawful displayed item can be obtained.

## 9. Batch application

### C-001

Immediately reopen visual acquisition for CUL-000011 through CUL-000015. Reassess lawful candidates previously rejected only for insufficient authentication under the new `source-asserted` or `community-identified` states. Keep all existing rights blockers intact.

### C-002 and later

Media discovery begins with the editorial C0/C1 work rather than after it. Each profile should arrive at engineering with a three-to-five-item gallery package or explicit recorded exceptions.

### Reference Standards

Reference Standard G5 remains unchanged. Catalogue-qualified source-asserted or community-identified images may appear as clearly non-evidentiary supplementary material only if separately governed, but they do not automatically satisfy G5.

## 10. Track responsibilities

### Engineering

- implement the CUL-compatible media schema and validators;
- support galleries, primary-card selection and confidence labels;
- render attribution and identity qualifications;
- add correction, confirmation and submission entry points;
- preserve published-only discovery and rollback;
- update tests, CI, release manifests and quality invariants.

### Media

- search lawful open, permissioned and contributor-owned sources broadly;
- record rights basis separately from identity confidence;
- target habit, foliage and seasonal or diagnostic roles;
- prepare three-to-five-item packages and controlled exceptions;
- retain unresolved-rights items only as non-displayed candidates;
- continue C-001 backfill while executing C-002.

### Editorial

- identify the most useful visual roles for each cultivar;
- review captions, comparisons and public qualification language;
- ensure imagery does not contradict the profile or imply authentication;
- define correction and contribution prompts;
- support targeted identity review where a visual claim materially affects the profile.

## 11. Metrics and checkpoint

For each Catalogue batch, record:

- displayed images per profile;
- role coverage;
- rights-basis distribution;
- identity-confidence distribution;
- profiles using fewer-than-three exceptions;
- governed-gap rate;
- time spent on discovery, permission and processing;
- correction or misidentification reports;
- contributor-photo conversion rate;
- deployment defects.

Review the policy after C-001 backfill and C-002 publication. Increase batch size only when the gallery workflow is scalable and does not create concealed rights or identity risks.
