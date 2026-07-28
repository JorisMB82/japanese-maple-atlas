# CATALOGUE-001 — Catalogue Profile Specification v0.1

**Status:** PROPOSED CONTRACT — Stage A design; implementation not yet authorised  
**Related Decision Record:** DR-STRATEGY-001  
**Related roadmap addendum:** ROADMAP-002A v0.1  
**Inspected `main`:** `8f950fd53902ea68bdce8997f7005584906bd562`

## 1. Purpose

A Catalogue Profile is the Atlas’s scalable publication class for useful, reviewed and honestly qualified cultivar information.

It is not a reduced Reference Standard. It is a separate publication contract designed for controlled speed, batch production and transparent uncertainty.

The contract must remain small enough that ordinary low-risk profiles can be produced in batches without recreating G1–G9.

## 2. Publication classes

The Atlas supports two public publication classes:

- `catalogue-profile`
- `reference-standard`

Both classes describe one stable cultivar identity. Publication class is assurance metadata, not a second cultivar entity.

## 3. Proposed canonical input

The Catalogue MVP should use one structured input object per cultivar:

`atlas-repository/catalogue-profiles/CUL-######.json`

The input should contain the lean profile, compact source citations, risk assessment, media state and revision metadata in one reviewable file.

This design avoids three or more mandatory editorial files for every low-risk profile. Approved media assets remain governed through the shared media system and are referenced by stable media IDs.

The exact JSON schema will be implemented in Stage C after this contract is approved.

## 4. Required fields

### Identity

- `cultivarId` — stable `CUL-######` identity;
- `slug` — stable public route slug;
- `acceptedWorkingName`;
- `cultivarEpithet`;
- `taxonId`;
- `scientificName`;
- `entityType`;
- `duplicateCheck` — date, reviewer and compared aliases/entities;
- `namingVariants` — only materially useful forms;
- `identityNotes` — concise limits or conflicts.

### Publication and review

- `publicationClass: catalogue-profile`;
- `profileVersion`;
- `catalogueState`;
- `riskLevel`;
- `riskReasons`;
- `reviewedBy`;
- `reviewedAt`;
- `publishedAt` or `null`;
- `lastRevisedAt`;
- `batchId`;
- `promotionStatus`;
- `referenceStandardId` or `null`.

### Useful horticultural content

- concise summary;
- habit and architecture;
- leaf form;
- spring characteristics;
- summer characteristics;
- autumn characteristics;
- winter, bark, flower or fruit note only where useful;
- approximate published height and spread range with source qualification;
- exposure and cultivation summary;
- diagnostic or comparison notes;
- confidence statement;
- unresolved material issue, where one exists.

### Sources

- compact `sources` array;
- stable source ID within the profile;
- source class;
- title or institutional record name;
- publisher/authority;
- URL or repository locator;
- access/publication date where available;
- concise locator;
- claims supported;
- limitations;
- confidence.

### Media

- `mediaState`;
- approved primary media ID or `null`;
- governed-gap reason where applicable;
- candidate IDs where useful;
- visual-complete flag;
- identity basis summary;
- caption and alt text for an approved visual.

## 5. Content minimum

A normal low-risk Catalogue Profile should be useful enough to answer:

1. What cultivar is this profile about?
2. Which taxon is supported?
3. What are the materially useful naming variants?
4. What general habit and scale should a user expect?
5. What is the leaf form?
6. How does the plant change through spring, summer and autumn?
7. What basic cultivation conditions are supported?
8. What traits help compare it with related cultivars?
9. How confident is the Atlas, and what remains uncertain?
10. What sources and visual status support the profile?

## 6. Content not routinely required

A low-risk Catalogue Profile does not routinely require:

- a complete historical investigation;
- seven full evidence domains;
- a separate evidence matrix;
- a complete unresolved-research register;
- a complete rejected-claims register;
- multiple specimen records;
- several seasonal images;
- a unique Decision Record;
- individual owner approval;
- G1–G9.

The specific risk may require one of these elements, but they must not become universal defaults.

## 7. Catalogue workflow

### C0 — Assigned and duplicate-checked

Requirements:

- owner-approved cohort slot;
- stable cultivar identity assigned;
- supported taxon or explicit taxon request;
- duplicate and alias check complete;
- initial risk level recorded.

Output: assigned profile shell or structured work item.

### C1 — Content and evidence ready

Requirements:

- minimum identity and horticultural content complete;
- source minimum met;
- material conflicts disclosed;
- risk level confirmed;
- editorial review complete.

Output: publication candidate.

### C2 — Visual state resolved

Passes through either:

- one approved, rights-compliant primary visual; or
- an explicit governed visual gap.

A candidate photograph alone does not pass C2.

Output: approved media reference or transparent gap state.

### C3 — Validated and batch-published

Requirements:

- batch review record complete;
- no concealed high-risk exception;
- schema, identity, media, repository, search, graph, route, build and regression validation pass;
- protected PR merge path passes;
- production inspection records publication and visual state.

Output: public Catalogue Profile with revision history.

## 8. Risk model

### LOW RISK

Typical indicators:

- consistent accepted working name;
- supported taxon;
- no serious synonym conflict;
- compatible credible descriptions;
- no material identity dispute;
- visual approved or governed gap available.

Treatment:

