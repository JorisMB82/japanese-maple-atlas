# CATALOGUE-EDITORIAL-001 — Lean Authoring and Source Operations

**Status:** EDITORIAL OPERATING RECOMMENDATION — pending Project Owner and engineering review  
**Inspected `main`:** `f8aeff982c5d155ae4880a618453dc38c40f008e`  
**Applies to:** ordinary Catalogue Profiles under CATALOGUE-001 v0.1  
**Does not modify:** schemas, validators, compiler, application, media governance or Reference Standards

## 1. Operating principle

A Catalogue Profile is a compact reviewed horticultural profile, not a shortened Reference Standard. The minimum process should be strong enough to prevent identity, taxon and unsupported-claim errors while remaining suitable for five-profile batches.

The lean editorial sequence is:

1. **C0 preparation:** owner-approved slot, exact-name and alias duplicate check, supported taxon, preliminary risk.
2. **C1 source capture:** collect the minimum credible sources, deterministic locators and claim support.
3. **C1 authoring:** write the compact profile, preserve material conflicts, assign confidence and finish editorial review.
4. **C2 handoff:** give media the required primary subject and diagnostic cautions; media returns an approved visual or governed gap.
5. **C3 handoff:** engineering validates and batch-publishes after all contract conditions pass.

No unique Decision Record, complete evidence matrix or seven-domain source sidecar is required for an ordinary LOW-risk profile.

## 2. Minimum source standard review

### 2.1 Two-to-five-source default — retain

The proposed **two-to-five credible sources** default is proportionate and should remain the normal rule.

A practical source package is:

- one strong identity/name/taxon anchor;
- one independent cultivar description or living-collection record;
- one additional source when dimensions, diagnostic traits or regional cultivation need corroboration.

Four or five sources are justified where one source is narrow, archived, commercial or used only for a specific comparison. Source count should not be inflated with duplicate mirrors or multiple pages that repeat the same institutional text.

### 2.2 One-authoritative-source exception — narrow but valid

One source may be sufficient only when all conditions are met:

1. it is an authoritative institutional cultivar record;
2. it directly supports accepted name, taxon and the minimum useful horticultural description;
3. no material synonym, identity or morphology conflict is known;
4. the profile is LOW risk;
5. dimensions and cultivation remain explicitly attributed to that source;
6. the profile is marked as relying on a single-source exception;
7. later contradictory evidence triggers review.

The exception should not be used for a commercial page, a brief name-only registry entry, a single photograph, a search-result snippet or a record lacking useful locators.

### 2.3 Recommended source classes

#### Class A — preferred core sources

- recognised taxonomic or nomenclatural authority for species placement;
- institutional cultivar profile from a botanical garden, horticultural society or university;
- university extension cultivar profile;
- accessioned living-collection record with usable identity and observation data;
- governed herbarium or trial record where it adds direct value.

#### Class B — useful specialist sources

- recognised maple society or specialist collection;
- peer-reviewed or professionally edited horticultural reference;
- curated historic catalogue or digitised institutional collection;
- archived institutional profile, explicitly labelled archived.

Class B may support a profile but should not independently resolve a disputed identity when Class A sources conflict.

#### Class C — qualified commercial sources

- established specialist nursery;
- breeder or introducer page;
- current trade catalogue with identifiable publisher and date.

Class C is suitable for current trade names, availability, attributed introduction claims or comparison leads. It is not sufficient by itself for accepted taxon, synonym equivalence, original-clone authentication or a disputed core diagnostic claim.

#### Excluded as core evidence

- anonymous blogs;
- unsourced reseller text;
- marketplace listings;
- image search results;
- social-media posts without provenance;
- generative summaries;
- copied nursery descriptions whose original source cannot be identified.

## 3. Locator requirements

Every source used for a material claim needs a locator that a reviewer can deterministically revisit.

Acceptable examples:

- `section: Page title, Name Status and Synonyms`;
- `field: ultimate height 2.5–4 m; time to maturity 10–20 years`;
- `paragraph: cultivar description beginning “A compact, bushy shrub…”`;
- `accession: 030154 — received 2003; measured 6 ft in 2022`;
- `specimen: WSY0056503 — collected 15 July 1995`;
- `entry: 2015 Maple of the Year — Acer palmatum 'Mikawa yatsubusa'`.

A page title or homepage URL alone is insufficient when the page contains multiple taxa or a mixture of species and cultivar content.

For dynamic pages, preserve the institution, record title, stable identifier, URL and access date. For archived pages, record the archive status and capture date where available.

## 4. Claim-support requirements

A Catalogue Profile does not need an assertion matrix, but each material statement must map to one or more compact source IDs.

Material claims include:

- accepted working name and supported taxon;
- materially useful synonym or alias;
- core habit and leaf form;
- defining seasonal trajectory;
- published height and spread;
- cultivar-specific cultivation warning;
- diagnostic comparison;
- historical or introduction statement;
- confidence-limiting conflict.

The compact profile may cite source IDs at paragraph or field level. Generic *Acer palmatum* cultivation must be labelled as species-level guidance and must not be presented as a cultivar trial result.

Claims that cannot be supported are omitted, qualified as a source-reported claim or retained as an unresolved material issue. The profile must not manufacture consensus by averaging incompatible source statements.

## 5. Commercial-source operation

Use a commercial source only when it contributes information not adequately supplied by stronger sources.

Required qualification:

- identify the company and its role, such as introducer, specialist nursery or reseller;
- state whether the claim is commercial, historical, descriptive or availability-related;
- do not inherit promotional superlatives;
- do not treat a current product label as proof of synonymy;
- compare mature dimensions and colour claims against institutional sources;
- preserve trademark and cultivar-name distinctions where relevant;
- route media rights separately to the media stream.

