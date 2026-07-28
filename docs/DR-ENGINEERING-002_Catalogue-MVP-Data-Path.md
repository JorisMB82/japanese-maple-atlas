# DR-ENGINEERING-002 — Catalogue MVP Data Path

**Status:** PROPOSED IMPLEMENTATION  
**Decision date:** 2026-07-28  
**Authority:** CTO / engineering under DR-STRATEGY-002  
**Related roadmap:** ROADMAP-002A Version 1.0

## Context

The two-speed model requires a generic Catalogue path before real profiles can be produced. The first implementation must establish identity, validation and compilation without publishing unapproved cultivar content or destabilising the Reference Standard compiler.

## Decision

Implement a separate Catalogue Profile input contract and in-memory compiler as the first Stage C slice.

The slice uses:

- one canonical JSON input per future Catalogue cultivar;
- stable `CUL-######` identity;
- a governed identity registry;
- JSON Schema plus semantic validation;
- explicit risk and duplicate controls;
- one approved primary visual or governed visual gap at C2;
- synthetic fixtures only until cultivar assignments are approved.

The existing Reference Standard compiler and frozen source files remain unchanged in this slice.

## Rationale

Separating the first data-path slice reduces migration risk and allows CI to verify the new contract before shared repository outputs, search, graph, routes and front-end rendering are modified.

## Safeguards

- reserved slots cannot compile as real Catalogue profiles;
- a profile identity must be explicitly assigned in the registry;
- duplicate review must resolve as unique;
- high-risk profiles cannot use routine batch approval;
- unresolved media candidates cannot publish;
- governed gaps remain visibly incomplete;
- source IDs are scoped to stable cultivar identity;
- synthetic fixtures remain outside canonical input discovery.

## Next decision

After this slice passes the protected workflow, extend the shared repository compiler and class-aware front end in the same MVP branch. No real Catalogue publication is authorised by this Decision Record.
