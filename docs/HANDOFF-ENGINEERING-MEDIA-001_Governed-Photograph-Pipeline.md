# HANDOFF-ENGINEERING-MEDIA-001 — Governed Photograph Pipeline

**Handoff status:** READY FOR MEDIA USE  
**Inspected `main`:** `a010c2c8ee76dbd8735d1390e09aa06664b1b009`  
**Engineering branch:** `engineering/sprint-12-wave-1`  
**Validated implementation commit:** `72d161b70cbdfb41bfe6bff879f3d308ef2678da`  
**Merged implementation:** PR `#17`, squash commit `a010c2c8ee76dbd8735d1390e09aa06664b1b009`  
**Affected records:** RC-006 through RC-010; no RC-specific logic  
**Current gate:** shared engineering dependency resolved; media G5 work may resume  
**Assessment:** `PASS — available on main`  
**Validation workflow:** `30323424632` — all three jobs passed  
**Source request:** `docs/HANDOFF-MEDIA-ENGINEERING-001_RC-006-Photograph-Pipeline-Request.md`  
**Decision Record:** `docs/DR-012-001_Governed-Raster-Photograph-Derivatives.md`

## 1. Engineering response

The implementation closes the documented mismatch between the governed media schema and the executable pipeline.

Supported paths:

| Media path | Source | Public derivatives | Evidence treatment |
| --- | --- | --- | --- |
| Existing Atlas illustration | SVG | SVG `thumb`, `card`, `display`, `archive` | `illustrative-not-evidence`; synthetic label required |
| Governed photograph | JPEG or PNG | Same-format deterministic `thumb`, `card`, `display`, `archive` | evidence status determined by approved identity and provenance metadata; synthetic label not required |
| Governed specimen image or scan | JPEG or PNG | Same-format deterministic profiles | same conditional evidence treatment as photographs |

The implementation:

- detects source bytes rather than trusting extensions;
- applies JPEG EXIF orientation values 1–8 before resizing;
- fits within profile bounds while preserving aspect ratio;
- never upscales beyond oriented source dimensions;
- re-encodes public JPEG/PNG derivatives without EXIF or textual metadata;
- preserves private original bytes and verifies their SHA-256;
- verifies derivative MIME, dimensions, SHA-256 and lineage;
- requires raster originals beneath `atlas-repository/media-sources/`;
- requires public `exifRetained:false` and `gpsRetained:false`;
- preserves existing illustration rendering and derivative bytes;
- keeps rights, licence, identity, caption and evidentiary conclusions under media ownership.

## 2. Engineering changed-file set

- `package.json`
- `package-lock.json`
- `lib/raster-media.mjs`
- `scripts/process-media.mjs`
- `scripts/validate-media.mjs`
- `schemas/media.schema.json`
- `atlas-repository/schemas/media.schema.json`
- `tests/unit/media-governance.test.mjs`
- `tests/integration/media-pipeline.test.mjs`
- `docs/DR-012-001_Governed-Raster-Photograph-Derivatives.md`
- `docs/HANDOFF-ENGINEERING-MEDIA-001_Governed-Photograph-Pipeline.md`
- `docs/PROGRAMME-REGISTER_RC-001-RC-025.md`

No RC Markdown, source sidecar, media candidate, contributor record, rights conclusion, generated cultivar object or application page was changed by the engineering package.

## 3. Media-side source convention

A governed raster source must use a repository-private source path such as:

```text
/atlas-repository/media-sources/rc-006/MED-RC-006-HABIT-001-source.jpg
```

The source object retains:

- exact private source path;
- SHA-256 over the original bytes;
- preservation statement.

Media remains responsible for determining whether the retained original may include private EXIF or location data and for controlling access to it. Public derivatives must not retain EXIF, GPS or textual metadata.

## 4. Media-side derivative convention

For JPEG input, use `.jpg` derivative paths and `image/jpeg`. For PNG input, use `.png` and `image/png`.

The four profile paths should follow:

```text
/media/derivatives/rc-006/thumb.jpg
/media/derivatives/rc-006/card.jpg
/media/derivatives/rc-006/display.jpg
/media/derivatives/rc-006/archive.jpg
```

The processor calculates actual no-upscale dimensions and bytes. The media sidecar must record the resulting width, height, MIME and SHA-256 for each profile. `assetPath` must reference `display`; `thumbnailPath` must reference `thumb`.

## 5. Evidence and synthetic-label rules

### Atlas illustration

Required:

- `mediaType: atlas-illustration`;
- `evidentiaryStatus: illustrative-not-evidence`;
- conspicuous `syntheticLabel`.

### Governed photograph, scan or specimen image

Permitted after media review:

- `supporting-evidence`;
- `primary-evidence`;
- `context-only`;
- `illustrative-not-evidence`.

A synthetic label is not required merely because the asset is a photograph. Supporting or primary evidence requires substantive specimen identity, confidence and editorial-status metadata. The pipeline does not infer evidentiary status from appearance or file type.

## 6. Validation completed

Repository-quality workflow `30323424632` passed at final implementation head `72d161b70cbdfb41bfe6bff879f3d308ef2678da`:

- repository, schemas and tests — PASS;
- Native Node coverage thresholds — PASS;
- production build and static regression — PASS.

The executed chain covered:

```text
npm run process:media
npm run validate:media
npm run process:media:check
npm run validate:contributions
npm run validate:reference-standards
npm run compile:atlas:check
npm run validate:scale
npm run validate:schemas
npm run validate:repository
npm run validate:search
npm run validate:graph
npm run validate:explorer
npm run test:unit
npm run test:integration
npm run test:coverage
npm run build
npm run test:regression
npm run validate:quality
npm run release:manifest
```

Fixtures cover:

- JPEG orientation values 1–8;
- JPEG metadata stripping;
- PNG processing;
- deterministic profile generation;
- proportional no-upscale sizing;
- photograph evidence without a synthetic label;
- invalid rights, GPS, identity, path, MIME, dimension and checksum rejection;
- unchanged illustration governance and SVG output bytes.

## 7. Remaining media boundary

The technical dependency is resolved on `main`, but media must still complete:

- candidate selection;
- rights and licence approval;
- original-byte preservation and source SHA-256;
- contributor and provenance records;
- specimen-identity basis and confidence;
- public privacy treatment;
- captions and alt text;
- sidecar and derivative validation;
- a per-record G5 assessment.

No candidate photograph is approved merely because the processor accepts its file type. Technical processability is necessary but not sufficient for G5.

## 8. Ownership boundaries

Engineering owns the processor, schemas, validator, tests and deterministic derivative contract.

Media owns:

- selection and source assets;
- rights and licence conclusions;
- contributor and provenance records;
- private-source privacy handling;
- specimen-identity treatment;
- caption and alt text;
- evidentiary status recommendation;
- G5 assessment.

Engineering has not approved any candidate asset or rewritten a media conclusion.

## 9. Next receiver and requested action

**Next receiver:** media and visual-assets stream.

Media must reconcile `media/rc-006-010` onto current `main`, retain the approved planning/governance documents, process only rights-compliant candidates through the merged pipeline, and return a structured per-record G5 handoff with `PASS`, `CONDITIONAL` or `BLOCKED`.

**Stop condition:** stop before claiming G5 PASS for any record whose rights, provenance, identity, privacy or derivative validation remains incomplete. Do not create an integration branch or publish an RC.
