# Japanese Maple Atlas — RC-001–RC-025 Programme Register

**Register status:** ACTIVE  
**Governing roadmap:** ROADMAP-002 Version 1.1  
**Register owner:** Engineering / integration stream  
**Update source:** Structured editorial, media and release handoff packets  
**Initial repository baseline:** `49ae990338dca7f59e00f6ccf664b3e38e2f44cb`

## Operating rule

This register is the repository-visible coordination surface for the three parallel tracks. Editorial and media conversations provide handoff packets; engineering/integration applies status updates here after verifying current `main`. The register records repository-authoritative state only. Unmerged work in another conversation is not represented as complete.

| RC | Cultivar assignment | Cohort | Editorial gate / status | Media gate / status | Integration | Publication | Blocker / next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RC-001 | *Acer palmatum* ‘Bloodgood’ | Foundation | G8 FROZEN | G5 READY — identity plate; target coverage gap | Validated | PUBLISHED | Acquire governed habit and foliage-detail photography when available. |
| RC-002 | *Acer palmatum* ‘Seiryu’ | Foundation | G8 FROZEN | G5 READY — identity plate; target coverage gap | Validated | PUBLISHED | Acquire governed habit and foliage-detail photography when available. |
| RC-003 | *Acer palmatum* ‘Sango-kaku’ | Foundation | G8 FROZEN | G5 READY — identity plate; target coverage gap | Validated | PUBLISHED | Prioritise governed bark/stem, habit and seasonal foliage photography. |
| RC-004 | *Acer palmatum* ‘Crimson Queen’ | Foundation | G8 FROZEN | G5 READY — identity plate; target coverage gap | Validated | PUBLISHED | Acquire governed habit and dissected-foliage detail photography. |
| RC-005 | *Acer shirasawanum* ‘Aureum’ | Foundation | G8 FROZEN | G5 READY — identity plate; target coverage gap | Validated | PUBLISHED | Acquire governed habit and spring/summer foliage photography. |
| RC-006 | *Acer palmatum* ‘Osakazuki’ | Wave 1 | G1 PASS; G2 PASS FOR REVIEW; G3 DRAFT; G4 CONDITIONAL | G0 PLANNED — governed gap; no G5 handoff | BLOCKED — awaiting matching G4 and G5 packages | NOT PUBLIC | Editorial completes botanical/nomenclatural G4 review and source-sidecar approval; media returns G5. Do not compile or publish the draft. |
| RC-007 | *Acer palmatum* ‘Butterfly’ | Wave 1 | G0 PASS — assignment locked | G0 PLANNED — governed gap | Awaiting G4 and G5 packages | NOT PUBLIC | Editorial begins governed G1 research; media plans variegation, reversion and habit coverage. |
| RC-008 | *Acer palmatum* ‘Shishi-gashira’ | Wave 1 | G0 PASS — assignment locked | G0 PLANNED — governed gap | Awaiting G4 and G5 packages | NOT PUBLIC | Editorial begins governed G1 research; media must distinguish dense lion’s-mane architecture from RC-010 layered dwarf foliage. |
| RC-009 | *Acer palmatum* ‘Katsura’ | Wave 1 | G0 PASS — assignment locked | G0 PLANNED — governed gap | Awaiting G4 and G5 packages | NOT PUBLIC | Editorial begins governed G1 research; media prioritises the brief spring-emergence capture window. |
| RC-010 | *Acer palmatum* ‘Mikawa-yatsubusa’ | Wave 1 | G0 PASS — assignment locked | G0 PLANNED — governed gap | Awaiting G4 and G5 packages | NOT PUBLIC | Editorial begins governed G1 research; preserve RC-010 as the mandatory formative checkpoint before Wave 2. |
| RC-011 | UNASSIGNED IN REPOSITORY | Wave 2 | G0 PLANNED | G0 PLANNED — governed gap | Not started | NOT PUBLIC | Do not begin deep production before the RC-010 checkpoint. |
| RC-012 | UNASSIGNED IN REPOSITORY | Wave 2 | G0 PLANNED | G0 PLANNED — governed gap | Not started | NOT PUBLIC | Do not begin deep production before the RC-010 checkpoint. |
| RC-013 | UNASSIGNED IN REPOSITORY | Wave 2 | G0 PLANNED | G0 PLANNED — governed gap | Not started | NOT PUBLIC | Do not begin deep production before the RC-010 checkpoint. |
| RC-014 | UNASSIGNED IN REPOSITORY | Wave 2 | G0 PLANNED | G0 PLANNED — governed gap | Not started | NOT PUBLIC | Do not begin deep production before the RC-010 checkpoint. |
| RC-015 | UNASSIGNED IN REPOSITORY | Wave 2 | G0 PLANNED | G0 PLANNED — governed gap | Not started | NOT PUBLIC | Do not begin deep production before the RC-010 checkpoint. |
| RC-016 | UNASSIGNED IN REPOSITORY | Wave 3 | G0 PLANNED | G0 PLANNED — governed gap | Not started | NOT PUBLIC | Begin after Wave 2 process review. |
| RC-017 | UNASSIGNED IN REPOSITORY | Wave 3 | G0 PLANNED | G0 PLANNED — governed gap | Not started | NOT PUBLIC | Begin after Wave 2 process review. |
| RC-018 | UNASSIGNED IN REPOSITORY | Wave 3 | G0 PLANNED | G0 PLANNED — governed gap | Not started | NOT PUBLIC | Begin after Wave 2 process review. |
| RC-019 | UNASSIGNED IN REPOSITORY | Wave 3 | G0 PLANNED | G0 PLANNED — governed gap | Not started | NOT PUBLIC | Begin after Wave 2 process review. |
| RC-020 | UNASSIGNED IN REPOSITORY | Wave 3 | G0 PLANNED | G0 PLANNED — governed gap | Not started | NOT PUBLIC | Complete RC-020 corpus milestone, then enter Sprints 13–15. |
| RC-021 | PROVISIONAL RESERVE | Wave 4 | POST-RC-020 | POST-RC-020 | Not started | NOT PUBLIC | Select after RC-020 findings are incorporated. |
| RC-022 | PROVISIONAL RESERVE | Wave 4 | POST-RC-020 | POST-RC-020 | Not started | NOT PUBLIC | Select after RC-020 findings are incorporated. |
| RC-023 | PROVISIONAL RESERVE | Wave 4 | POST-RC-020 | POST-RC-020 | Not started | NOT PUBLIC | Select after RC-020 findings are incorporated. |
| RC-024 | PROVISIONAL RESERVE | Wave 4 | POST-RC-020 | POST-RC-020 | Not started | NOT PUBLIC | Select after RC-020 findings are incorporated. |
| RC-025 | PROVISIONAL RESERVE | Wave 4 | POST-RC-020 | POST-RC-020 | Not started | NOT PUBLIC | Select after RC-020 findings are incorporated and prepare Version 1.0 readiness decision. |

