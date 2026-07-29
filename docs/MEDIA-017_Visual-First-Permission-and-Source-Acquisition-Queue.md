# MEDIA-017 — Visual-First Permission and Source Acquisition Queue

**Status:** ACTIVE EXECUTION QUEUE  
**Inspected `main`:** `3ac1e80dc51f01e47a0e8aed679acae1e864dc7c`  
**Branch:** `media/visual-first-c001-c002`  
**Date:** 2026-07-29  
**Scope:** C-001 backfill and C-002 discovery; Reference Standard G5 remains unchanged

## 1. Purpose

This queue converts rights-unresolved discoveries into exact outreach actions and records the source-byte work still required for rights-qualified open items.

An outreach request is not permission. No candidate may be copied, cached, transformed or displayed until the exact lawful basis is documented.

## 2. Standard permission request

For each selected institutional, nursery, photographer or contributor item, request:

1. written permission for the Japanese Maple Atlas to reproduce the selected photograph publicly;
2. permission to crop, resize, colour-manage and create deterministic web derivatives;
3. permission to preserve the supplied original source file in the governed repository;
4. the full-resolution original rather than a webpage thumbnail;
5. creator and rights-holder names;
6. the required attribution wording;
7. any licence, fee, duration, territory or platform conditions;
8. confirmation whether the photograph is tied to a named accession or specimen;
9. permission to state that mapping publicly;
10. confirmation whether precise location or personal metadata must be removed.

Suggested request language:

> The Japanese Maple Atlas is a public, evidence-oriented cultivar reference project. We request permission to reproduce the identified photograph, preserve the supplied original in our governed source repository, and create cropped/resized web derivatives for a cultivar gallery. We will display item-level creator, source, rights and cultivar-identification disclosures and will not claim that the Atlas independently authenticated the clone unless a documented accession or specimen mapping is provided. Please confirm the exact permitted uses, required attribution, rights holder, full-resolution delivery method and any conditions.

## 3. JCRA route

The JC Raulston Arboretum photograph collection states that permission is required before use, that commercial use may be licensed for a nominal fee, and that questions and full-size requests should be directed to Dennis Carey at `djcarey@ncsu.edu`; the collection also points permission enquiries to `jcraprograms@ncsu.edu`.

### C-001 requests

| Cultivar | Selected items / scope | Requested roles | Additional identity request |
| --- | --- | --- | --- |
| CUL-000012 ‘Koto-no-ito’ | images 632008 and 632009 plus one whole-plant or seasonal item if available | habit-primary, foliage-detail, seasonal-diagnostic | identify the Norfolk Botanical Garden specimen and provide any accession, label or source record available |
| CUL-000014 ‘Beni-kawa’ | images 318474 and 382304 plus a winter-stem image | habit-primary, bark-stem/seasonal-diagnostic, foliage-detail | map each image to a JCRA accession or named specimen; confirm that the bark image represents ‘Beni-kawa’ rather than a similar coral-bark cultivar |
| CUL-000015 ‘Trompenburg’ | image 745296, historical image 72854 and one foliage/seasonal item | habit-primary, foliage-detail, archival or seasonal-diagnostic | map selected current images to accession 030160 where applicable; distinguish ‘Trompenburg’ from ‘Green Trompenburg’ |

### C-002 requests

| Cultivar | Selected items / scope | Requested roles | Additional identity request |
| --- | --- | --- | --- |
| CUL-000016 ‘Autumn Moon’ | images 389532, 389534, 581262, 608050 and 608051 as a selection pool | spring habit, foliage detail, seasonal diagnostic | provide accession mapping and confirm the taxon used for the photographed specimen |
| CUL-000017 ‘Waterfall’ | select from the 27-item collection, prioritising accession 030005 or xx0095 | mature habit, foliage detail, autumn and winter context | provide image-to-accession mapping and age/scale context |
| CUL-000018 ‘Aoyagi’ | 635950–635953, 676205–676206 | mature habit, foliage/green bark, autumn diagnostic | map to accession xx0068 and identify which frames show bark/stem rather than foliage only |
| CUL-000020 ‘Red Dragon’ | 681311, 681312, 584590, 584591, 671669 and a mature habit item | habit-primary, foliage detail, spring/autumn/winter diagnostic | map to accession 001096 and confirm that selected images are not another red dissectum |

