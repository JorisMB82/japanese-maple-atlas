# HANDOFF-MEDIA-CATALOGUE-008 — Wave 3 Tamukeyama Gallery

**Status:** COMPLETE ASSET PACKAGE — protected review required  
**Protected baseline:** `82900b9e071d733cbdccd34771454f6154a83fc8`  
**Execution branch:** `media/visual-first-assets-wave-3-tamukeyama`  
**Execution date:** 2026-07-30  
**Pull request:** `#53`

## Completed gallery

`CUL-000021` — *Acer palmatum* ‘Tamukeyama’ has one lawful `habit-primary`, one `foliage-detail` and one early-fall `seasonal-diagnostic`. The profile remains non-public, `catalogueState` remains `review-ready`, and `publishedAt` remains `null`.

## Source inventory

| Media ID | Role | Exact source | Creator | Licence | Source SHA-256 |
| --- | --- | --- | --- | --- | --- |
| `MED-CUL-000021-001` | `habit-primary` | Wikimedia Commons, `Acer palmatum 'Tamukeyama' at Coker Arboretum.jpg` | Mx. Granger | CC0 1.0 | `0270d78bd2c6f1bc2826ddae4499e2235b76d7ca418defbc1d962cb2027a2d65` |
| `MED-CUL-000021-002` | `foliage-detail` | Wikimedia Commons, `Acer palmatum var. dissectum Tamukeyama 0zz.jpg` | David J. Stang | CC BY-SA 4.0 | `4c93123977e73196a45dd3059aaf6f2e678d10ed11b25698430f8fa8890912f8` |
| `MED-CUL-000021-003` | `seasonal-diagnostic` | NC State Extension Gardener Plant Toolbox, “‘Tamukeyama’ form, Buncombe Co. NC, early fall” | Randy Harter | CC BY 4.0 | `54dd9b2885fa2e573b6cedb7f2105d2c69581e8f9458ea120fded6c2ba7adb49` |

Every exact source JPEG is preserved in `atlas-repository/media-sources/catalogue/CUL-000021/`. Four deterministic JPEG derivatives per asset carry declared SHA-256, dimensions, MIME type and source lineage. Public derivatives are produced by pixel decode/re-encode and retain no EXIF, GPS or textual metadata.

## Visual inspection

All three display derivatives were inspected after deterministic generation:

- `MED-CUL-000021-001` clearly shows the whole cascading mound and is suitable as the primary habit image;
- `MED-CUL-000021-002` is a materially distinct attached-foliage close view showing the narrow dissected divisions;
- `MED-CUL-000021-003` is a separate whole-plant early-fall frame in Buncombe County. It is used for documented seasonal context, not as proof that colour or mound form alone authenticates the cultivar.

The third source is only 442 × 315 pixels. The deterministic processor does not upscale it, so its `card`, `display` and `archive` outputs are intentionally byte-identical. Integration coverage was corrected to require unique `(mediaId, profile)` declarations and a valid SHA-256 for every derivative rather than incorrectly requiring globally unique bytes across no-upscale profiles.

## Identity controls

- All three items are `source-asserted`, not independently clone-authenticated.
- Red colour, laceleaf form and cascading habit are not treated as sufficient to distinguish ‘Tamukeyama’ from ‘Crimson Queen’, ‘Inaba-shidare’, ‘Red Dragon’ or ‘Orangeola’.
- Source taxon wording is preserved as provenance and does not alter the governed cultivar identity or taxonomy.

## Validation

Temporary acquisition workflow run `30563314746` completed successfully and:

- acquired the three exact originals and verified source-page rights evidence;
- generated and checked 12 deterministic derivatives;
- passed media, contribution, Reference Standard and Catalogue validation;
- passed Atlas and Catalogue compiler checks;
- passed schema, repository, search, graph and Explorer validation;
- passed unit, integration and coverage tests;
- passed production build, static-export regression, aggregate quality validation and release-manifest generation;
- uploaded artifact `wave3-tamukeyama-gallery`;
- committed the package and removed all temporary workflows.

This final handoff commit triggers the standard protected repository-quality workflow on the clean branch head. Its final run result is recorded in PR #53 before review.

## Controlled boundaries

This package does not:

- publish C-003 or create a public route;
- use a generic red dissectum substitute;
- infer or waive rights;
- approve a role exception;
- create a new cultivar identity;
- alter Reference Standard G5;
- merge the branch.
