# ROADMAP-002 — Post-Sprint-10 RC-020 Visual Atlas Roadmap

**Version:** 1.0
**Status:** Approved and locked
**Effective date:** 2026-07-26
**Supersedes:** ROADMAP-001 — Development Roadmap (Post Sprint 6)
**Governing milestone:** Japanese Maple Atlas — RC-020 Visual Reference Release

## 1. Locked near-term objective

Transform the Atlas from a technically successful five-cultivar pilot into a credible twenty-cultivar visual and evidence-aware reference product.

The milestone requires:

- twenty completed cultivar Reference Standards, RC-001 through RC-020;
- governed, high-quality visual representation for every cultivar;
- accurate botanical drawings where suitable photographs are unavailable;
- generic and scalable compiler ingestion;
- strong evidence, rights and provenance controls;
- a production interface that makes the twenty cultivars useful for identification, comparison, learning and reference.

Public AI, broad SDK development, a full runtime API and unrelated platform expansion are deferred until this milestone is secure.

## 2. Phase 1 — Platform foundation

**Status:** Complete through Sprint 10.

The completed platform includes the repository-first architecture, deterministic compiler, validation and schema systems, structured object model, advanced search, relationship graph, Atlas Explorer, testing and quality infrastructure, accessibility remediation and production deployment architecture.

Before Sprint 11 release, confirm that the public production deployment is serving the merged Sprint 10 baseline from current `main`.

## 3. Phase 2 — RC-020 Visual Atlas milestone

At the end of Phase 2, RC-001 through RC-020 must be:

- researched and editorially reviewed;
- structurally consistent;
- supported by traceable evidence;
- compiler validated and represented in the repository;
- discoverable through the application;
- supported by governed photographs or accurate drawings;
- deployed successfully in production.

### Sprint 11 — Compiler and Repository Scale Generalisation

#### Purpose

Remove the fixed five-record boundary before large-scale RC production begins.

#### Required sequence

1. Approve the canonical RC-006+ contract.
2. Define backward-compatible treatment for RC-001 through RC-005.
3. Define the governed exception mechanism.
4. Refactor the compiler against the approved contract.
5. Prove RC-006 ingestion and synthetic scale behaviour.

The five frozen RC documents must not be rewritten merely to match the new template. Compatibility must be supplied through governed adapters or mappings.

#### Canonical RC contract

The standard RC-006+ profile must define:

- required metadata and sections;
- controlled vocabulary usage;
- identity, naming and synonym fields;
- botanical description and seasonal characteristics;
- horticultural information;
- relationship and uncertainty representation;
- media references and editorial status;
- version, approval and freeze metadata;
- source and evidence provenance.

The contract must distinguish the frozen Reference Standard from its underlying books, institutional pages, specimen records, catalogues and observations. Material claims must retain assertion-level source identity and location traceability where available.

#### Compiler generalisation

The compiler must:

- discover approved RC files automatically;
- support any conforming RC number;
- calculate object totals dynamically;
- generate media objects from governed data rather than cultivar-specific code;
- preserve RC-001 through RC-005 through external legacy adapters;
- support controlled exceptions without cultivar-specific JavaScript;
- produce record-level diagnostics;
- support preflight, dry-run and drift-check modes;
- reject malformed or incomplete records before publication;
- publish generated output transactionally so a failure leaves the last approved repository intact.

#### Governed exception registry

Every exception must identify:

- affected RC and field or rule;
- reason for the exception;
- approved mapping;
- approving Decision Record;
- effective compiler version;
- retirement condition where applicable.

#### Scale testing

Synthetic cohorts of 20, 25 and approximately 150 records must verify:

- compiler performance;
- identifier uniqueness;
- relationship and source integrity;
- dynamic object counts;
- manifest and hash generation;
- search indexing and graph coverage;
- output size and repository consistency.

#### Exit criterion

RC-006 can be added, preflighted, compiled, validated and published without adding cultivar-specific compiler source code.

**Planning duration:** one to two focused weeks.

### Sprint 11.5 — Media Governance and Visual Asset Pipeline

#### Purpose

