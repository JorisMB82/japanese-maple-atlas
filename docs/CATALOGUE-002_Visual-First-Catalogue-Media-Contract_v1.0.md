# CATALOGUE-002 — Visual-First Catalogue Media Contract v1.0

**Status:** APPROVED REQUIREMENTS — engineering implementation authorised  
**Authority:** ROADMAP-002B and DR-STRATEGY-003  
**Scope:** Catalogue Profiles  
**Reference Standard effect:** none

## 1. Contract objective

This contract defines how Catalogue Profiles may display useful lawful imagery without overstating specimen authentication.

Rights permission and cultivar-identity confidence are separate fields. Both must be visible and reviewable.

## 2. Gallery target

A normal Catalogue Profile gallery contains three to five items.

Required roles:

- `habit-primary` — mature or whole-plant view; normally exactly one and selected for cards and the profile hero;
- `foliage-detail` — leaf form, colour or texture;
- `seasonal-diagnostic` — spring, autumn, bark, winter structure or another cultivar-relevant diagnostic subject.

Optional roles:

- `habit-alternate`;
- `seasonal-alternate`;
- `bark-stem`;
- `bud-flower-fruit`;
- `scale-context`;
- `archival-context`;
- `diagnostic-detail`.

## 3. Proposed stable media identity

Catalogue media IDs use:

`MED-CUL-######-###`

The cultivar portion must match the owning `CUL-######` profile. A Catalogue image must never be forced into an `MED-RC-###-*` identifier.

## 4. Required media item fields

Each displayed item should provide:

- `id`;
- `cultivarId`;
- `role`;
- `isPrimary`;
- `assetPath`;
- `thumbnailPath` or deterministic derivative references;
- `sourceUrl`;
- `sourceItemId` where available;
- `creator`;
- `rightsHolder` where known;
- `rightsBasis`;
- `licence` or permission identifier;
- `licenceUrl` where applicable;
- `attributionText`;
- `sourceSha256` for preserved source bytes;
- `identityConfidence`;
- `identificationBasis`;
- `identityLimitations`;
- `caption`;
- `altText`;
- `privacyStatus`;
- `reviewedBy`;
- `reviewedAt`;
- `revisionHistory`.

## 5. Controlled values

### Rights basis

- `public-domain`;
- `creative-commons`;
- `explicit-permission`;
- `contributor-owned`;
- `other-approved-open-licence`.

`rights-unresolved` is permitted only in the candidate register and cannot be used by a displayed media item.

### Identity confidence

- `documented`;
- `source-asserted`;
- `community-identified`.

### Privacy

- `not-sensitive`;
- `location-generalised`;
- `personal-data-removed`;
- `approved-with-conditions`.

## 6. Validation requirements

A displayed item fails validation when:

- its rights basis is absent or unresolved;
- the exact licence or permission record is absent where required;
- creator/source attribution is missing without a documented reason;
- its cultivar ID does not match the owning profile;
- identity confidence or identification basis is missing;
- a source-asserted or community-identified item lacks public qualification;
- it represents a generic species or different cultivar substitute;
- the asset or derivative path is missing;
- required privacy treatment is incomplete.

A gallery fails the normal Visual-First target when:

- it has fewer than three displayed items and no approved exception;
- it has no `habit-primary` item;
- it has no `foliage-detail` item;
- it has no `seasonal-diagnostic` or approved equivalent;
- more than one item is marked primary;
- the primary item is not the item used by cards and the profile hero.

## 7. Controlled exceptions

A temporary role exception must record:

- missing role;
- reason;
- reviewer;
- approved date;
- public effect;
- backfill priority;
- next review date or trigger.

An exception does not convert a missing role into visual completion and must be reported in batch metrics.

## 8. Front-end behaviour

The interface must:

- show the habit-primary image in Catalogue cards and the profile hero;
- show up to five gallery items on the profile;
- display creator/source attribution;
- display identity-confidence badges;
- show the qualification for non-documented items;
- expose licence or permission details through a disclosure;
- offer a governed report/confirm/submit action;
- avoid implying that illustrative imagery authenticates a specimen.

## 9. Candidate boundary

Candidate records may retain links to rights-unresolved material for research and permission outreach. Candidate imagery must not be copied into public assets, build output or application caches until a lawful reuse basis is recorded.

## 10. C2 transition

For Catalogue Profiles governed by ROADMAP-002B, C2 normally passes through a validated three-item gallery. Existing governed gaps remain valid until lawful galleries replace them. C-001 backfill may replace each gap incrementally, profile by profile, through protected validation.
