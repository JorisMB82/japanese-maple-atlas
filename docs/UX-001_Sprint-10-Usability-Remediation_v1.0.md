# UX-001 — Sprint 10 Usability Remediation

**Version:** 1.0
**Status:** Implemented before external user testing
**Scope boundary:** Post-Sprint-10 remediation only; Sprint 11 excluded

## Evidence classification

The supplied audit is an independent expert heuristic review with responsive screenshots and layout measurements. It is not observed external-user research. Findings were reproduced against the Sprint 10 source and production interface before implementation. Residual comprehension and task-success questions remain subjects for external testing.

## Decisions and resolutions

| Finding | Root cause | Resolution | Verification | Residual limitation |
|---|---|---|---|---|
| Mobile destinations hidden in a horizontal row | Nine links were constrained to a partial viewport with no scroll cue | Accessible Menu button, complete disclosed navigation, active state, Escape and route-close behavior, 44px targets | Unit source invariant and static export | Browser-level screen-reader testing remains part of external QA |
| Technical terminology before user value | Governance model carried the introductory information hierarchy | Plain horticultural task language first; evidence and repository detail retained in disclosures | Content regression and task-script review | Expert terms remain where precision is required |
| Explorer first-entry overload | Filters, examples, views, column sets, utilities and metrics were simultaneous | Common controls first; More filters, examples and data detail collapsed; columns shown only for trait table | Explorer validation, unit source invariant, mobile build regression | Pilot data is small; behavior with a much larger record set requires later testing |
| Repository horizontal overflow | SHA-256 strings imposed unbroken min-content width inside a grid | `min-width: 0`, anywhere wrapping, responsive code containers and full-value copy action | Source invariant plus static responsive build inspection | Clipboard API may be unavailable in restricted browsers; full text remains selectable |
| Research set silently compared first two | Pair semantics were inferred from selection order | Explicit A/B selectors, pair visible in CTA, deterministic URL state and Compare handoff | Unit pair tests, Explorer validation, static regression | Compare remains intentionally two-record rather than a five-record matrix |
| Long cultivar records | Dense scholarly content lacked local navigation | Sticky, responsive **On this record** anchors | Unit source invariant and route regression | Evidence depth still creates long pages by design |
| Compare loading and invalid state | Client hydration was the only path to usable controls | Accessible status fallback, explanatory recovery link, validated defaults and URL synchronization | Unit source invariant and static regression | Interactive selectors still require JavaScript |
| Saved-view browser prompt | Native prompt was disconnected and weakly validated | Product-styled dialog, local-storage explanation, required normalized name | Unit name tests and source invariant | Saved views remain browser-local by design |
| JSON-only export | Machine format was presented as the general action | Format chooser with Print/PDF, CSV and provenance-preserving JSON | Unit CSV test, Explorer validation and static regression | PDF uses the browser print pipeline rather than a server-generated document |
| Dense terminology and mobile ergonomics | Expert labels and small controls were inherited across views | Everyday labels, contextual definitions, visible focus, larger controls, concise alt text and Back to results | Source invariants and static regression | External participant vocabulary testing is still required |

## Architectural consistency

- No frozen Reference Standard was edited.
- No generated repository JSON was edited directly.
- Repository data remains v0.9.0 with 235 first-class objects.
- Explorer URL state remains deterministic.
- Evidence, uncertainty, relationship rationale and confidence remain available.
- Static export remains the deployment target.
- No new third-party dependency was introduced.

## External test gate

The remediation prepares the interface for controlled external testing. Test results—not this heuristic audit—should determine whether further comprehension changes are necessary before roadmap work resumes.
