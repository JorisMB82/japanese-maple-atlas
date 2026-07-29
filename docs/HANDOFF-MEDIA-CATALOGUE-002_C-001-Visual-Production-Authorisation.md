# HANDOFF-MEDIA-CATALOGUE-002 — C-001 Visual Production Authorisation

**Status:** ACTIVE — READY FOR MEDIA EXECUTION  
**Authority:** DR-CATALOGUE-001  
**Branch baseline:** `4a4c67ec400644431b2c54cdd13ab842da847d00`  
**Next receiver:** Media / visual-assets stream  
**Target branch:** `media/catalogue-c-001`

## 1. Authorised batch

| Stable identity | Approved working name | Preliminary media feasibility |
| --- | --- | --- |
| CUL-000011 | *Acer palmatum* ‘Orange Dream’ | HIGH |
| CUL-000012 | *Acer palmatum* ‘Koto-no-ito’ | HIGH |
| CUL-000013 | *Acer palmatum* ‘Inaba-shidare’ | HIGH |
| CUL-000014 | *Acer palmatum* ‘Beni-kawa’ | HIGH |
| CUL-000015 | *Acer palmatum* ‘Trompenburg’ | HIGH |

## 2. Required C2 outcome

For each C-001 identity, resolve C2 through exactly one of:

1. an approved primary visual with complete rights, provenance, specimen-identity basis, privacy treatment, source preservation, caption, alt text, sidecar and deterministic derivatives; or
2. an explicitly approved governed visual gap using the Catalogue Profile gap contract.

Candidate images, unverified trade photographs, search-result thumbnails, undocumented specimens and non-evidentiary illustrations do not satisfy C2.

## 3. Cultivar-specific visual objectives

- **Orange Dream:** representative habit plus seasonal foliage showing the yellow–green–orange trajectory; avoid confusing it with ‘Katsura’ or ‘Aureum’.
- **Koto-no-ito:** branch-scale narrow-lobed foliage and enough whole-plant context to show form; verify the specimen is not a related near-name cultivar.
- **Inaba-shidare:** cascading habit and red dissected foliage; avoid identification based on colour alone and document distinction from ‘Crimson Queen’.
- **Beni-kawa:** winter or dormant-season stem colour plus representative foliage/habit; distinguish from ‘Sango-kaku’ and other coral-bark material.
- **Trompenburg:** recurved-lobe detail and representative upright/spreading habit; preserve evidence distinguishing it from ‘Green Trompenburg’ and generic purple maples.

## 4. Acquisition order

Prioritise sources in this order:

1. accessioned botanical-garden or arboretum material;
2. university, herbarium or institutional living-collection material;
3. rights-cleared contributor photography with credible specimen identity;
4. established specialist collections or nurseries with documented labelling;
5. governed gap when no qualifying visual can be secured within the batch window.

Do not treat web availability as permission. Preserve original bytes and source records before derivative processing.

## 5. Required media package

For every approved primary visual provide:

- stable media ID scoped to the cultivar identity;
- source/original file and SHA-256;
- source URL or contributor record;
- creator, rights holder, licence and permitted uses;
- accession, label, provenance or other specimen-identity basis;
- privacy and recognisable-person assessment;
- manipulation and cropping disclosure;
- caption and alt text;
- approved primary designation;
- deterministic thumb, card, display and archive derivatives;
- validation output and any residual identity limitation.

For every governed gap provide:

- reason;
- reviewer and date;
- public wording;
- backfill priority;
- explicit `visualComplete: false` state;
- confirmation that no fake asset metadata was created.

## 6. Parallel priority boundary

C-001 work is authorised, but it does not cancel the existing Reference Standard visual priorities:

- RC-010 ‘Mikawa-yatsubusa’ remains first RS G5 priority;
- RC-009 ‘Katsura’ remains second RS G5 priority;
- RC-001–RC-005 photographic uplift remains a bounded parallel programme.

Media should allocate effort so C-001 can progress without falsely declaring any RC-006–RC-010 G5 pass.

## 7. Ownership boundary

Media owns source assets, rights, provenance, identity treatment, privacy, captions, alt text, sidecars, governed-gap proposals and derivative validation.

Media must not:

- change cultivar assignments, taxon decisions or editorial prose;
- mark a governed gap approved without the required authority;
- mark a Catalogue Profile published;
- alter schemas, compiler, application or CI;
- allocate an RC identifier;
- claim that a photograph authenticates a cultivar beyond its documented identity basis.

## 8. Validation and handoff

Before handoff to engineering:

1. run media processing and validation commands;
2. confirm deterministic derivative drift checks pass;
3. provide the exact changed-file list and original-byte hashes;
4. report C2 status separately for each identity;
5. identify any owner decision required for a governed gap;
6. stop before integration or publication.

## 9. Success condition

Media success is a complete C2-ready package for each C-001 identity, or a clearly documented blocker/gap request. Publication remains an engineering/CTO action after C0–C3 validation.
