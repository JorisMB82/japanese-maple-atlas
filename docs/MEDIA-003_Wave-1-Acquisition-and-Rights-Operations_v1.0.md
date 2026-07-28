# MEDIA-003 — Wave 1 Acquisition and Rights Operations v1.0

**Status:** ACTIVE media operating document  
**Baseline inspected:** `56169aa9fe3e21231f1a680bb6f97d4230192780`  
**Branch:** `media/rc-006-010`  
**Governing specification:** `docs/MEDIA-002_Visual-Asset-Governance-and-Pipeline_v1.0.md`  
**Raster dependency:** RESOLVED through PR #17, squash commit `a010c2c8ee76dbd8735d1390e09aa06664b1b009`

## 1. Scope and boundary

This document governs candidate discovery, rights review, source preservation, specimen-identity treatment, privacy review, metadata preparation and G5 handoff for RC-006 through RC-010. It also preserves the RC-001 through RC-005 photographic-uplift work.

Media owns source assets, media sidecars, rights/provenance evidence, captions, alt text, focal points, privacy treatment and G5 recommendations. Media does not edit botanical RC prose, editorial source sidecars, schemas, validators, compiler/application code, generated outputs or the programme register.

Technical processability is not asset approval. A website image, visible cultivar label, filename, autumn colour or visual resemblance does not establish rights or clonal identity.

## 2. Locked Wave 1 assignments

- RC-006 — *Acer palmatum* ‘Osakazuki’
- RC-007 — *Acer palmatum* ‘Butterfly’
- RC-008 — *Acer palmatum* ‘Shishi-gashira’
- RC-009 — *Acer palmatum* ‘Katsura’
- RC-010 — *Acer palmatum* ‘Mikawa-yatsubusa’

## 3. Governed operating sequence

1. Read the merged editorial handoff and required-subject list.
2. Register each candidate before copying it into the repository.
3. Confirm item-level creator, contributor, rights holder and exact licence or written permission.
4. Determine specimen identity independently from visual quality.
5. Obtain the original source bytes through the licensor, contributor or item-level original-file route.
6. Preserve the original beneath `atlas-repository/media-sources/rc-###/` without alteration.
7. Calculate SHA-256 over the preserved original bytes and record MIME type, dimensions, file size and acquisition method.
8. Review private EXIF/GPS and personal data; public derivatives must retain neither EXIF nor precise GPS.
9. Prepare caption, alt text, focal point, role, subject, season, identity confidence and evidentiary status after visual inspection.
10. Process the source through the merged JPEG/PNG pipeline and record actual no-upscale derivative dimensions, MIME types and SHA-256 values.
11. Visually inspect thumb, card, display and archive derivatives.
12. Approve the asset, record an approved governed gap, or retain G5 as BLOCKED.
13. Submit a structured G5 packet to engineering/integration.

## 4. Candidate source hierarchy

Preferred order:

1. project-owned photography of a documented specimen;
2. contributor photography with written reuse and derivative permission;
3. commissioned photography with explicit source-file delivery and rights terms;
4. institutional photography tied to a living accession and licensed for Atlas publication;
5. item-level CC BY, CC BY-SA or CC0 material with complete provenance;
6. archival/context material with both copyright and reproduction permission resolved;
7. an approved Atlas reconstruction, conspicuously labelled as non-observational;
8. an explicit governed media gap with approved remediation ownership.

Search thumbnails, social posts, nursery marketing pages and unattributed aggregators are discovery leads only.

## 5. Rights review

For every selected asset record:

- creator and rights holder;
- contributor or supplying institution;
- exact licence name/version and URI, or written permission terms;
- whether commercial publication is permitted;
- whether cropping, resizing, re-encoding and responsive derivatives are permitted;
- mandatory attribution and change notice;
- territory, duration, fee, expiry and takedown terms where applicable;
- permission to retain the original privately for audit;
- source URL and access date;
- preserved evidence of the rights statement.

CC BY-SA material requires a compliant attribution and share-alike treatment for adapted derivatives. CC BY-NC and CC BY-ND material is not assumed compatible. Public viewability is never a licence.

## 6. Source preservation

Private governed sources use:

```text
atlas-repository/media-sources/rc-###/<MEDIA-ID>-source.jpg
atlas-repository/media-sources/rc-###/<MEDIA-ID>-source.png
```

Preserve the exact acquired bytes. Record original filename, acquisition route, source URL, access date, SHA-256, MIME type, width, height, file size, capture date where known, creator/rightsholder evidence, licence evidence, EXIF summary and specimen/accession documentation.

Do not overwrite an approved source. A replacement or augmentation receives a new media ID and approval record.

## 7. Identity and evidence treatment

Record:

- the depicted specimen or accession;
- who asserted the cultivar identity;
- accession database, institutional record, nursery chain or contributor statement supporting that assertion;
- confidence and limitations;
- whether the asset is `primary-evidence`, `supporting-evidence`, `context-only` or `illustrative-not-evidence`.

Institutional accession linkage normally supports stronger confidence than a retail label, but it still does not prove universal clonal authenticity. Appearance never upgrades identity confidence.

## 8. Privacy and public location

Private originals may retain metadata only when policy and rights permit. Public derivatives must use `exifRetained:false` and `gpsRetained:false`. Publish location no more precisely than editorial need. Exact bed, house, private-garden or GPS information stays in private provenance evidence unless separately approved.

## 9. Captions and alt text

Final text is written only after reviewing the preserved original and derivatives. It must describe visible content, identify the role and season, state the specimen-identity basis and avoid unsupported authentication language. Licence attribution belongs in the caption or adjacent credit surface where required.

## 10. G5 rule

G5 PASS requires an approved rights-cleared primary visual or an approved governed gap, complete source/rights/identity/privacy metadata, an approved media sidecar and passing derivative validation. A bounded unresolved condition may produce CONDITIONAL. Rights, source preservation, identity, required-subject or validation failures remain BLOCKED.

## 11. Reconciliation record

The earlier PR #14 planning, RC-001–RC-005 uplift priorities, candidate research, contributor workflow and handoff templates are retained. The former photograph-pipeline blocker is removed because PR #17 is merged. No candidate is promoted solely because the processor now accepts JPEG/PNG files.
