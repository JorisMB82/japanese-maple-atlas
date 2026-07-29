# HANDOFF-MEDIA-CATALOGUE-005 — Visual-First C-001 Backfill and C-002 Discovery Execution

**Handoff status:** EXECUTION AND DISCOVERY PACKAGE VALIDATED; ASSET PROCESSING BLOCKED BY EXTERNAL BINARY TRANSFER  
**Inspected `main`:** `3ac1e80dc51f01e47a0e8aed679acae1e864dc7c`  
**Starting branch SHA:** `3ac1e80dc51f01e47a0e8aed679acae1e864dc7c`  
**Branch:** `media/visual-first-c001-c002`  
**Authority:** DR-STRATEGY-003, ROADMAP-002B, CATALOGUE-002, MEDIA-016 and HANDOFF-MEDIA-CATALOGUE-004  
**Stop boundary:** before canonical-profile integration or publication

## 1. Baseline and contract verification

Before the first change:

- current `main` was verified at `3ac1e80dc51f01e47a0e8aed679acae1e864dc7c`;
- `media/visual-first-c001-c002` existed and compared as identical to `main`, with zero commits ahead and zero behind;
- the merged engineering system was confirmed to support:
  - `CUL-######.media.json` sidecars;
  - `MED-CUL-######-###` asset identifiers;
  - `habit-primary`, `foliage-detail`, `seasonal-diagnostic` and optional complementary roles;
  - `documented`, `source-asserted` and `community-identified` identity confidence;
  - deterministic `thumb`, `card`, `display` and `archive` derivatives;
  - item-level attribution, rights, identity, privacy and approval history.

No schema, compiler, application, canonical profile, C-002 botanical content or general engineering file was changed.

## 2. C-001 execution outcome

| Stable identity | Cultivar | Strongest lawful discovery | Three-role feasibility | Approved displayable assets | Current outcome |
| --- | --- | --- | --- | ---: | --- |
| CUL-000011 | ‘Orange Dream’ | Wojsławice CC BY-SA 4.0 item plus Andy Mabbett CC BY-SA 4.0 series | high | 0 | rights- and identity-qualified candidates; existing governed gap retained |
| CUL-000012 | ‘Koto-no-ito’ | JCRA 632008/632009, permission required | medium if permission and whole-plant coverage arrive | 0 | rights-unresolved; existing governed gap retained |
| CUL-000013 | ‘Inaba-shidare’ | Don McCulley and Andy Mabbett CC BY-SA 4.0 Commons items | high | 0 | rights- and identity-qualified candidates; existing governed gap retained |
| CUL-000014 | ‘Beni-kawa’ | Drew Avery CC BY 2.0 item | low-to-medium; habit and winter stem missing | 0 | one lawful candidate, incomplete roles; existing governed gap retained |
| CUL-000015 | ‘Trompenburg’ | JCRA accession and image series, permission required | medium if permission and mapping arrive | 0 | rights-unresolved; existing governed gap retained |

### Approved asset package

- Approved `MED-CUL` asset IDs: **none**.
- Preserved original source paths: **none**.
- Atlas SHA-256 values: **none**.
- Generated derivatives: **none**.
- Approved Catalogue media sidecars: **none**.
- New or approved controlled role exceptions: **none**.

No webpage checksum, Commons SHA-1 or source item identifier was misrepresented as the Atlas source-byte SHA-256.

### Why no asset was approved

Lawful open candidates were found for CUL-000011, CUL-000013 and CUL-000014. However, this execution environment could not transfer external binary image bytes into the repository workspace or GitHub. Without actual source bytes, the required SHA-256, EXIF/GPS treatment, deterministic derivatives, derivative visual inspection and sidecar approval cannot be completed.

This is not a rights exception and not an engineering-contract defect. The controlled outcome is to retain the existing governed gaps and distinguish the candidates as rights-qualified and identity-qualified but not approved displayable assets.

## 3. C-002 discovery outcome