## 4. Contributor and garden routes

### CUL-000012 — ‘Koto-no-ito’

- Seattle Japanese Garden: identify the photographer and rights holder for the named image; request a full-resolution habit image and derivative permission.
- Community or specialist grower route: seek a contributor-owned whole-plant image plus foliage and seasonal detail from the same labelled plant, with a signed Atlas publication grant.
- GAP Photos or another licensed library may be evaluated as a paid route only if the exact licence permits repository preservation and deterministic derivative generation.

### CUL-000015 — ‘Trompenburg’

- Martin Ystenes Flickr lead: locate the exact item page, verify the current licence and request the original if the licence is compatible.
- Trompenburg Arboretum: request a current whole-plant and foliage set with explicit publication and derivative permission, ideally with specimen/accession identification.

### CUL-000020 — ‘Red Dragon’

- WBLA_Corky Flickr item: request permission and original only if the current item licence is not already compatible; ask how the plant was identified.
- Contributor route should request the source label or purchase/propagation history and a whole-plant frame that shows the cultivar’s mound and scale.

## 5. Open-source-byte acquisition queue

The following candidates have a documented open licence but still require actual original-byte acquisition, checksum, privacy review, processing and sidecar approval:

| Priority | Cultivar | Source set | Required action |
| ---: | --- | --- | --- |
| 1 | CUL-000011 ‘Orange Dream’ | Wojsławice Commons item plus selected Andy Mabbett items | acquire exact originals; choose three visually distinct roles; preserve licence/change notice |
| 2 | CUL-000013 ‘Inaba-shidare’ | Don McCulley IMG 2740/1966 plus Andy Mabbett autumn item | acquire originals; select habit, foliage and autumn roles; retain sign/retail identity qualifications |
| 3 | CUL-000014 ‘Beni-kawa’ | Drew Avery CC BY 2.0 item | acquire original and verify source licence page; process only as one role, not a complete gallery |
| 4 | CUL-000016 ‘Autumn Moon’ | Cossey Tree 063 sequence and/or Auckland/Kingsbrae files | select same-tree three-role sequence; record taxon sensitivity; remove precise GPS |
| 5 | CUL-000019 ‘Shin-deshōjō’ | Meise 37972–37974 | acquire originals; confirm distinct roles; remove precise GPS and preserve romanised source names |
| 6 | CUL-000017 ‘Waterfall’ | Longwood Gardens and Robert Lenoir Commons items | acquire originals; select exact licence for the GRANDMONT item; seek a whole-plant primary if the Longwood frame is unsuitable |

## 6. Execution-environment blocker

The present session provides web research and GitHub text operations but no functioning external binary download path into the repository workspace. Direct source-file transfer attempts did not produce reusable bytes. This prevents:

- source preservation;
- Atlas SHA-256 calculation;
- EXIF/GPS removal;
- deterministic derivative generation;
- visual inspection of generated derivatives;
- approved Catalogue sidecar creation.

This is a transfer/tooling blocker, not a rights waiver and not an engineering-contract defect. No schema, compiler, application or CI file should be changed to work around it.

## 7. Completion trigger

Resume asset execution when either:

- a supported binary download path is available for the exact open-licence originals; or
- an institution/contributor supplies full-resolution originals through an available file channel with the permission record.

The first complete packages should be CUL-000011 and CUL-000013, followed by CUL-000016 and CUL-000019. Existing governed gaps and candidate-only status remain in force until the source and derivative packages validate.
