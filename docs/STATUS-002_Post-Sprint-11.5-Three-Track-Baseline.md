# STATUS-002 — Post-Sprint-11.5 Three-Track Baseline

**Status:** Current operating baseline  
**Effective date:** 2026-07-27  
**Governing roadmap:** `ROADMAP-002 Version 1.1 — Approved and governing`  
**Governing Decision Record:** `DR-ROADMAP-002-001`  
**Inspected pre-housekeeping `main`:** `49ae990338dca7f59e00f6ccf664b3e38e2f44cb`

## 1. Purpose

This status document records the programme position after Sprint 11.5 without amending the approved ROADMAP-002 Version 1.1 document. The approved DOCX remains the governing operating plan. This file is the current repository-readable status addendum and must be refreshed when a material gate or five-record wave changes state.

## 2. Current programme position

| Area | Current status | Evidence / consequence |
| --- | --- | --- |
| Repository source of truth | `main` | Every conversation must inspect current `main` and record its SHA before working. |
| Application | `0.11.5` | Sprint 11.5 is merged. |
| Sprint 11 | COMPLETE | Generic canonical ingestion, legacy adapters, transactional publication and 20/25/150-record scale proof are present. |
| Sprint 11.5 | COMPLETE | Media schema v2, governed sidecars, rights/provenance/privacy validation and deterministic derivatives are present. |
| Public corpus | RC-001 through RC-005 | Five frozen public Reference Standards; 235 first-class repository objects. |
| RC-001–RC-005 media | Release minimum met | Governed identity plates are present; photographed habit, foliage-detail and seasonal coverage remain acquisition targets. |
| Wave 1 editorial | PLANNED | RC-006 through RC-010 assignments and editorial packages must be produced by the editorial stream. |
| Wave 1 media | PLANNED | Media acquisition and sidecar packages for RC-006 through RC-010 must be produced by the media stream. |
| Wave 1 engineering/integration | READY FOR HANDOFFS | The platform is ready to receive coherent editorial and media packages; Sprint 12 integration has not started. |
| Vercel | External account constraint | The repository production build is green; the last external status was a provider build-rate limit, not an application-build defect. |

## 3. Three-track ownership

### Engineering and integration

Owns contracts, schemas, compiler and validation code, generated-output systems, application integration, CI, release evidence and deployment. It must not author botanical RC content or approve media rights.

Recommended branches:

- `engineering/<maintenance-scope>`
- `integration/rc-006-010`

### Editorial and content production

Owns cultivar selection, `RC-###.md`, `RC-###.sources.json`, evidence matrices, editorial Decision Records, cross-record consistency and freeze recommendations. It must not edit schemas, compiler code, generated repository outputs or media pipeline code.

Recommended branches:

- `content/rc-006-010`
- `content/rc-011-015`
- `content/rc-016-020`

### Media and visual assets

Owns source assets, `RC-###.media.json`, rights and provenance evidence, specimen-identity treatment, captions, alt text, coverage tracking and derivative requirements. It must not rewrite cultivar identity claims or application code.

Recommended branches:

- `media/rc-006-010`
- `media/rc-011-015`
- `media/rc-016-020`

## 4. Integration and merge sequence

1. Merge required contract, schema or validator changes before dependent content or media packages.
2. Editorial submits the approved RC and source sidecar handoff.
3. Media submits the approved media package or governed-gap treatment.
4. Engineering/integration combines matching identifiers and resolves cross-record relationships.
5. Run preflight, dry-run, compiler drift, media validation, repository validation, tests, coverage, production build and static regression.
6. Project owner / Editor-in-Chief approves freeze and publication.
7. Merge by squash, verify `main`, inspect production and update the live programme register.

No track may assume another conversation's unmerged local files exist. Only merged repository content or an explicitly uploaded handoff package is authoritative.

## 5. Shared-file rule

`docs/PROGRAMME-REGISTER_RC-001-RC-025.md` is maintained by the engineering/integration stream from structured editorial and media handoffs. Editorial and media branches should not edit that file directly. This removes a predictable merge-conflict hotspot while retaining one repository-visible programme status.

## 6. Branch hygiene

- Create branches from current `main`, never from a closed sprint branch.
- Keep no more than one active branch per track per five-record wave unless a specific Decision Record authorises otherwise.
- Close or merge the associated PR before deleting a branch.
- Delete merged, closed, abandoned and temporary transport branches.
- Do not use branch names containing `payload`, `temp`, `testtree`, `unused` or similar transport terminology for normal programme work.
- Do not retain generated transfer files or one-time materialisation workflows in reviewable source.

## 7. Next gate

The next programme gate is not a new platform feature. It is the coherent Wave 1 package for RC-006 through RC-010:

- editorial packages through G4;
- media packages through G5;
- combined packages through G6;
- engineering validation through G7;
- owner approval and publication through G8;
- production inspection through G9.