Ensure every cultivar from RC-001 through RC-020 can receive trustworthy, attractive and legally usable visual representation through a repeatable process.

#### Supported media

- original, contributed, licensed and public-domain photographs;
- archival illustrations;
- commissioned botanical drawings;
- digitally produced botanical illustrations;
- clearly labelled synthetic or reconstructed visual aids where permitted;
- identity plates and diagrammatic illustrations.

A visually attractive asset must not automatically be treated as evidence of cultivar identity.

#### Required metadata and controls

Each asset must support governed identity, subject, season, creator, contributor, rights holder, licence, source, date, location granularity, specimen identity, identification confidence, editorial and evidentiary status, checksum, MIME type, dimensions, derivative lineage, caption, alt text, focal point and approval history.

Policies must cover EXIF handling, GPS privacy, attribution, personal data, retention and source-file preservation.

#### Existing-record uplift

Sprint 11.5 must explicitly:

- audit the existing RC-001 through RC-005 identity plates and media objects;
- migrate them into the new media model;
- establish a coverage matrix for RC-001 through RC-020;
- acquire, license or produce improved primary visuals for the original five where appropriate;
- record unresolved visual gaps.

#### Coverage tiers

- **Release minimum:** one approved, rights-cleared primary visual per cultivar.
- **Target:** a whole-plant or habit view plus a foliage or diagnostic-detail view.
- **Enhanced:** seasonal, bark, flower, samara, juvenile, mature or comparative views as evidence permits.
- **Gap handling:** a governed drawing or an explicitly documented media gap.

Synthetic or reconstructed imagery must be conspicuously labelled and must not silently represent an observed specimen or serve as primary identification evidence without an adequate evidence basis.

#### Exit criterion

Every cultivar can receive rights-compliant, traceable visual assets without an improvised manual process.

**Planning duration:** one to two weeks, partly parallel with early editorial research.

### Sprint 12 — Editorial Production System and RC-006–RC-010

Complete RC-006 through RC-010 through the full editorial pipeline:

cultivar selection → source discovery → source assessment → evidence extraction → structured drafting → conflict review → uncertainty review → cross-record review → media selection or illustration → approval → compiler preflight → repository validation → production deployment.

Each cultivar must include an approved Reference Standard, compiled objects, source and evidence records, naming and identity data, horticultural and seasonal description, supported relationships, at least one approved primary visual, accessibility text, rights metadata and a production profile available in search and comparison.

#### RC-010 formative checkpoint

Before beginning RC-011, conduct a lightweight internal and small-user review to determine whether:

- the canonical template is practical;
- profiles and galleries remain understandable;
- media classifications are clear;
- production time is sustainable;
- repeated editorial or usability problems should be corrected before ten further records are produced.

This checkpoint is not a separate sprint and does not replace formal Sprint 13 validation.

#### Exit criterion

RC-006 through RC-010 are published with consistent editorial quality and governed visual representation, and the production process has passed the RC-010 checkpoint.

### Sprint 12.1 — RC-011–RC-015 Content Wave

Complete RC-011 through RC-015 while measuring production time, improving shared-source reuse, identifying vocabulary gaps, reducing manual intervention, refining media acquisition and review checklists, and recording difficult decisions in Decision Records.

#### Exit criterion

Fifteen cultivars are production-ready and the editorial process is demonstrably repeatable.

### Sprint 12.2 — RC-016–RC-020 Content Wave

Complete RC-016 through RC-020 and stress-test comparison, synonyms, relationship density, search, variable record completeness, media coverage, visual consistency, source reuse, evidence conflicts and application performance.

#### Exit criterion

RC-001 through RC-020 are approved, compiled, visually represented and deployed.

### Sprint 13 — RC-020 Product Validation and Visual Atlas Release

Validate the twenty-cultivar product with representative collectors, gardeners, nursery professionals, botanical or plant-records professionals, writers, educators and researchers.

Test finding, synonym recognition, confidence interpretation, comparison, seasonal exploration, foliage distinctions, habit and landscape use, evidence inspection, media interpretation and recognition of identification limits.

