# HANDOFF-EDITORIAL-CATALOGUE-003 — C-001 C0/C1 Readiness

**Status:** COMPLETE — READY FOR ENGINEERING AND MEDIA REVIEW  
**Inspected `main`:** `3e1bb1906635233b71498c771077ab7fb33abf1b`  
**Branch:** `content/catalogue-c-001`  
**Batch:** C-001  
**Publication state:** NON-PUBLIC

## 1. Completed profiles

| Cultivar identity | Working name | C0 | C1 | Source count | Media state |
| --- | --- | --- | --- | ---: | --- |
| CUL-000011 | *Acer palmatum* ‘Orange Dream’ | UNIQUE | READY | 3 | candidate-under-review |
| CUL-000012 | *Acer palmatum* ‘Koto-no-ito’ | UNIQUE | READY | 3 | candidate-under-review |
| CUL-000013 | *Acer palmatum* ‘Inaba-shidare’ | UNIQUE | READY | 3 | candidate-under-review |
| CUL-000014 | *Acer palmatum* ‘Beni-kawa’ | UNIQUE | READY | 2 | candidate-under-review |
| CUL-000015 | *Acer palmatum* ‘Trompenburg’ | UNIQUE | READY | 3 | candidate-under-review |

All five inputs use `catalogueState: review-ready`, `review.approvalState: editorial-approved` and `publishedAt: null`.

## 2. C0 decisions

### CUL-000011 — ‘Orange Dream’

Distinct from RC-009 ‘Katsura’ by the governed seasonal sequence and from RC-005 ‘Aureum’ by taxon and leaf expression. No synonym or probable duplicate remains.

### CUL-000012 — ‘Koto-no-ito’

The accepted form is hyphenated. Spaced and title-case forms are search variants. ‘Yamato-koto-no-ito’ and ‘Koto-ito-komachi’ remain separate near-name cultivars. The informal “Dancing Monkey Tree” label is not treated as a cultivar synonym.

### CUL-000013 — ‘Inaba-shidare’

Distinct from RC-004 ‘Crimson Queen’ and the approved red dissectum Catalogue cohort. The source formulation `var. dissectum` is treated as horticultural placement rather than a separate identity. “Inaba Shidara” is not accepted as a governed spelling.

### CUL-000014 — ‘Beni-kawa’

Distinct from RC-003 ‘Sango-kaku’ despite the deliberate coral-stem comparison. Spaced name forms are search variants only. Young-stem colour does not authenticate an individual specimen.

### CUL-000015 — ‘Trompenburg’

Distinct from RC-001 ‘Bloodgood’ through its deeply divided narrow lobes with recurved margins. ‘Green Trompenburg’ is a separate accepted cultivar and is not a synonym or colour form.

## 3. Bounded unresolved issues

- **CUL-000011:** primary origin history and the cross-climate consistency of the orange-red spring margin were not established.
- **CUL-000012:** the informal English nickname and quantitative early-versus-late leaf dimorphism remain outside the lean review.
- **CUL-000013:** institutional mature-size ranges differ; no universal size ceiling is asserted.
- **CUL-000014:** spring emergence is described as pinkish-yellow by RHS and soft green by Missouri Botanical Garden; the difference is preserved.
- **CUL-000015:** RHS and Missouri Botanical Garden publish materially different mature-size frameworks; both remain qualified, and the reported origin was not traced to a primary Arboretum Trompenburg record.

None of these issues creates a probable duplicate, unsupported taxon or high-risk identity conflict.

## 4. Media boundary

Editorial did not approve a photograph, media right, identity basis or governed visual gap. Each input remains `candidate-under-review`, with no primary media ID and `visualComplete: false`.

## 5. Publication boundary

- no profile is published;
- `publishedAt` remains `null`;
- no profile has `batch-approved` review state;
- no RC identifier is allocated;
- C2 and C3 are not claimed;
- no compiler, schema, validator, application, CI, media or generated-output file was edited.

## 6. Requested next action

Engineering should confirm Catalogue contract compatibility and deterministic output behaviour. Media should reconcile the five `candidate-under-review` states through approved primary visuals or governed gaps. Publication remains blocked until C2 and C3 are complete.
