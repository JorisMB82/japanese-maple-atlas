# REPOSITORY-001 — Atlas Object Model

The operational repository uses seven first-class object types: Cultivar, Taxon, Assertion, Evidence, Source, Relationship, and Media. Object files are immutable by identifier; substantive changes are version-controlled through Git. The service layer hydrates those objects into presentation-ready records without making presentation fields canonical.

## Identifier namespaces
- `RC-###` cultivar reference records
- `TAX-*` taxonomic entities
- `AST-######` assertions
- `EVD-######` evidence
- `SRC-######` sources
- `REL-######` relationships
- `MED-*` media objects

## Integrity rules
Every foreign-key identifier must resolve. Assertions belong to one subject and may reference multiple evidence items. Evidence references one source. Relationships join two cultivar objects. Media may reserve an intended asset before a file exists.
