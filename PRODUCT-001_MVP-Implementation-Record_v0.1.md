# PRODUCT-001 — MVP Implementation Record

**Status:** Functional pilot scaffold

## Delivered product capabilities

The pilot implements the minimum product loop:

1. discover a cultivar;
2. inspect a structured profile;
3. compare it against another cultivar;
4. open assertions;
5. inspect linked evidence and source metadata.

## Architectural decision

The application is a repository consumer. JSON is the operational data layer; Markdown Reference Standards remain canonical editorial artifacts until their approved assertions are normalized.

## Pilot constraint

Canonical RC-001–RC-005 content was not available during this build. Therefore, seed records are explicitly marked provisional and cannot be mistaken for frozen repository knowledge.

## Acceptance threshold for the next release

Version 0.2 is achieved when all five pilot records contain:

- canonical identity data;
- approved morphology and cultivation assertions;
- evidence IDs and source citations;
- unresolved and rejected registers;
- traceability to the frozen RC document.
