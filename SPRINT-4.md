# Sprint 4 — Repository Discovery Services

## Release status

Implemented.

## Capability shipped

Sprint 4 transforms the normalized repository introduced in Sprint 3 into a
usable discovery service.

The Atlas can now:

- combine free-text search with field-qualified queries;
- generate filter facets from normalized repository objects;
- filter by species, habit, leaf form, light, size, and autumn colour;
- rank results by relevance;
- preserve discovery state in the browser URL;
- expose removable active-filter chips;
- maintain a persistent two-cultivar comparison tray;
- calculate similar cultivars from standardized repository fields;
- explain the fields that contributed to similarity.

## Search grammar

Examples:

- `red upright`
- `species:"Acer palmatum"`
- `habit:weeping`
- `leaf:dissected`
- `light:"partial shade"`
- `autumn:crimson`

Supported field aliases:

- `species`
- `habit`
- `leaf`
- `light`
- `size`
- `spring`
- `summer`
- `autumn`
- `fall`
- `bark`
- `status`

## Architecture

Knowledge layer:

- normalized cultivar objects

Service layer:

- query tokenization
- field-aware matching
- relevance ranking
- facet generation
- similarity scoring

Presentation layer:

- advanced explorer
- URL-addressable discovery state
- comparison tray
- similar-cultivar panels

## Important limitation

The discovery and service implementation is operational. The five cultivar
records remain provisional pilot content until the frozen RC-001 through
RC-005 records are normalized.

## Next sprint

Sprint 5 will implement the media system and the first standardized Atlas
visual identity plates.