A commercial claim that conflicts with an institutional source is not silently discarded. Record the conflict if material, then use the stronger evidence or stop the profile for targeted review.

## 6. Medium-risk targeted review

MEDIUM risk adds a bounded review, not a second Reference Standard workflow.

The record should contain:

1. one sentence defining the issue;
2. the source forms or conflicting claims;
3. at least one independent corroborating source where feasible;
4. an editorial treatment;
5. the residual uncertainty;
6. the condition that would trigger escalation.

Examples:

- romanisation: choose an accepted display form and retain variants for search;
- dimensions: report source-qualified ranges rather than a synthesized maximum;
- synonym: record current authority treatment while leaving historical priority unresolved;
- taxon: establish the supported taxon and retain taxon-mismatched labels as aliases only where justified;
- archived profile: use with an explicit archival limitation.

The targeted review should normally add **0.5–2.0 hours** and one additional source, not a full evidence matrix.

## 7. High-risk escalation

A HIGH-risk record must not be included in a routine publication batch.

Editorial options are:

- hold as an unpublished Catalogue draft;
- replace the slot;
- request a taxon or vocabulary change from engineering;
- request a Project Owner identity decision;
- nominate the cultivar for Reference Standard consideration;
- commission focused external botanical or nomenclatural review.

Escalation is required when identity cannot be stabilized, probable duplicates remain unresolved, core morphology is contradictory, the source base is weak, commercial renaming is material or a supported taxon is absent.

## 8. Human-readable Catalogue authoring map

This map is a content guide for the future JSON contract. It does not prescribe field names beyond the approved engineering specification.

### Identity

Record the programme-approved cultivar, supported taxon, exact accepted working name, materially useful variants, duplicate-check result and a one- or two-sentence identity limit.

### Concise summary

Write 40–80 words answering what the plant is, its main habit, leaf type and strongest seasonal or diagnostic interest. Avoid origin stories unless directly supported.

### Habit and architecture

State upright, spreading, rounded, cascading, mound-forming, compact or larger-scale expression. Distinguish crown architecture from leaf shape. Qualify pruning, grafting, age and site effects where material.

### Leaf form

State palmate, dissected, linearilobum or other useful form; include approximate lobe count only when source-supported and diagnostically useful. Do not imply that one leaf authenticates the clone.

### Spring, summer and autumn

Describe the seasonal trajectory. Use ranges or source attribution when colour differs. Do not use one fixed digital colour as a biological guarantee.

### Approximate published size

Report source-qualified height and spread, preferably as named ranges. Do not average incompatible estimates or convert a ten-year observation into a universal mature maximum.

### Cultivation

Provide compact exposure, moisture, soil and hardiness guidance. Separate cultivar-specific evidence from general Japanese-maple practice. Include scorch, frost or reversion cautions only where relevant.

### Diagnostic and comparison notes

Give two or three traits that help compare the cultivar with existing Atlas identities. Explicitly state the closest likely confusion. This is descriptive comparison, not clonal authentication.

### Confidence

Use a concise statement such as:

- high for name, habit and leaf form;
- moderate for mature dimensions;
- low for original provenance;
- appearance alone does not authenticate an individual plant.

Only material uncertainty belongs in the public profile. A complete unresolved-research register is not required.

### Compact sources

For each source include authority, source class, record title, URL/locator, access/publication date, supported claims, limitation and confidence. Two to five sources is normal.

### Risk

Record LOW, MEDIUM or HIGH, the precise reason and the review outcome. Risk is operational metadata, not a public quality score unless the interface is specifically designed to explain it.

### Media state

Record approved primary media ID or `null`, media state, visual-gap reason where applicable, identity basis and public caption/alt text only after media approval. Editorial defines the required subject but does not approve rights.

### Revision history

Record initial assignment, C1 review, material correction, risk change, publication, later revision and Reference Standard nomination or promotion. Ordinary copy edits may be grouped in one revision entry.

## 9. Lean review checklist

A LOW-risk C1 candidate is ready when:

- exact identity and taxon are supported;
- duplicate check covers aliases and existing RC/Catalogue entities;
- two to five credible sources are present, or the one-source exception is justified;
- every material claim has a source;
- dimensions and seasonal expression remain qualified;
- comparison language does not imply authentication;
- no unresolved material conflict is hidden;
- media requirements are specific enough for C2;
- risk and confidence are recorded;
- the profile contains no Reference Standard gate or freeze language.

## 10. Throughput assumptions

Estimated editorial effort after schema readiness:

| Profile type | Estimated hours | Typical source count | Review pattern |
| --- | ---: | ---: | --- |
| LOW, strong institutional coverage | 4–6 | 2–4 | one authoring pass plus review |
| LOW, one-source exception | 3–4 | 1 | explicit exception review |
| MEDIUM, bounded naming/dimension issue | 6–9 | 3–5 | one targeted review pass |
| HIGH | not scheduled routinely | variable | hold, replace or escalate |

A five-profile LOW-risk batch should require approximately **25–35 editorial hours** plus media and engineering time. Calendar cycle is expected to be **7–12 working days** when source and media work run in parallel and no rights acquisition is delayed.

## 11. Recommended changes to CATALOGUE-001 v0.1

Only five clarifications are recommended for the future approved contract:

1. state the seven conditions for the one-authoritative-source exception;
2. require deterministic source locators rather than URL-only citations;
3. require explicit claim support for identity, dimensions, diagnostic and synonym statements;
4. define commercial sources as supplementary unless the publisher is the documented introducer and the claim is appropriately scoped;
5. define MEDIUM risk as a bounded issue review and HIGH risk as a routine-batch stop condition.

No additional evidence domains, matrices, Decision Records or owner approvals should become universal Catalogue requirements.
