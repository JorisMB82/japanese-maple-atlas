# DR-ROADMAP-002-001 — Approval of ROADMAP-002 Version 1.1

**Status:** Approved and implemented  
**Decision date:** 2026-07-26  
**Decision authority:** Project owner — Joris Magenti  
**Applies to:** `ROADMAP-002 / Integrated Operating Plan`  
**Approved version:** 1.1 — Approved and governing  
**Governing milestone:** Japanese Maple Atlas — RC-020 Visual Reference Release  
**Secondary milestone:** RC-025 corpus and Version 1.0 readiness decision

## Context

ROADMAP-002 Version 1.0 established the post-Sprint-10 RC-020 Visual Atlas milestone and identified three parallel tracks: engineering, editorial/content production, and media/visual assets.

Version 1.1 converts that high-level parallel model into an executable operating plan. It also updates the programme baseline to recognise the Sprint 11 scalable-ingestion implementation now present on `main`, while preserving the RC-020 milestone and extending coordinated planning through RC-025.

## Decision

Approve `ROADMAP-002_Post-Sprint-10_RC-020-Visual-Atlas-Roadmap_v1.1_APPROVED.docx` as the governing Japanese Maple Atlas operating-plan baseline effective 26 July 2026.

The approved plan governs:

- the engineering/platform track;
- the editorial and content-production track;
- the media and visual-assets track;
- record-level lifecycle gates and handoffs;
- cross-chat ownership and status controls;
- production waves from RC-006 through RC-025;
- publication, evidence, rights, validation, and release gates.

ROADMAP-002 Version 1.0 remains part of the historical decision record but is superseded operationally by Version 1.1.

## Rationale

The Atlas has moved beyond a five-record technical pilot. The next constraint is coordinated corpus and media production rather than additional platform expansion. A single integrated operating plan reduces ambiguity between separate work conversations, protects frozen records, establishes explicit handoff artefacts, and allows the three tracks to proceed in parallel without weakening evidence, rights, or publication controls.

## Consequences

1. Version 1.1 becomes the baseline used by all new engineering, editorial, and media conversations.
2. `main` remains the repository source of truth.
3. New work must use the approved cross-track gates and status terminology.
4. RC-020 remains the immediate release gate; RC-025 remains the subsequent Version 1.0 readiness threshold.
5. Public AI, broad SDK, full runtime API, community editing, and unrelated domain expansion remain deferred unless required by the approved milestone.
6. Future material changes to the roadmap require a new or superseding Decision Record.

## Implementation record

- Approved ROADMAP-002 Version 1.1 and this Decision Record were merged through PR `#11` at commit `2d3b5f03d0aac0cb0d323b96a73b4ce0442f9d78`.
- Sprint 11.5 was subsequently completed and merged through PR `#10` at commit `49ae990338dca7f59e00f6ccf664b3e38e2f44cb`.
- `docs/STATUS-002_Post-Sprint-11.5-Three-Track-Baseline.md` records the current post-approval operating position without changing the approved roadmap.
- `docs/PROGRAMME-REGISTER_RC-001-RC-025.md` is the live repository coordination surface for record-level status.
- New stream launch prompts must reference the approved Version 1.1 DOCX, this Decision Record and the current status addendum, and must independently inspect current `main` before acting.
