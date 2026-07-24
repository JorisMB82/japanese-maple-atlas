# NORMALIZATION-001 — RC Import Protocol

## Objective

Convert each frozen Reference Standard into operational repository objects without silently rewriting or losing editorial meaning.

## Per-record sequence

1. Preserve the original Markdown under `references/RC-###/`.
2. Extract metadata and identity.
3. Extract approved, qualified, unresolved, rejected, and superseded assertions.
4. Assign stable assertion IDs.
5. Extract evidence items and assign evidence IDs.
6. Link every evidence item to a source ID.
7. Map controlled terms to VOCAB-001.
8. Validate relationships against ONTO-001.
9. Run JSON Schema validation.
10. Compare the rendered profile against the frozen document.
11. Record discrepancies before release.

## Non-negotiable rule

No inferred fact may be presented as canonical merely to fill a field. Unknown or unavailable material remains explicitly unresolved or absent.
