# MEDIA-005 — RC-006 ‘Osakazuki’ Acquisition Plan v1.0

**Status:** ACTIVE — candidate acquisition and rights review  
**Baseline inspected:** `56169aa9fe3e21231f1a680bb6f97d4230192780`  
**RC:** RC-006 — *Acer palmatum* ‘Osakazuki’  
**Editorial state:** G1–G3 complete; G4 CONDITIONAL  
**G5 state:** BLOCKED pending an approved source asset or approved governed-gap sidecar  
**Raster pipeline:** AVAILABLE on main through PR #17

## Required coverage

1. autumn whole-plant habit showing crown architecture and broad palmate foliage;
2. summer whole-plant habit;
3. detailed foliage with scale, upper/lower surfaces, petiole and basal form;
4. red samaras;
5. preferably the same documented accession across multiple seasons.

The primary visual must show an editorially useful role beyond generic red colour. Autumn colour alone is not cultivar-identity evidence.

## Identity constraints

- seven lobes, basal cupping, red samaras and autumn red are not independently diagnostic;
- an institutional, nursery or contributor label is asserted identity unless stronger provenance exists;
- `Osakazuki`, RHS `Ōsakazuki` and JCRA `Ōsakasuki` remain separately traceable;
- `Taihai` material is not accepted without an editorial nomenclatural decision;
- no photograph receives `primary-evidence` solely because it looks characteristic.

## Candidate route A — JCRA living collection

JCRA exposes multi-season images and living-accession records. Priority image leads include 412174 (7 May 2009), 394583 (28 August 2008), 745329 (1 October 2024), 381477 (20 November 2007), and 728247/728253 (30 November 2022).

Required before selection:

- written Atlas publication and derivative permission;
- full-size original delivery;
- creator/rightsholder and credit line;
- image-to-accession mapping, preferably accession 001085 or xx0087;
- spelling/determination clarification;
- permission to retain the original privately;
- coarse public location approval.

Disposition: `contact-pending`; strongest provenance route, not rights-cleared.

## Candidate route B — Jean-Pol GRANDMONT / Wikimedia Commons

Item-level leads:

- `Acer palmatum 'Osakazuki' JPG2a.jpg` — 2,100 × 1,400 JPEG, 2007, likely autumn whole-plant/habit, own work, CC BY-SA 3.0.
- `Acer palmatum 'Osakazuki' JPG3.jpg` — 2,496 × 1,664 JPEG, samaras and foliage, Arboretum Robert Lenoir; page records planting year 1968 and internal position; CC licence displayed at item level.
- `Acer palmatum 'Osakazuki' - R0192.JPG` — 3,888 × 2,592 JPEG, 29 May 2009, own work, CC BY 3.0; candidate summer/late-spring habit.
- `Acer palmatum 'Osakazuki' kz01.jpg` — 4,333 × 2,888 JPEG, Hackfalls Arboretum, 26 November 2017, CC BY-SA 4.0; candidate autumn context.

Required before selection:

- preserve original bytes through the item-level original-file route;
- capture the exact licence version and permanent source-page revision;
- calculate Atlas SHA-256;
- visually inspect role, crop, condition and whether multiple files depict the same specimen;
- qualify identity as named cultivated material unless accession/determination evidence is recovered;
- strip exact coordinates and public EXIF/GPS.

Disposition: `source-acquisition-pending`; rights appear compatible at item level but approval is incomplete.

## Candidate route C — NC State Extension image set

The cultivar page displays separately credited summer habit, autumn form, leaf, samara, bark and trunk images. Each file must be traced to the original creator/source and exact licence. CC BY or CC BY-SA candidates may proceed; CC BY-NC remains excluded without direct permission.

Disposition: `source-trace-pending`.

## Candidate route D — RHS herbarium

RHS specimen records are useful for seasonal and historical context but the source sidecar explicitly does not grant publication rights. No specimen image may be copied or used without item-level permission.

Disposition: `rights-blocked contextual lead`.

## Source and technical package

A selected asset must use:

```text
atlas-repository/media-sources/rc-006/<MEDIA-ID>-source.jpg
public/media/derivatives/rc-006/thumb.jpg
public/media/derivatives/rc-006/card.jpg
public/media/derivatives/rc-006/display.jpg
public/media/derivatives/rc-006/archive.jpg
```

Record actual original SHA-256, MIME type, dimensions, file size, capture date, source URL, rights evidence, identity basis, private EXIF/GPS decision and actual processor-produced derivative dimensions/checksums. No upscaling is permitted.

## Caption and alt-text frameworks

Final text is withheld until visual review. It must state the role, season, source identity basis and confidence, and must avoid claiming authentication from appearance.

Example caption structure:

> *Acer palmatum* ‘Osakazuki’, [season and role], recorded under the cultivar name by [institution/contributor and identity basis]. Appearance and seasonal colour alone do not authenticate cultivar identity. Photograph by [creator], [licence].

## Remaining blockers

1. no original candidate bytes are preserved in the repository;
2. no Atlas SHA-256 exists;
3. JCRA permission and image-to-accession mapping are pending;
4. Commons candidates require item-level source preservation and visual/identity review;
5. scaled upper/lower leaf detail remains an acquisition gap;
6. no approved sidecar or governed-gap approval exists;
7. RC-006 remains G4 CONDITIONAL.

## G5 assessment

**BLOCKED.** The raster-processing dependency is resolved, but rights, source preservation, identity review, required detail coverage, sidecar approval and G4 remain incomplete.
