# MEDIA-001 — Asset Quality and Metadata Checklist

Use before selecting an asset, creating a media sidecar or submitting G5.

## A. Candidate and rights

- [ ] Stable candidate ID and RC identifier assigned.
- [ ] Editorial cultivar assignment and required role confirmed.
- [ ] Item-level source page and access date recorded.
- [ ] Creator, contributor and rights holder identified.
- [ ] Exact licence version/URI or written permission preserved.
- [ ] Publication, crop, resize, re-encode and derivative permission confirmed.
- [ ] Attribution and change-notice wording recorded.
- [ ] Commercial/non-commercial, duration, territory, fee, expiry and takedown terms recorded where relevant.
- [ ] No rights conclusion inferred from public availability.

## B. Original source preservation

- [ ] Original bytes obtained through the licensor/contributor/item-level original-file route.
- [ ] Original stored unchanged beneath `atlas-repository/media-sources/rc-###/`.
- [ ] Original filename and acquisition method recorded.
- [ ] SHA-256 calculated over preserved original bytes.
- [ ] Actual MIME type, width, height and file size recorded.
- [ ] Capture/creation date recorded where known.
- [ ] Source page, permanent revision or correspondence evidence retained.

## C. Specimen identity

- [ ] Depicted specimen/accession identified as precisely as evidence allows.
- [ ] Identity assertion source recorded.
- [ ] Accession, nursery chain, contributor statement or label evidence preserved.
- [ ] Confidence and limitations stated.
- [ ] Filename, colour and visual resemblance are not treated as authentication.
- [ ] Confusing cultivars and spelling variants addressed.
- [ ] Evidentiary status matches identity strength.

## D. Subject and botanical usefulness

- [ ] Required visual role is actually visible.
- [ ] Season and developmental stage are recorded.
- [ ] Whole-plant framing shows architecture where required.
- [ ] Diagnostic detail is in focus and includes scale where needed.
- [ ] Exposure, colour workflow, pruning, graft, stress or training context is recorded where material.
- [ ] The asset does not substitute generic attractiveness for diagnostic usefulness.

## E. Privacy and location

- [ ] Private EXIF/GPS reviewed.
- [ ] Public derivatives record `exifRetained:false` and `gpsRetained:false`.
- [ ] Public location granularity is no more precise than editorial need.
- [ ] Private residence, people, property identifiers and contact data are removed or approved.

## F. Accessibility and presentation

- [ ] Focal point set from visual review.
- [ ] Alt text describes the actual visible subject and role.
- [ ] Caption states subject, season, identity basis/confidence and required credit.
- [ ] Caption does not claim authentication from appearance.
- [ ] Synthetic/reconstructed material carries the mandatory conspicuous label.

## G. Derivatives

- [ ] `npm run process:media` completed.
- [ ] Thumb, card, display and archive files exist.
- [ ] Actual width, height, MIME type and SHA-256 recorded for each derivative.
- [ ] No derivative exceeds oriented source dimensions.
- [ ] Orientation is correct.
- [ ] Aspect ratio and focal subject are preserved.
- [ ] Public outputs contain no EXIF, GPS or unintended text metadata.
- [ ] No visible distortion or upscaling artefact.

## H. Approval and G5

- [ ] Contributor/provenance record complete for each selected asset.
- [ ] Media sidecar status and asset status are approved only after review.
- [ ] Approval history identifies date, authority and decision basis.
- [ ] Coverage matrix updated without claiming unearned coverage.
- [ ] `npm run validate:media` and `npm run process:media:check` pass.
- [ ] G5 packet lists every unresolved right, identity, privacy or coverage issue.
- [ ] Assessment is PASS, CONDITIONAL or BLOCKED under the governing rule.
