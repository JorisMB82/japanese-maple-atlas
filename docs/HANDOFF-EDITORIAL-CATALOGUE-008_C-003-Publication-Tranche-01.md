# HANDOFF-EDITORIAL-CATALOGUE-008 — C-003 Publication Tranche 01

## Scope

Execute the Project Owner-authorised controlled publication of:

- `CUL-000021` — *Acer palmatum* ‘Tamukeyama’.

No other C-003 identity is in scope.

## Verified baseline

- Protected main at authorisation: `5cfe786c4c8a069b03c0653f703320e9cfaaba8d`.
- C0 duplicate and naming review: PASS / `unique`.
- C1 editorial and source package: PASS.
- Risk: MEDIUM and bounded.
- C2 media: approved lawful three-role gallery.
- Primary media: `MED-CUL-000021-001`.
- Remaining C-003 profiles: non-public.

## Final C3 disposition

**PASS FOR PROTECTED PUBLICATION**, subject to:

1. exact owner decision recorded in `DR-CATALOGUE-004`;
2. unchanged source images, derivatives, hashes, licences and sidecar;
3. public display of item-level `source-asserted` qualifications;
4. protected workflow success;
5. CTO review before merge;
6. production inspection after merge.

## Binding editorial and identity controls

- Accepted public name remains *Acer palmatum* ‘Tamukeyama’.
- `Tamuke yama` and `Tamuke-yama` remain spacing variants for one identity.
- ‘Beni-hagoromo’ remains a qualified probable synonym; historical scope and priority are unresolved.
- ‘Hagoromo’ remains a separate cultivar.
- Generic red laceleaf colour, foliage or habit does not authenticate the clone.
- The gallery is source-identified and is not independently authenticated by the Atlas.
- The three items are not a same-plant seasonal sequence.

## Canonical transition

The authorised implementation changes only `CUL-000021`:

- `profileVersion`: `1.1.0` → `1.2.0`;
- `catalogueState`: `review-ready` → `published`;
- `review.approvalState`: `editorial-approved` → `batch-approved`;
- `review.reviewedBy`: `Project Owner`;
- `reviewedAt`: `2026-07-31T01:43:00Z`;
- `publishedAt`: `2026-07-31T01:43:00Z`;
- controlled publication revision entry added;
- media linkage unchanged;
- `referenceStandardId` remains `null`;
- `promotionStatus` remains `not-nominated`.

## Expected public effects

- Add `/cultivars/tamukeyama`.
- Include Tamukeyama in published-only home, Explorer, search and comparison data.
- Display the three approved images in the public profile and Visual Library.
- Preserve attribution, licences, source links and identity qualifications.

## Explicit exclusions

- Do not publish Orangeola, Higasa-yama, Arakawa or Red Pygmy.
- Do not publish Waterfall, Aoyagi or Red Dragon.
- Do not modify media bytes, sidecars, hashes, rights or identifiers.
- Do not change Reference Standard G5.
- Do not create a C-004 batch or new identity.

## Rollback

Revert the publication-tranche commit if protected validation or production inspection fails. The approved non-public editorial and media package remains available for correction and resubmission.
