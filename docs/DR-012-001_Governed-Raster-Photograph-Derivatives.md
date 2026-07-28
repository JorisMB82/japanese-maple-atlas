# DR-012-001 — Governed Raster Photograph Derivatives

**Status:** Accepted for Sprint 12 engineering implementation  
**Decision date:** 2026-07-27  
**Decision owner:** Acting CTO / engineering and integration stream  
**Prepared against `main`:** `eb8f668d58253a36d6e0618f42318e38db97e20f`  
**Engineering branch:** `engineering/sprint-12-wave-1`  
**Trigger:** `docs/HANDOFF-MEDIA-ENGINEERING-001_RC-006-Photograph-Pipeline-Request.md` on media PR `#14`

## Context

Sprint 11.5 established governed media sidecars, four deterministic derivative profiles and privacy, rights, provenance and evidentiary metadata. The media schema advertised photographs, scans and specimen images, but the implementation remained an illustration-only pilot:

- `scripts/process-media.mjs` read every source as UTF-8 SVG;
- the derivative schema required `image/svg+xml` for every profile;
- `scripts/validate-media.mjs` required every asset to be `illustrative-not-evidence` with a synthetic label;
- no governed path applied EXIF orientation, stripped public metadata or generated JPEG/PNG derivatives;
- the five existing Atlas illustrations were valid and had to remain byte-stable.

Media therefore could not complete a real-photograph G5 package even where rights, provenance and specimen-identity evidence were available.

## Decision

Implement one general raster path alongside the existing SVG path.

1. **Accepted governed raster inputs:** JPEG and PNG for `photograph`, `specimen-image` and `scan` media types.
2. **Private originals:** raster originals must be stored beneath `atlas-repository/media-sources/`, outside the public derivative path, with SHA-256 calculated over the retained source bytes.
3. **Orientation:** JPEG EXIF orientation values 1–8 are applied before resizing.
4. **Public metadata:** public raster derivatives are re-encoded without EXIF or textual metadata; `privacy.exifRetained` and `privacy.gpsRetained` must both be `false`.
5. **Derivative geometry:** `thumb`, `card`, `display` and `archive` remain bounding-box profiles. Raster images are resized proportionally to fit and are never enlarged beyond the oriented source dimensions.
6. **Output format:** JPEG sources produce JPEG derivatives; PNG sources produce PNG derivatives. MIME type, encoded dimensions, checksum and lineage are recorded per derivative.
7. **Evidence treatment:** synthetic labels remain mandatory for `atlas-illustration` assets. Governed photographs do not require a synthetic label and may be `supporting-evidence`, `primary-evidence`, `context-only` or `illustrative-not-evidence` when the media owner supplies appropriate identity, rights, provenance and approval metadata.
8. **Existing illustrations:** the SVG rendering function and all five existing illustration derivative bytes remain unchanged. The shared manifest advances to `media-pipeline-v2.1` to record actual derivative MIME types.
9. **Implementation:** use the pure-JavaScript `jpeg-js` 0.4.4 and `pngjs` 7.0.0 packages so the same deterministic path runs under the repository's Node 24 CI, local validation and static production build without an operating-system image service.
10. **Scope:** no RC-specific processor branch, no automatic media approval, no rights inference and no publication of a candidate photograph are introduced.

## Alternatives considered

### Retain the SVG-only pipeline and require manual photograph preparation

Rejected. Manual derivative creation would make orientation, dimensions, metadata stripping and checksums difficult to reproduce and would leave CI unable to verify the transformation.

### Use native `sharp` / libvips processing

Deferred. It offers stronger performance and broader colour-management support, but introduces platform-specific native packages and a substantially larger lock/runtime surface for the current small corpus. It may replace the pure-JavaScript path if measured scale or quality evidence justifies the migration.

### Convert every photograph to an SVG wrapper

Rejected. Wrapping raster bytes in SVG would obscure the actual media type, retain avoidable metadata risk and conflict with transparent derivative MIME governance.

### Upscale small sources to fixed profile dimensions

Rejected. Upscaling creates apparent detail not present in the governed source and weakens evidentiary transparency. Profile dimensions are maximum bounds, not mandatory enlargement targets.

### Strip metadata from the preserved original

Rejected. The original is retained privately for provenance and audit. Privacy controls apply to public derivatives; access to originals remains governed.

## Rationale

The decision closes the mismatch between the media contract and executable implementation with the smallest general solution. It retains the established profile vocabulary and sidecar lineage model, preserves existing illustrations, adds no cultivar-specific logic and converts privacy and evidence requirements into testable repository invariants.

Pure-JavaScript codecs are slower than native image libraries but avoid divergent local, CI and deployment binaries at the current corpus scale. Fixed encoding parameters, byte hashing and check mode make the outputs reproducible.

## Supporting authorities

Repository authorities:

- `docs/MEDIA-002_Visual-Asset-Governance-and-Pipeline_v1.0.md`;
- `docs/DR-011-002_Governed-Media-Derivatives.md`;
- `docs/HANDOFF-MEDIA-ENGINEERING-001_RC-006-Photograph-Pipeline-Request.md`;
- `schemas/media.schema.json` and `atlas-repository/schemas/media.schema.json`;
- CIPA DC-008-Translation-2026, *Exchangeable image file format for digital still cameras: Exif Version 3.1*;
- W3C, *Portable Network Graphics (PNG) Specification, Third Edition*;
- `jpeg-js` 0.4.4 package documentation and BSD-3-Clause licence;
- `pngjs` 7.0.0 package documentation and MIT licence.

## Expected benefits

- enables a real governed photograph to reach G5;
- applies camera orientation deterministically;
- prevents EXIF/GPS and text metadata from leaking into public derivatives;
- preserves source bytes and transformation lineage;
- prevents derivative upscaling;
- allows evidence status to match the actual visual and identity evidence;
- preserves the existing five illustration assets and their checksums;
- gives media a repeatable local/CI workflow rather than a manual preparation exception.

## Drawbacks and risks

- pure-JavaScript JPEG processing is slower and more memory-intensive than native libvips;
- JPEG derivatives are re-encoded and therefore incur controlled lossy transformation;
- the initial implementation supports JPEG and PNG only, not HEIC, TIFF, WebP or AVIF;
- colour-profile preservation is intentionally not part of this privacy-first derivative path;
- large source files can create CI memory pressure, requiring future size/dimension limits based on measured evidence;
- upstream codec security advisories require dependency review.

## Review history

- 2026-07-27 — media documented the blocking implementation mismatch in PR `#14`.
- 2026-07-27 — CTO confirmed the schema/processor/validator mismatch against current `main`.
- 2026-07-27 — this decision selected the general JPEG/PNG implementation and required illustration/raster regression coverage.
- Merge of the associated engineering PR will constitute technical acceptance; it will not approve any media asset or G5 handoff.

## Evidence that could change the decision

Reconsider the codec or processing architecture if any of the following occurs:

- measured Wave 1 processing time or memory exceeds CI/deployment limits;
- visual comparison shows unacceptable JPEG degradation;
- colour-managed scientific or specimen imaging becomes a publication requirement;
- a supported native image dependency becomes operationally simpler and demonstrably reproducible;
- the corpus requires HEIC, TIFF, WebP or AVIF ingestion;
- a security advisory affects either codec dependency;
- media governance changes the private-original or public-metadata policy.