- batch editorial review;
- standard source minimum;
- automated validation;
- no individual owner decision.

### MEDIUM RISK

Typical indicators:

- spelling or romanisation variants;
- inconsistent dimensions;
- limited historical uncertainty;
- modest source conflict;
- incomplete but potentially resolvable media provenance;
- a narrow identity question that does not invalidate the whole profile.

Treatment:

- identify the exact risk;
- add only the targeted review needed;
- document the resolution or residual uncertainty;
- escalate to the owner only if it materially affects public trust or cohort assignment.

### HIGH RISK

Typical indicators:

- disputed identity;
- confused or commercially reassigned synonyms;
- unsupported taxon;
- contradictory core morphology;
- weak evidence;
- misleading or unverifiable photographs;
- unresolved legal or rights issue;
- a conflict that cannot be honestly summarized in a normal profile.

Treatment:

- do not publish in a routine batch;
- keep draft, seek specialist review or nominate for Reference Standard treatment;
- never conceal the exception to preserve batch throughput.

## 9. Source minimum

### Low-risk default

Use two to five credible sources.

A one-source exception is allowed only when:

- the source is authoritative and adequately supports the lean profile;
- the record remains low risk;
- the exception is explicit in the batch review;
- no unsupported synonym, provenance or identity certainty is introduced.

### Acceptable source classes

- recognised taxonomic authority;
- cultivar registry or established horticultural authority;
- botanical garden, arboretum, herbarium or living collection;
- university extension or public research institution;
- established specialist nursery or trade source, used with commercial-claim qualification;
- archival or historical source where relevant;
- documented Atlas observation for clearly labelled observation claims, never as sole cultivar-authentication evidence.

### Non-negotiable source safeguards

- no fabricated source or locator;
- no unsupported certainty;
- no hidden identity dispute;
- no false synonym equivalence;
- no unqualified copied commercial claim;
- no AI-generated factual assertion published without human review and source support.

## 10. Media minimum

A Catalogue Profile may reach C2 through one of two states:

### Approved primary visual

Required:

- creator;
- rights holder;
- licence or permission;
- source and attribution;
- preserved source checksum;
- basic specimen-identity basis;
- privacy treatment;
- caption;
- alt text;
- deterministic derivatives and validation.

### Governed visual gap

Required:

- explicit reason;
- no generic substitute presented as the cultivar;
- profile not counted as visual-complete;
- backfill task retained in the media register;
- public interface clearly indicates the missing approved visual.

Additional habit, foliage-detail, seasonal, bark, flower, fruit and archival views are encouraged but not required for ordinary Catalogue publication.

## 11. Media states

Controlled public and repository states should include:

- `primary-visual-approved`;
- `visual-candidate-under-review`;
- `governed-visual-gap`;
- `non-evidentiary-illustration`.

Specimen identity should be recorded separately as:

- `documented`;
- `asserted`;
- `uncertain`;
- `not-applicable` for non-specimen illustrations.

Availability, filename, label or visual resemblance does not equal authentication.

## 12. Batch review and publication

The first Catalogue production cohort covers programme slots 011–025 in three batches of five.

The CTO may merge and publish a batch after the Project Owner approves the actual cohort assignments and final batch-publication policy when:

- all records are low risk, or medium risks are explicitly and adequately resolved;
- editorial minimums pass;
- C2 media state is approved or a governed gap is recorded;
- all automated validation passes;
- the batch review record lists risks, exceptions and metrics;
- no high-risk record is concealed.

Individual owner approval is not required for each routine low-risk profile.

## 13. Promotion to Reference Standard

A Catalogue Profile may be nominated for Reference Standard promotion based on:

- high traffic or user demand;
- collector or institutional nomination;
- repeated misidentification;
- disputed nomenclature;
- strong new evidence;
- comparison-architecture importance;
- strategic programme selection.

Promotion:

- preserves `cultivarId`, slug, sources, media and revision history;
- adds a distinct `referenceStandardId`;
- creates the full RC record and sidecars;
- passes G1–G9;
- requires individual G8 owner approval;
- does not create a duplicate cultivar page.

## 14. Public transparency

Every public profile should expose:

- publication-class badge;
- short explanation of that class;
- confidence/risk label appropriate for public use;
- media state;
- source count;
- last reviewed date;
- revision and promotion history;
- link to deeper evidence where available.

Catalogue Profiles must be described as useful, reviewed and qualified—not inferior. Reference Standards must be described as deeply governed—not infallible.

## 15. Validation expectations

The Catalogue MVP must add generic validation for:

- stable identity and duplicate detection;
- taxon support;
- required fields and controlled vocabularies;
- source IDs, locators and claim links;
- risk and state transitions;
- media state and rights requirements;
- publication and revision history;
- route and redirect stability;
- search, graph and comparison inclusion;
- generated-output drift;
- batch inventory and manifest counts;
- production build and static regression.

## 16. Metrics

Per batch record:

- assigned profiles;
- published profiles;
- median cycle time;
- editorial effort per profile;
- media effort per profile;
- approved-primary percentage;
- governed-gap percentage;
- risk distribution;
- blocked percentage;
- correction rate;
- source count;
- owner escalations.

The contract should be revised if these metrics show that the Catalogue path is becoming either unreliable or unnecessarily heavy.