Assess whether the Atlas provides distinctive value, is understandable without specialist training, makes confidence distinctions clear, supports useful comparison, uses accurate visuals, communicates limitations and could be cited, recommended, contributed to or reused.

Formalise the value proposition:

> The Japanese Maple Atlas is an evidence-aware, structured and visually rich reference platform for Japanese maple cultivars, combining botanical knowledge, traceable sources, governed media and practical comparison tools.

#### Exit criterion

Real users have evaluated the RC-020 Atlas, critical usability findings are resolved or documented and the product proposition is clearly expressed.

### Sprint 14 — Performance, Accessibility and Operational Hardening

Run against the real twenty-cultivar, media-rich corpus. Cover image loading and responsive behaviour, artifact and build size, compiler runtime, search, comparison, Explorer and graph performance, keyboard and screen-reader use, contrast, alt-text quality, mobile and low-bandwidth behaviour, structured metadata, SEO, canonical URLs, broken links, missing media, rights audit, dependencies, security, deployment, rollback, backup and recovery.

Performance budgets begin during Sprint 11.5; Sprint 14 performs evidence-based optimisation against the completed corpus.

#### Exit criterion

The twenty-cultivar Atlas meets defined performance, accessibility, integrity and operational thresholds.

### Sprint 15 — RC-020 Release Audit

This is the release gate for:

# Japanese Maple Atlas — RC-020 Visual Reference Release

Acceptance requires complete content review, evidence minimums, documented contradictions, naming consistency, approved media and rights, generated derivatives, reviewed captions and alt text, generic compiler ingestion, no permanent five-record assumptions, successful 150-record synthetic testing, production validation and build, verified deployment and rollback, useful search and comparison, completed user testing, resolved critical findings and stable public pages and structured outputs.

The release does not have to be called Version 1.0.

## 4. Phase 3 — RC-025 and Version 1.0 decision

After RC-020:

- complete RC-021 through RC-025;
- incorporate RC-020 product findings;
- stabilise the publication contract;
- publish versioned static data and machine-readable discovery;
- decide whether the product satisfies the Version 1.0 contract.

Approximately twenty-five strong records remain the preferred Version 1.0 threshold, but the decision is based on product and publication stability rather than record count alone.

## 5. Phase 4 — RC-026–RC-150

Treat RC-026 through RC-150 as a continuous editorial publication programme supported by periodic engineering-maintenance releases. Suggested waves are RC-026–040, RC-041–060, RC-061–080, RC-081–100, RC-101–125 and RC-126–150.

## 6. Deferred features

Until RC-020 is secure, defer:

- a public repository-aware AI assistant;
- a full runtime API and SDK suite;
- community editing;
- broad platform abstraction;
- expansion into orchids or other botanical domains.

Internal AI assistance may be used for research, drafting and quality checks when it directly accelerates governed RC production and all outputs remain subject to evidence and editorial review.

## 7. Parallel operating model

Three tracks may proceed in parallel:

- **Engineering:** compiler, validation, media pipeline, performance, deployment and interface.
- **Editorial:** cultivar selection, sources, evidence synthesis, drafting, botanical review, vocabularies and consistency.
- **Media:** acquisition, rights, provenance, illustration, derivatives, captions and accessibility.

All three meet at the repository validation and publication gate.

## 8. Priority order

1. Freeze this RC-020 milestone definition.
2. Approve the canonical RC-006+ contract.
3. Generalise the compiler and establish legacy adapters and the governed exception registry.
4. Finalise the media-governance model.
5. Select RC-006 through RC-020.
6. Begin RC-006 through RC-010 research.
7. Build the photo and drawing pipeline in parallel.
8. Publish three five-cultivar waves.
9. Validate the twenty-cultivar product with users.
10. Harden, audit and release.

## 9. Planning objective

The working target for the RC-020 Visual Reference Release is approximately six to ten weeks of focused execution. This is a planning objective, not a quality override. Evidence conflicts, rights clearance and illustration work may extend the schedule; fixed acceptance gates protect quality.

## 10. Governance and change control

This roadmap is locked as the post-Sprint-10 governing baseline. Changes require a documented Decision Record stating the proposed change, rationale, impact on the RC-020 objective, alternatives considered and approval date.