## Status update evidence

### 2026-07-27 — Wave 1 G0 assignment lock

- **Inspected `main` SHA:** `9c9ec5f239f915ffda3bb3115569d57afa3d663a`
- **Engineering branch:** `engineering/sprint-12-wave-1`
- **Editorial source:** merged PR `#13`, final reviewed head `a6c02fcf95ef380083aaf113acfd7665b1889eee`, squash commit `9c9ec5f239f915ffda3bb3115569d57afa3d663a`
- **Gate entered / acknowledged:** RC-006 through RC-010 enter stable G0 assignment state. RC-006 G1, G2 and G3 draft evidence is acknowledged; G4 remains `CONDITIONAL` and incomplete.
- **Editorial files inspected:**
  - `atlas-repository/reference-standards/RC-006.md`
  - `atlas-repository/reference-standards/sources/RC-006.sources.json`
  - `docs/DR-EDITORIAL-001_Wave-1-RC-006-RC-010-Cultivar-Assignments.md`
  - `docs/HANDOFF-EDITORIAL-001_Wave-1-RC-006-RC-010-Cultivar-Assignments.md`
  - `docs/HANDOFF-EDITORIAL-002_RC-006-Osakazuki-G1-G3.md`
- **Engineering changed files:**
  - `docs/PROGRAMME-REGISTER_RC-001-RC-025.md`
  - `docs/INTEGRATION-001A_Wave-1-Assignment-Lock-Addendum_RC-006-RC-010_v1.0.md`
- **Validation:** PR #13 repository-quality workflow run `30303617848` passed repository/schema/tests, coverage, production build, static regression, quality validation and release-manifest generation. The draft RC status remained outside the approved/frozen compiler cohort.
- **Contract/taxon assessment:** `PASS` — all five assignments are *Acer palmatum*, already governed as `TAX-APAL`; no compiler, schema or taxon-contract change is required.
- **Deferred question:** *Acer japonicum* ‘Aconitifolium’ remains a future corpus candidate and requires a separate evidence-backed `Acer japonicum` taxon-contract decision before canonical ingestion.
- **Unresolved issues:** RC-006 botanical and nomenclatural G4 review; RC-006 source-sidecar approval; all Wave 1 G5 media handoffs; RC-007 through RC-010 G1–G4 editorial packages.
- **Next receiver:** editorial and media streams.
- **Requested action:** return matching G4 editorial and G5 media packets for all five records; engineering then performs G6 cohort compatibility review.
- **Readiness assessment:** `PASS` for the five G0 assignments; `BLOCKED` for G6 integration and publication pending complete G4 and G5 handoffs.

## Gate definitions

- **G0 — Planned:** stable RC identifier and wave assignment exist.
- **G1 — Research ready:** research brief, questions and source strategy exist.
- **G2 — Evidence assembled:** sources, locators, assertions, conflicts and uncertainty are documented.
- **G3 — Editorial draft complete:** canonical RC draft and source sidecar are complete.
- **G4 — Botanical/editorial approval:** identity, naming, morphology, horticulture and uncertainty pass review.
- **G5 — Media ready:** approved primary visual or governed gap plus complete media metadata.
- **G6 — Integration ready:** RC, source and media packages agree and cross-record references resolve.
- **G7 — Technical validation:** preflight, compile, repository checks, tests and production build pass.
- **G8 — Frozen and published:** owner approval, freeze metadata and deployment evidence are recorded.
- **G9 — Post-publication review:** production inspection is complete and findings are triaged.

## Required update evidence

Every status change must identify:

1. inspected `main` SHA;
2. branch and owned files;
3. gate being entered or exited;
4. changed-file list;
5. validation completed;
6. unresolved evidence, rights or technical issues;
7. next receiver and requested action;
8. readiness assessment: PASS, CONDITIONAL or BLOCKED.
