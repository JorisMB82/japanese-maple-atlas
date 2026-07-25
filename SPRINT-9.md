# Sprint 9 — Knowledge Graph and Cultivar Relationships

## Status

Implementation complete and ready for review.

## Capability shipped

- governed relationship vocabulary with ten first-class relationship types;
- twenty-six evidence-linked relationship objects;
- cultivar and accepted-taxon graph nodes;
- directed and symmetric relationship semantics;
- inverse labels, strength, confidence, rationale and structured properties;
- compiler resolution of relationship evidence selectors to assertion and source identifiers;
- deterministic graph index with nodes, edges, adjacency, statistics and independent graph hash;
- repository traversal, shortest-path, pairwise relationship and related-cultivar services;
- interactive `/graph` application route;
- graph-aware cultivar profiles and repository inventory;
- relationship, relationship-type, graph-index and manifest schemas;
- dedicated graph validation integrated into the production validation chain;
- full graph architecture and governance documentation.

## Repository output

- Repository version: 0.9.0
- Atlas Compiler: 1.2.0
- Cultivar nodes: 5
- Taxon nodes: 2
- Graph nodes: 7
- Relationship objects / graph edges: 26
- Relationship types: 10
- Repository object total: 235
- Connected components: 1
- Repository hash: `a0ca2ee5e21122937003887086f376e49e598dc9575c5c04623a569e0b1962f4`
- Graph hash: `15f2e580a9bbd6bc09d80501cbf3faae83b8bf5b04f582119ebbf3960be50071`

## Canonicality boundary

RC-001 through RC-005 remain compiled from the frozen Reference Standards. Sprint 9 adds governed relationships over existing entities and assertions. Graph edges do not establish clonal authentication, synonymy, parentage or genetic identity unless a future relationship type is expressly approved for that purpose.

## Final verification

- Contributor input validation: PASS.
- Atlas Compiler deterministic drift check: PASS.
- Repository integrity validation: PASS — 235 objects.
- Semantic search validation: PASS.
- Knowledge graph validation: PASS — 7 nodes, 26 edges, 10 relationship types.
- Production Next.js build: PASS.
- Vercel preview deployment: READY.
- `package.json` and `package-lock.json`: synchronised at version 0.9.0.
- Temporary finalisation workflow and helper: removed.

## Review and merge

Review pull request #4 and use **Squash and merge**. Suggested squash title:

`Sprint 9: implement knowledge graph and cultivar relationships`

After Sprint 9 is merged, execute Sprint 9.5 testing and quality infrastructure before beginning Sprint 10 interactive Atlas explorer work.