| Stable identity | Cultivar | Candidate position | Rights position | Identity position | Feasibility | Primary recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| CUL-000016 | ‘Autumn Moon’ | strong Cossey Park, Auckland, Kingsbrae and JCRA sets | multiple open CC items plus institutional permission route | source-asserted; potentially documented for same-tree or accession records | high | Cossey Park same-tree habit or Auckland whole-plant habit |
| CUL-000017 | ‘Waterfall’ | Longwood and Robert Lenoir Commons items plus 27 JCRA photographs | open CC items and permission route | Robert Lenoir item has precise specimen position; other items source-asserted | high | permissioned JCRA or Longwood whole-plant frame |
| CUL-000018 | ‘Aoyagi’ | six JCRA images and accession `xx0068` | permission required | potentially documented after mapping | medium | JCRA mature habit mapped to `xx0068` |
| CUL-000019 | ‘Shin-deshōjō’ | three Meise Commons images | CC BY-SA 3.0 item set | source-asserted; romanisation must remain controlled | high if roles are distinct | Meise whole-plant frame |
| CUL-000020 | ‘Red Dragon’ | nine JCRA photographs and accession `001096` | permission required; Flickr lead unresolved | potentially documented after mapping; high red-dissectum confusion risk | medium | accession-mapped JCRA habit |

The complete candidate, intended-role, rights, identity-confidence, primary and feasibility assessment is recorded in `docs/registers/MEDIA-CANDIDATE-REGISTER_C-002.md`.

## 4. Permission and acquisition queue

`docs/MEDIA-017_Visual-First-Permission-and-Source-Acquisition-Queue.md` records:

- exact JCRA request groups for C-001 and C-002;
- the JCRA permission and full-resolution contact route;
- contributor and garden outreach targets;
- a standard permission request covering public display, derivative generation, source preservation, attribution, specimen mapping and privacy;
- the priority queue for already open-licensed source originals.

Permission is not inferred from public visibility or attribution.

## 5. Reference Standard priorities

RC-010 remains the first Reference Standard G5 priority and RC-009 remains second. Both remain `G5 BLOCKED`.

The Visual-First Catalogue identity-confidence model is not applied to Reference Standard G5. No source, sidecar, derivative, G5 PASS, freeze or publication claim was created for either record.

See `docs/MEDIA-018_Visual-First-Bounded-RS-Priority-Continuation_RC-010-RC-009.md`.

## 6. Changed files

1. `docs/HANDOFF-MEDIA-CATALOGUE-005_Visual-First-C001-C002-Execution.md`
2. `docs/MEDIA-017_Visual-First-Permission-and-Source-Acquisition-Queue.md`
3. `docs/MEDIA-018_Visual-First-Bounded-RS-Priority-Continuation_RC-010-RC-009.md`
4. `docs/registers/MEDIA-CANDIDATE-REGISTER_C-001.md`
5. `docs/registers/MEDIA-CANDIDATE-REGISTER_C-002.md`
6. `docs/requests/MRE-CUL-000014-001_Beni-kawa-Role-Exception-Readiness.md`

## 7. Validation

Protected GitHub Actions workflow `30422728947`, run `#309`, completed successfully at review head `0ca42747adc565a091d2a415fd4091d26b096914`.

Passed jobs:

- `Repository, schemas and tests`;
- `Native Node coverage thresholds`;
- `Production build and static regression`.

The successful workflow included:

- `npm run process:media`;
- `npm run validate:media`;
- `npm run process:media:check`;
- contribution, Reference Standard and Catalogue validation;
- Atlas and Catalogue compiler drift checks;
- schema, repository, search, graph and explorer validation;
- unit, integration and coverage tests;
- production build and static export regression;
- aggregate quality validation and release-manifest generation.

This handoff-finalisation commit changes documentation only and must also pass the current protected PR checks before review readiness.

Because no source asset or derivative was created, no derivative visual-inspection result is claimed.

## 8. Next receivers and stop point

**Next receivers:** CTO / engineering and Project Owner / Editor-in-Chief.

Review:

- whether the binary-transfer blocker can be resolved without changing the merged media contract;
- the rights-qualified C-001 selections and public identity qualifications;
- the C-002 role and acquisition priorities;
- institutional permission outreach;
- whether any future one- or two-item package should receive a controlled role exception.

Stop before canonical-profile integration, C2 replacement, role-exception approval, Reference Standard G6, or publication.
