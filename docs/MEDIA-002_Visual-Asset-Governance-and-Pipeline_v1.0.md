# MEDIA-002 — Visual Asset Governance and Pipeline v1.0

## Scope

This standard governs Atlas visuals for RC-001 through RC-020. It separates presentation value from identity evidence and makes rights, provenance, privacy, derivatives and editorial approval auditable.

## Accepted source classes

Original or contributed photographs, licensed or public-domain photographs, archival material, commissioned or digital illustrations, explicitly labelled synthetic or reconstructed aids, and identity diagrams may enter the pipeline. Every source remains preserved separately from generated derivatives.

## Required metadata

Each approved asset records stable identity, cultivar relationship, subject, season, creator, contributor, rights holder, licence, source path and checksum, identification status, evidentiary status, privacy treatment, caption, alt text, focal point, derivative lineage and approval history.

## Evidence boundary

Visual attractiveness is never cultivar-identification evidence. Atlas illustrations and reconstructions use the conspicuous label: **Atlas editorial reconstruction — not an observed specimen or identification evidence.** Synthetic or reconstructed media cannot silently represent a specimen observation.

## Rights and privacy

Publication requires an explicit rights holder and licence statement. EXIF and precise GPS data are removed from public derivatives unless a future Decision Record authorises retention. Public location granularity must be no more precise than editorial need. Original sources are retained for audit and replacement.

## Derivative profiles

`npm run process:media` deterministically creates four SVG profiles per source: thumb, card, display and archive. Every derivative records dimensions, MIME type, SHA-256 and `derivedFrom`. `npm run process:media:check` rejects drift.

## Coverage policy

Release minimum is one rights-cleared primary visual or an explicit governed gap. Target coverage is habit plus foliage/detail. Enhanced coverage may add seasonal habit, bark, flowers, samaras and historical material. `atlas-repository/media-coverage.json` records the RC-001–RC-020 state.

## Validation and replacement

`npm run validate:media` verifies approvals, rights, source checksums, privacy controls, conspicuous labelling, four derivative profiles and the twenty-record coverage matrix. A replacement source must preserve the old source and approval record, regenerate derivatives and update checksums through review.
