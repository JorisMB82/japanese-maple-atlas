# HANDOFF-MEDIA-ENGINEERING-001 — RC-006 Photograph Pipeline Request

**Request status:** RESOLVED  
**Original media request baseline:** `9c9ec5f239f915ffda3bb3115569d57afa3d663a`  
**Reconciled main:** `56169aa9fe3e21231f1a680bb6f97d4230192780`  
**Media branch:** `media/rc-006-010`  
**Engineering PR:** #17  
**Engineering squash commit:** `a010c2c8ee76dbd8735d1390e09aa06664b1b009`  
**Active engineering handoff:** `docs/HANDOFF-ENGINEERING-MEDIA-001_Governed-Photograph-Pipeline.md`  
**Decision Record:** `docs/DR-012-001_Governed-Raster-Photograph-Derivatives.md`

## 1. Original issue

PR #14 demonstrated that media-v2 advertised photographs and specimen images while the original Sprint 11.5 processor, derivative schema and validator were SVG/illustration-specific. A real photograph could not pass without false synthetic metadata.

## 2. Engineering resolution

PR #17 implemented and merged a generic governed raster route that:

- accepts JPEG and PNG photographs, specimen images and scans;
- detects source bytes rather than trusting file extensions;
- applies EXIF orientation values 1–8;
- creates proportional `thumb`, `card`, `display` and `archive` derivatives;
- never upscales beyond oriented source dimensions;
- strips EXIF, GPS and textual metadata from public outputs;
- verifies original and derivative SHA-256, MIME type, dimensions and lineage;
- preserves raster originals beneath `atlas-repository/media-sources/`;
- requires synthetic labels only for Atlas illustrations/reconstructions;
- permits photograph evidence statuses conditionally on substantive identity metadata;
- preserves the existing RC-001–RC-005 SVG outputs.

Engineering reports the full repository-quality workflow passed at the validated implementation head and the merged capability is active on main.

## 3. Closure assessment

**Engineering dependency: PASS / RESOLVED.** No further processor, validator or schema action is requested by this handoff.

The resolution does not approve any candidate asset. Media still owns candidate selection, exact rights/licence conclusions, original-byte preservation, provenance records, specimen-identity confidence, privacy treatment, caption/alt text, sidecars, derivative inspection and G5 decisions.

## 4. Remaining RC-006 blockers

- no selected original source is preserved;
- no Atlas source SHA-256 is recorded;
- JCRA permission and image-to-accession mapping remain pending;
- open-licence candidates require item-level acquisition, visual review and identity qualification;
- scaled leaf detail remains a gap;
- no approved `RC-006.media.json` or approved governed-gap sidecar exists;
- RC-006 remains G4 CONDITIONAL.

## 5. Next receiver

Media continues the governed candidate and rights workflow. Engineering/integration receives the completed G5 packet only after a compliant asset or approved governed gap exists. Any newly demonstrated processor/schema defect will be returned through a new structured request rather than reopening this resolved record.
