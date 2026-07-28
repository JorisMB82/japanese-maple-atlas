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
| RC-006 | *Acer palmatum* ‘Osakazuki’ | Wave 1 | G1 PASS; G2 PASS FOR REVIEW; G3 DRAFT; G4 CONDITIONAL | G5 BLOCKED — candidate work active; photograph pipeline and final rights/provenance package required | BLOCKED — awaiting corrected G4 and matching G5 package | NOT PUBLIC | Editorial completes record-specific G4 review, approves the sidecar and resolves `sourceLocations`; media resumes G5 after the shared raster fix. Do not compile or publish. |
| RC-007 | *Acer palmatum* ‘Butterfly’ | Wave 1 | G1 PASS; G2 PASS FOR REVIEW; G3 DRAFT; G4 CONDITIONAL | G0 PLANNED — governed gap; acquisition planning active | BLOCKED — awaiting corrected G4 and matching G5 package | NOT PUBLIC | Editorial performs G4 review and sidecar correction; media covers variegation, reversion and whole-plant habit. |
| RC-008 | *Acer palmatum* ‘Shishi-gashira’ | Wave 1 | G1 PASS; G2 PASS FOR REVIEW; G3 DRAFT; G4 CONDITIONAL | G0 PLANNED — governed gap; acquisition planning active | BLOCKED — awaiting corrected G4 and matching G5 package | NOT PUBLIC | Editorial performs G4 review and sidecar correction; media must distinguish lion’s-mane architecture from RC-010 layered dwarf foliage. |
| RC-009 | *Acer palmatum* ‘Katsura’ | Wave 1 | G1 PASS; G2 PASS FOR REVIEW; G3 DRAFT; G4 CONDITIONAL | G0 PLANNED — governed gap; acquisition planning active | BLOCKED — awaiting corrected G4 and matching G5 package | NOT PUBLIC | Editorial performs G4 review and sidecar correction; media prioritises the brief spring-emergence capture window. |
| RC-010 | *Acer palmatum* ‘Mikawa-yatsubusa’ | Wave 1 | G1 PASS; G2 PASS FOR REVIEW; G3 DRAFT; G4 CONDITIONAL | G0 PLANNED — governed gap; acquisition planning active | BLOCKED — awaiting corrected G4 and matching G5 package | NOT PUBLIC | Editorial performs G4 review and sidecar correction; preserve RC-010 as the mandatory formative checkpoint before Wave 2. |
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

### 2026-07-27 — Wave 1 G1–G3 draft cohort and raster dependency

- **Inspected `main` SHA:** `eb8f668d58253a36d6e0618f42318e38db97e20f`
- **Engineering branch:** `engineering/sprint-12-wave-1`
- **Editorial source:** merged PR `#16`, final head `2a7c713d28069c289904a5830093fe775bd758ca`, squash commit `eb8f668d58253a36d6e0618f42318e38db97e20f`
- **Media source:** open draft PR `#14`, branch `media/rc-006-010`, inspected head `a384f9b2926980ff166023083724c06e419d6b63`
- **Gate entered / acknowledged:** RC-007 through RC-010 join RC-006 at G1 PASS, G2 PASS FOR REVIEW and G3 DRAFT. G4 remains `CONDITIONAL` and incomplete for all five records. No G5–G9 gate is inferred from draft merge.
- **Editorial validation:** PR #16 repository-quality workflow `30305661689` passed. The changed files remained within editorial ownership, all records and source sidecars remained explicitly draft, and generated/public outputs were unchanged.
- **Editorial contract issue:** RC-006 through RC-010 source sidecars use structured `sourceLocations` objects while the current generated-source schema expects string arrays. Editorial must normalize the locators or submit a governed engineering extension request before G4/G6. Top-level sidecar status must become `approved` only through editorial/source review.
- **Media engineering issue:** PR #14 demonstrates that the schema advertises governed photographs while the current processor and validator are SVG-only and illustration-only. The shared raster fix is an engineering dependency for a real-photograph G5 package.
- **Engineering action:** implement generic governed JPEG/PNG processing, EXIF orientation, public metadata stripping, deterministic no-upscale derivatives, conditional evidence rules, tests and DR-012-001. Preserve the five existing illustration bytes.
- **Unresolved issues:** record-specific botanical/nomenclatural G4 reviews; sidecar locator and approval corrections; photograph-pipeline CI; candidate rights/provenance and identity review; G5 assessments for all five records.
- **Next receivers:** editorial and media streams after the engineering PR is reviewable; engineering receives corrected G4 and G5 structured handoffs.
- **Readiness assessment:** `PASS` for G1–G3 draft presence; `CONDITIONAL` for the shared raster implementation until CI passes; `BLOCKED` for G6, G7 and publication.

### 2026-07-27 — Wave 1 G0 assignment lock

- **Inspected `main` SHA:** `9c9ec5f239f915ffda3bb3115569d57afa3d663a`
- **Engineering branch:** `engineering/sprint-12-wave-1`
- **Editorial source:** merged PR `#13`, final reviewed head `a6c02fcf95ef380083aaf113acfd7665b1889eee`, squash commit `9c9ec5f239f915ffda3bb3115569d57afa3d663a`
- **Gate entered / acknowledged:** RC-006 through RC-010 enter stable G0 assignment state. RC-006 G1, G2 and G3 draft evidence is acknowledged; G4 remains `CONDITIONAL` and incomplete.
- **Validation:** PR #13 repository-quality workflow run `30303617848` passed repository/schema/tests, coverage, production build, static regression, quality validation and release-manifest generation.
- **Assignment/taxon assessment:** `PASS` — all five assignments are *Acer palmatum*, already governed as `TAX-APAL`; no shared contract, compiler, schema or taxon change is required for G0 assignment or G1 research.
- **Deferred question:** *Acer japonicum* ‘Aconitifolium’ remains a future corpus candidate and requires a separate evidence-backed `Acer japonicum` taxon-contract decision before canonical ingestion.
- **Readiness assessment:** `PASS` for the five G0 assignments; `BLOCKED` for G6 integration and publication pending complete corrected G4 and matching G5 handoffs.

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
