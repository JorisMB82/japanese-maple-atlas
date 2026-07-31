# DR-ENGINEERING-004 — Scalable Maple Map View

**Status:** APPROVED FOR IMPLEMENTATION  
**Decision owner:** Project Owner  
**Decision date:** 2026-07-30  
**Implementation baseline:** `0501f5819f0d7ce6e528f9c953e91e4d649fd626`  
**Public route:** `/map`

## 1. Context

The Atlas now contains enough public cultivars and publication layers that a simple profile directory no longer communicates the overall structure. Users need a durable visual explanation of how named cultivars relate to species, practical horticultural types and the two-speed publication model.

The existing `/graph` view answers a different question. It shows evidence-linked pairwise relationships among governed repository objects. It is not a taxonomic tree and does not provide a complete big-picture view of all currently published cultivars.

## 2. Decision

Create a public **Maple Map** generated from the current published runtime data.

The page presents three separate organisational lenses:

1. **Taxonomic backbone:** genus → species → named cultivar.
2. **Practical horticultural lenses:** overlapping groupings such as upright form, dissected/cascading form, bark interest, golden foliage and red seasonal colour.
3. **Publication layer:** Reference Standard or Catalogue Profile.

The page includes only published profiles. As new profiles are published, they enter the taxonomic and publication views automatically. Practical groups are derived through transparent profile-text rules maintained in `lib/atlas-structure.mjs`.

## 3. Binding interpretation rules

- Species placement is derived from canonical `taxonId` and published taxon data.
- Horticultural groups are discovery aids, not formal botanical ranks.
- A cultivar may appear in more than one horticultural group.
- Group membership does not authenticate a specimen or prove synonymy, clonal identity or genetic relationship.
- Publication class describes evidence and governance depth; it is not a botanical rank or a quality grade for the plant.
- Stable cultivar identity remains independent of publication class.
- Only published profiles are exposed on the public map. Non-public C1/C2 work remains outside public discovery.

## 4. Architecture

The implementation adds:

- `lib/atlas-structure.mjs` — deterministic structure builder;
- `app/map/page.js` — server-rendered public view;
- `app/map.css` — responsive tree and grouping presentation;
- primary navigation entry `Map`;
- protected unit and static-export regression coverage;
- `/map` as a required production route.

No separate hand-maintained cultivar chart is introduced. The view consumes `getCultivars()` so taxonomic counts, publication counts and cultivar links remain aligned with the same published runtime used by the homepage, Explorer, comparison and Visual Library.

## 5. Alternatives considered

### Extend the existing knowledge graph

Rejected as the sole solution. The graph is relationship-centric and evidence-linked. Converting it into a complete hierarchy would blur verified relationship edges with presentational grouping.

### Maintain a static infographic

Rejected. A static graphic would become stale as profiles and species are added and would create a second source of truth.

### Use only formal taxonomy

Rejected as incomplete for ordinary horticultural users. Taxonomy explains species placement but not the practical differences between upright, dissected, bark-interest, variegated or colour-led cultivars.

## 6. Expected benefits

- gives users an immediate big-picture orientation;
- clearly separates taxonomy, horticultural grouping and publication governance;
- scales with future cultivar and species releases;
- exposes current collection gaps without publishing non-public work;
- provides a stable destination for education, navigation and future collection planning.

## 7. Drawbacks and controls

Text-derived horticultural groupings may be broader than specialist cultivar classifications. This is controlled through explicit non-taxonomic labelling, transparent matching rules, overlapping membership and profile-level links that expose the underlying evidence and qualifications.

Future evidence or a formal controlled horticultural vocabulary may justify replacing rule-based group membership with governed first-class classification objects. That change would require a separate decision record and migration plan.
