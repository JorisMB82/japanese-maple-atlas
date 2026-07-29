# HANDOFF-EDITORIAL-CATALOGUE-004 — C-002 C0/C1 and Visual-Role Readiness

**Status:** C0 COMPLETE / C1 READY — NON-PUBLIC  
**Inspected `main`:** `3ac1e80dc51f01e47a0e8aed679acae1e864dc7c`  
**Branch:** `content/catalogue-c-002`  
**Authority:** DR-STRATEGY-003, ROADMAP-002B, CATALOGUE-002 and HANDOFF-EDITORIAL-CATALOGUE-003  
**Next receivers:** CTO / engineering and media

## 1. Editorial result

Catalogue Batch C-002 now has five canonical lean-profile inputs. Every record:

- matches its approved stable identity and programme slot;
- resolves C0 duplicate review as `unique`;
- has C1 content, sources, risk and editorial review complete;
- remains `review-ready`, non-public and `editorial-approved`;
- keeps `publishedAt: null` and `referenceStandardId: null`;
- uses `candidate-under-review` media state with no invented media ID, approval or governed gap;
- makes no C2 or C3 claim.

| Cultivar ID | Accepted working name | Taxon | Risk | Sources | C0 | C1 |
| --- | --- | --- | --- | ---: | --- | --- |
| CUL-000016 | *Acer shirasawanum* ‘Autumn Moon’ | TAX-ASHI | MEDIUM | 4 | UNIQUE — targeted taxon review complete | READY |
| CUL-000017 | *Acer palmatum* ‘Waterfall’ | TAX-APAL | LOW | 3 | UNIQUE | READY |
| CUL-000018 | *Acer palmatum* ‘Aoyagi’ | TAX-APAL | LOW | 3 | UNIQUE — ‘Yamato-aoyagi’ separated | READY |
| CUL-000019 | *Acer palmatum* ‘Shin-deshōjō’ | TAX-APAL | MEDIUM | 4 | UNIQUE — targeted romanisation review complete | READY |
| CUL-000020 | *Acer palmatum* ‘Red Dragon’ | TAX-APAL | LOW | 3 | UNIQUE | READY |

## 2. Targeted C0 conclusions

### CUL-000016 — ‘Autumn Moon’

The accepted Catalogue treatment is *Acer shirasawanum* ‘Autumn Moon’, consistent with the approved TAX-ASHI assignment and current RHS usage.

- RHS-recorded *Acer* ‘Autumn Moon’ and *Acer palmatum* ‘Autumn Moon’ are retained as naming/taxon variants for search.
- Commercial *Acer japonicum* ‘Autumn Moon’ usage is recorded as a historical or commercial label variant, not adopted as the accepted taxon.
- RC-005 *Acer shirasawanum* ‘Aureum’ remains a separate identity.
- ‘Moonrise’ remains a separate near-name and is not treated as a synonym.
- The taxon-label conflict is material enough to retain MEDIUM risk but is bounded and does not block C1.

### CUL-000019 — ‘Shin-deshōjō’

The public working form is ‘Shin-deshōjō’, following the current RHS accepted heading and preserving the macrons and hyphen.

- `Shin-deshojo`, `Shindeshojo`, `Shin deshojo` and title-case label forms resolve to the same stable identity.
- The variants must not create additional CUL records.
- ‘Deshōjō’ and ‘Deshōjō-nishiki’ are separately accepted cultivars and are not synonyms.
- The orthographic and near-name risk remains MEDIUM but is controlled through explicit variants and comparison notes.

## 3. Other duplicate and naming conclusions

- **‘Waterfall’:** accepted as a named green dissectum cultivar, not a generic synonym for green laceleaf Japanese maples or the Dissectum Viride Group. It remains separate from upright RC-002 ‘Seiryu’.
- **‘Aoyagi’:** accepted as ‘Aoyagi’. ‘Yamato-aoyagi’ is a separate accepted cultivar and must not be shortened or merged into this identity. Green bark alone is not authentication.
- **‘Red Dragon’:** accepted as a distinct compact red dissectum. It remains separate from RC-004 ‘Crimson Queen’, ‘Inaba-shidare’, ‘Tamukeyama’, ‘Orangeola’ and generic red laceleaf material.

## 4. Residual issues

- **‘Autumn Moon’:** institutional taxon placement is clear enough for the Catalogue, but historical and commercial taxon labels remain inconsistent; colour intensity and mature size are site-dependent.
- **‘Waterfall’:** generic green-laceleaf imagery and labels can be misleading; published size and autumn-colour emphasis vary.
- **‘Aoyagi’:** one documented living specimen is substantially taller than compact commercial descriptions; young green bark is not unique.
- **‘Shin-deshōjō’:** summer white speckling is stated by RHS but is not consistently repeated across the reviewed sources; the duration of the crimson flush varies.
- **‘Red Dragon’:** no single photograph reliably separates it from every other red dissectum; reported comparative sun tolerance requires climate and moisture qualification.

None of these residual issues creates a probable duplicate or HIGH-risk block.

## 5. Visual-role support

`docs/CATALOGUE-VISUAL-ROLES-002_C-001-C-002-Editorial-Guidance.md` supplies:

- C-001 backfill guidance for CUL-000011 through CUL-000015;
- C-002 role guidance for CUL-000016 through CUL-000020;
- habit-primary, foliage-detail and seasonal-diagnostic subjects;
- optional fourth and fifth roles;
- comparison and misidentification risks;
- source-supported caption facts;
- claims that must remain qualified;
- source-asserted/community-identified disclosure;
- correction and photograph-contribution prompts.

Editorial accepts the following qualification for non-documented Catalogue illustration:

> The source or contributor identifies this plant as the named cultivar. The Japanese Maple Atlas has not independently authenticated the clone. Corrections and corroborating photographs are welcome.

This does not approve any media item or rights basis.

## 6. Exact changed files

- `atlas-repository/catalogue-profiles/CUL-000016.json`
- `atlas-repository/catalogue-profiles/CUL-000017.json`
- `atlas-repository/catalogue-profiles/CUL-000018.json`
- `atlas-repository/catalogue-profiles/CUL-000019.json`
- `atlas-repository/catalogue-profiles/CUL-000020.json`
- `docs/CATALOGUE-VISUAL-ROLES-002_C-001-C-002-Editorial-Guidance.md`
- `docs/HANDOFF-EDITORIAL-CATALOGUE-004_C-002-C0-C1-and-Visual-Roles.md`
- `tests/integration/catalogue-profile-pipeline.test.mjs`

## 7. Requested next action

CTO / engineering should review canonical-contract compatibility and non-public discovery behaviour. Media should use the visual-role guidance to prepare lawful three-to-five-item candidate packages or controlled role exceptions. C2 integration and C3 publication remain outside this editorial handoff.
