# HANDOFF-EDITORIAL-CATALOGUE-005 — C-003 C0/C1 and Visual-Role Readiness

**Status:** C0 COMPLETE / C1 READY — NON-PUBLIC  
**Inspected `main`:** `b33feecb617b23a7c9c31fe86b25459e891e8818`  
**Branch:** `content/catalogue-c-003`  
**Batch:** C-003  
**Next receivers:** CTO / engineering and media

## 1. Editorial result

Catalogue Batch C-003 now has five canonical lean-profile inputs. Every record:

- matches its approved stable identity and programme slot;
- resolves C0 duplicate and naming review as `unique`;
- has C1 public-facing content, source records, risk framing and editorial review complete;
- remains `review-ready`, non-public and `editorial-approved`;
- retains `publishedAt: null` and `referenceStandardId: null`;
- uses `candidate-under-review` media state with no invented media identifier, approval or governed gap;
- makes no C2 or C3 claim.

| Cultivar ID | Accepted working name | Taxon | Risk | Sources | C0 | C1 | Assessment |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| CUL-000021 | *Acer palmatum* ‘Tamukeyama’ | TAX-APAL | MEDIUM | 3 | UNIQUE — targeted synonym-scope review complete | READY | PASS |
| CUL-000022 | *Acer palmatum* ‘Orangeola’ | TAX-APAL | LOW | 3 | UNIQUE | READY | PASS |
| CUL-000023 | *Acer palmatum* ‘Higasa-yama’ | TAX-APAL | MEDIUM | 4 | UNIQUE — spelling and near-name review complete | READY | PASS |
| CUL-000024 | *Acer palmatum* ‘Arakawa’ | TAX-APAL | MEDIUM | 3 | UNIQUE — accepted-name and rough-bark alias review complete | READY | PASS |
| CUL-000025 | *Acer palmatum* ‘Red Pygmy’ | TAX-APAL | LOW | 3 | UNIQUE | READY | PASS |

**Total source objects:** 16.

## 2. C0 and naming conclusions

### CUL-000021 — ‘Tamukeyama’

- The Atlas uses the compact accepted form ‘Tamukeyama’.
- `Tamuke yama` and `Tamuke-yama` resolve to the same stable identity.
- RHS-recorded ‘Beni-hagoromo’ is retained as a probable synonym, but its historical priority and exact scope remain unresolved.
- ‘Hagoromo’ remains a separate accepted cultivar.
- The profile remains distinct from RC-004 ‘Crimson Queen’, CUL-000013 ‘Inaba-shidare’, CUL-000020 ‘Red Dragon’ and CUL-000022 ‘Orangeola’.

### CUL-000022 — ‘Orangeola’

- The accepted Catalogue identity is *Acer palmatum* ‘Orangeola’.
- The `var. dissectum` formulation is retained as horticultural placement, not a separate cultivar identity.
- It remains distinct from ‘Tamukeyama’, ‘Red Dragon’, ‘Inaba-shidare’, ‘Crimson Queen’ and generic red-orange laceleaf material.

### CUL-000023 — ‘Higasa-yama’

- The Atlas uses the RHS hyphenated form ‘Higasa-yama’.
- `Higasa yama` and `Higasayama` resolve to the same stable identity.
- Unverified historical or near-name labels are not promoted to synonyms.
- It remains distinct from RC-007 ‘Butterfly’ and other variegated maples.

### CUL-000024 — ‘Arakawa’

- The accepted working name is ‘Arakawa’.
- RHS-recorded `Rough Bark Maple` and `Rough Bark` are retained as aliases but require context because they can be used descriptively.
- ‘Arakawa-ukon’ is a separate accepted cultivar.
- Seedlings or material labelled `ex ‘Arakawa’` do not preserve clonal identity.
- It remains distinct from coral- and green-stem cultivars such as RC-003 ‘Sango-kaku’, ‘Beni-kawa’ and ‘Aoyagi’.

### CUL-000025 — ‘Red Pygmy’

- The accepted working name is ‘Red Pygmy’.
- `Red Pigmy` is treated as a misspelling, not a governed synonym.
- ‘Sharp’s Pygmy’ and ‘Coonara Pygmy’ are separate cultivars.
- The Acer palmatum taxon prevents cross-genus homonyms from becoming duplicate identities.
- It remains distinct from green linearilobum ‘Koto-no-ito’ and other red narrow-lobed cultivars.

## 3. Residual issues

- **‘Tamukeyama’:** the historical basis and exact scope of ‘Beni-hagoromo’ remain unresolved; mature dimensions and summer colour vary by source and site.
- **‘Orangeola’:** no single photograph or orange-red phase reliably separates every unlabeled plant from all other red-orange dissectums; primary origin chronology was not established.
- **‘Higasa-yama’:** variegation can weaken, change or become greener through the season; historical names beyond the governed spelling variants remain unresolved.
- **‘Arakawa’:** English rough-bark labels can be descriptive; bark develops with age and cannot authenticate young or unlabeled plants; primary origin history remains unresolved.
- **‘Red Pygmy’:** a 17-ft JC Raulston accession materially conflicts with the compact RHS framework; rootstock, age, training, site or accession history may explain the difference but were not resolved.

These issues are explicitly bounded and do not create a probable duplicate, unsupported taxon or HIGH-risk block. All five profiles are suitable for C0/C1 handoff while remaining non-public.

## 4. Visual-role support

`docs/CATALOGUE-VISUAL-ROLES-003_C-003-Editorial-Guidance.md` provides for every C-003 identity:

- habit-primary, foliage-detail and seasonal-diagnostic targets;
- optional fourth and fifth subjects;
- visual confusion and misidentification risks;
- caption facts traceable to profile source IDs;
- claims that must remain qualified;
- identity-confidence disclosure for source-asserted and community-identified images;
- correction, corroboration and photograph-submission prompts.

The shared non-documented qualification is:

> The source or contributor identifies this plant as the named cultivar. The Japanese Maple Atlas has not independently authenticated the clone. Corrections and corroborating photographs are welcome.

The visual-role document does not approve rights, assets, sidecars, media identifiers, C2 or publication.

## 5. Exact changed files

- `atlas-repository/catalogue-profiles/CUL-000021.json`
- `atlas-repository/catalogue-profiles/CUL-000022.json`
- `atlas-repository/catalogue-profiles/CUL-000023.json`
- `atlas-repository/catalogue-profiles/CUL-000024.json`
- `atlas-repository/catalogue-profiles/CUL-000025.json`
- `docs/CATALOGUE-VISUAL-ROLES-003_C-003-Editorial-Guidance.md`
- `docs/HANDOFF-EDITORIAL-CATALOGUE-005_C-003-C0-C1-and-Visual-Roles.md`
- `tests/integration/catalogue-profile-pipeline.test.mjs`

## 6. Ownership and stop boundary

No schema, compiler, validator, application, quality threshold, CI file, media sidecar, candidate register, source image, derivative, rights record, existing C-001/C-002 profile or Reference Standard file is modified.

Stop before media approval, governed-gap approval, C2 integration, C3 publication, public route generation or any additional cultivar assignment.

## 7. Requested next action

CTO / engineering should review canonical-contract compatibility and confirm that the five non-public inputs remain excluded from public discovery. Media should use the C-003 visual-role guidance to prepare lawful three-to-five-item candidate packages or controlled role exceptions. C2 and C3 remain separate later decisions.
