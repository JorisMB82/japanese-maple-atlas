# INTEGRATION-001 — Wave 1 Engineering Integration Contract

**Version:** 1.0  
**Status:** Ready for cross-stream use  
**Scope:** Sprint 12 / Wave 1 — RC-006 through RC-010  
**Owner:** Engineering / integration stream  
**Prepared against `main`:** `969b02db7ef27a1c80ddc02f893404945abb7f9c`  
**Governing plan:** ROADMAP-002 Version 1.1 — Approved and governing

## 1. Purpose and current readiness

This contract defines the minimum complete editorial and media handoffs that engineering will accept at G6, the validation chain engineering will run at G7, and the controlled merge and rollback procedure for the first five-record publication wave.

Current Wave 1 assessment is **CONDITIONAL — READY FOR HANDOFFS**:

- the verified repository baseline contains the five frozen public records RC-001 through RC-005 and 235 first-class objects;
- Atlas Compiler 2.0.0 and the `canonical-rc-v1` profile are present;
- media-v2 sidecars, governed source preservation, rights/privacy checks and deterministic derivatives are present;
- RC-006 through RC-010 are not yet present as publication records and remain unassigned in the repository programme register;
- no integration branch is authorised until coherent G4 editorial and G5 media packets are available.

The inspected SHA is a checkpoint only. Engineering must re-read current `main` and record its new SHA immediately before creating `integration/rc-006-010`.

## 2. Governing ownership boundary

### Editorial/content owns

- cultivar assignment and duplicate checks;
- botanical research and evidence evaluation;
- `RC-###.md` substantive content;
- `RC-###.sources.json` and source locators;
- identity, nomenclature, morphology, cultivation, history, diagnostic limits and confidence;
- editorial Decision Records and G1 through G4 approval evidence;
- relationship candidates and their botanical rationale.

### Media/visual assets owns

- source assets and preservation copies;
- `RC-###.media.json`;
- rights holder, licence, contributor and provenance evidence;
- privacy treatment, specimen-identity treatment, captions and alt text;
- derivative declarations and media-coverage updates;
- approved primary visual or explicit governed-gap treatment;
- G5 approval evidence.

### Engineering/integration owns

- shared contracts, schemas, compiler and validators;
- G6 identifier and package compatibility review;
- generated repository outputs;
- relationship-standard integration and repository closure;
- search, graph, Explorer, profile and comparison integration;
- CI, release evidence, deployment and G9 inspection;
- `docs/PROGRAMME-REGISTER_RC-001-RC-025.md` updates based only on verified packets.

Engineering must not silently repair botanical prose, identity decisions, source judgements, media rights or asset approvals. Defects are returned to the owning stream with an exact file path, failing rule and requested correction.

## 3. Required editorial handoff — each RC

For every record from RC-006 through RC-010, the editorial packet must contain:

1. `atlas-repository/reference-standards/RC-###.md`
2. `atlas-repository/reference-standards/sources/RC-###.sources.json`
3. the approval Decision Record named by the RC metadata, normally under `docs/`
4. a structured handoff manifest conforming to section 11 of this contract
5. any proposed cross-record relationship candidates as structured data in the handoff manifest

### Canonical RC requirements

The filename and embedded identifier must match exactly. The document must:

- use the `canonical-rc-v1` compiler profile;
- use an accepted exact record status, with `Approved and frozen` preferred for Wave 1 handoff;
- use an ISO `YYYY-MM-DD` freeze date;
- include every metadata field, canonical section and At-a-glance field required by `rc-contract.json`;
- use `Named cultivar` as the governed entity type;
- use a species already present in `contract/taxa.json`, or explicitly request a governed taxon-contract change before handoff;
- identify a real approval decision;
- contain no placeholder text from `RC-TEMPLATE.md`;
- retain unresolved, rejected and diagnostic-limit material rather than converting uncertainty into certainty.

The currently governed species are `Acer palmatum` and `Acer shirasawanum`. A proposed cultivar under another species is **BLOCKED at G6** until an approved taxon change is merged before the dependent record.

### Source-sidecar requirements

`RC-###.sources.json` must:

- use `recordId: RC-###`;
- use top-level `status: approved`;
- contain at least one approved underlying source;
- use record-scoped IDs matching `SRC-RC-###-NNN`;
- provide `title`, `citation`, `sourceType`, `authority`, non-empty `domainScope` and at least one `sourceLocations` locator for every source;
- use only the governed evidence groups `identity`, `morphology`, `seasonal`, `dimensions`, `cultivation`, `history` and `diagnosis`;
- map every required evidence group to at least one declared source whose `domainScope` includes that group;
- include stable URL, access date or publication date metadata where applicable;
- contain no cross-record source IDs.

## 4. Required media handoff — each RC

For every record from RC-006 through RC-010, the media packet must contain:

1. `atlas-repository/reference-standards/media/RC-###.media.json`
2. all governed source assets referenced by the sidecar, under `public/media/`
3. declared derivatives under `public/media/derivatives/rc-###/` when assets are present
4. the updated RC row in `atlas-repository/media-coverage.json`
5. a structured handoff manifest conforming to section 11

Each packet must use one of the following release-minimum treatments.

### Treatment A — approved primary visual

The sidecar must use:

- `recordId: RC-###`;
- `status: approved`;
- `contractVersion: media-v2`;
- one or more assets with IDs matching `MED-RC-###-[A-Z]+-NNN`;
- `cultivarId` equal to the record ID;
- asset `status: approved`;
- complete creator, contributor, rights-holder, licence, source, identification, privacy, caption, alt text, focal-point, derivative and approval-history metadata;
- a preserved source checksum matching the repository file;
- four deterministic derivative profiles: `thumb`, `card`, `display` and `archive`;
- public EXIF and GPS retention set to `false` unless a later Decision Record authorises otherwise;
- a conspicuous evidence-boundary label.

The media-coverage row must use `releaseMinimum: met`, list the available coverage and state any remaining target gap.

### Treatment B — explicit governed gap

The sidecar must use:

- `recordId: RC-###`;
- `status: approved`;
- `contractVersion: media-v2`;
- `assets: []`.

The media-coverage row must use `releaseMinimum: gap`, `coverage: []`, and a specific gap statement identifying the missing primary visual and the next acquisition action. A silent omission, draft sidecar or missing coverage row is not an acceptable governed gap.

### Current implementation constraints

The current derivative processor reads source files as SVG text and generates SVG derivatives. Therefore:

- a governed gap is technically acceptable under the present release-minimum policy;
- a source asset submitted for immediate processing must be compatible with the current SVG processor;
- a raster-photograph package must be marked **BLOCKED — CONTRACT CHANGE REQUIRED** until that concrete package is available and an engineering change is reviewed and merged before integration.

The current media validator is stricter than the JSON schema: it requires `evidentiaryStatus: illustrative-not-evidence` and a `syntheticLabel` for every approved asset. Until a documented validator change is triggered and approved, handoffs must satisfy the validator implementation, not merely the broader schema enum.

## 5. Identifier and filename rules

| Object | Required form |
| --- | --- |
| Record identifier | `RC-006` through `RC-010` |
| Canonical Markdown | `atlas-repository/reference-standards/RC-###.md` |
| Source sidecar | `atlas-repository/reference-standards/sources/RC-###.sources.json` |
| Media sidecar | `atlas-repository/reference-standards/media/RC-###.media.json` |
| Underlying source ID | `SRC-RC-###-NNN` |
| Media ID | `MED-RC-###-[A-Z]+-NNN` |
| Derivative directory | `public/media/derivatives/rc-###/` |
| Relationship ID | next unique `REL-NNNNNN` in the governed relationship register |
| Taxon ID | governed `TAX-[A-Z0-9]+` entry |

Rules:

- zero padding is mandatory;
- filename, `recordId`, RC metadata, source-ID scope, `cultivarId`, media-ID scope and relationship endpoints must agree exactly;
- cultivar slugs must remain unique after normalization;
- underlying source IDs and media IDs must be globally unique;
- no new record may use a cultivar assignment already represented or pending in another Wave 1 packet;
- no generated JSON object or `lib/repository-registry.js` may be edited manually.

## 6. Accepted gate and status vocabulary

### Programme gates

- `G0 — Planned`
- `G1 — Research ready`
- `G2 — Evidence assembled`
- `G3 — Editorial draft complete`
- `G4 — Botanical/editorial approval`
- `G5 — Media ready`
- `G6 — Integration ready`
- `G7 — Technical validation`
- `G8 — Frozen and published`
- `G9 — Post-publication review`

### Readiness assessment

Every handoff and register update must use exactly one assessment:

- `PASS`
- `CONDITIONAL`
- `BLOCKED`

`CONDITIONAL` must identify a bounded condition that does not invalidate the claimed gate. Missing required files, mismatched identifiers, incomplete evidence groups, unresolved rights, missing approval or failing validation are `BLOCKED`, not `CONDITIONAL`.

### File-level statuses accepted for Wave 1 integration

- RC Markdown: an exact approved/frozen status permitted by `rc-contract.json`; use `Approved and frozen` for new canonical records.
- Source sidecar: top-level `approved`; underlying sources explicitly `approved` or omitted only where the compiler's approved default is intentional and documented.
- Media sidecar: top-level `approved`.
- Media asset: `approved`.
- Coverage release minimum: `met` or `gap`.
- Publication register: `NOT PUBLIC` before G8; `PUBLISHED` only after owner approval, merge, deployment and production verification evidence.

## 7. Preflight, materialisation and complete validation

Repository script names in the checked-out `package.json` are authoritative. Re-check them before every wave.

### Handoff preflight

```bash
npm ci --no-audit --no-fund
npm run validate:reference-standards
npm run compile:atlas:dry-run
npm run process:media
npm run validate:media
npm run process:media:check
```

A dry-run or preflight does not publish generated repository outputs.

### Materialise canonical outputs

```bash
npm run compile:atlas
npm run compile:atlas:check
```

The compiler must discover ten approved records, create dynamic counts and preserve transactional publication. Do not accept a Wave 1 package that requires cultivar-specific compiler code.

### Complete G7 chain

```bash
npm run process:media
npm run validate:media
npm run process:media:check
npm run validate:contributions
npm run validate:reference-standards
npm run compile:atlas:dry-run
npm run compile:atlas
npm run compile:atlas:check
npm run validate:schemas
npm run validate:repository
npm run validate:search
npm run validate:graph
npm run validate:explorer
npm run test:unit
npm run test:integration
npm run test:coverage
npm run validate:scale
npm run build
npm run test:regression
npm run validate:quality
npm run release:manifest
```

After the chain, run a repository diff check. Any unexpected generated drift, missing derivative, changed frozen RC-001 through RC-005 file, or unexplained object-count change is a failure.

## 8. G6 engineering compatibility checks

Before compilation, engineering must verify all five records as one cohort:

- editorial and media packets use the same RC assignment and accepted cultivar identity;
- no duplicate assignment, normalized slug, source ID or media ID exists;
- every RC has the canonical Markdown, source sidecar and approved media sidecar;
- every source evidence group is complete;
- every media packet has an approved primary visual or explicit governed gap;
- every species resolves to the taxon registry;
- approval Decision Records exist and agree with RC metadata;
- proposed relationships reference existing or same-wave endpoints and supported evidence selectors;
- application routes and repository services derive the new records without hand-authored record lists;
- the package does not modify RC-001 through RC-005 Markdown;
- no stream has edited files owned by another stream without a documented defect agreement.

G6 is `PASS` only when the five records form one internally coherent cohort. Engineering may return individual record defects, but it must not publish a partial Wave 1 unless a new owner-approved Decision Record changes the five-record wave boundary.

## 9. Branch and merge order

1. Reverify current `main` SHA, open PRs and active branches.
2. If a concrete handoff exposes a shared contract, schema, validator or application defect, create or update `engineering/sprint-12-wave-1` from current `main` and merge that change first.
3. Editorial completes `content/rc-006-010` through G4 and supplies its exact head SHA and packet.
4. Media completes `media/rc-006-010` through G5 and supplies its exact head SHA and packet.
5. Do not merge an approved/frozen editorial package directly to `main` without its matching media and integration package, because the compiler may publish it.
6. When both reviewed packet heads are coherent, create `integration/rc-006-010` from the then-current `main`.
7. Bring the exact reviewed editorial and media commits into the integration branch without rewriting their owned content.
8. Engineering resolves only integration-owned items: relationship standards, generated outputs, application-derived integration, release evidence and programme-register updates.
9. Run G6 and the complete G7 chain.
10. Obtain project-owner / Editor-in-Chief G8 approval.
11. Squash merge the Wave 1 integration PR to `main` and delete merged branches.
12. Reverify `main`, deployment and production routes; then record G9 and update the programme register.

No `integration/rc-006-010` branch should exist while either cross-stream packet is missing or `BLOCKED`.

## 10. Failure and rollback handling

### Handoff failure

- Stop before compilation.
- Record `BLOCKED`, the exact file, identifier and rule violated.
- Return the defect to editorial or media as appropriate.
- Do not repair owned content silently on the engineering branch.

### Compiler or repository failure

- Do not hand-edit generated outputs.
- The compiler's transactional replacement must preserve the prior canonical repository on failure.
- Retain failing logs and the exact command.
- Classify whether the failure is a package defect or a genuine shared-contract defect.
- Open an engineering change only for the latter.

### Media-processing failure

The media processor writes derivatives before the later repository checks. If processing fails:

- reset generated derivative paths to the integration branch's pre-run commit;
- preserve submitted source assets and sidecars for diagnosis;
- do not publish partially generated derivatives;
- rerun `process:media`, `validate:media` and `process:media:check` after correction.

### CI failure

- Do not merge.
- Record the failing job, command and log evidence.
- Fix the defect on the single owning branch; do not create parallel engineering branches without a Decision Record.

### Post-merge or production failure

- Revert the single squash merge if the defect affects canonical repository integrity, publication correctness or route availability.
- Re-run the complete validation chain on the restored `main`.
- Treat an external deployment-provider limit separately from an application-build failure, but do not mark G9 `PASS` until production inspection is possible.
- Record a Decision Record when the failure reveals a material contract or governance defect.

## 11. Exact structured handoff packet

Each stream must provide one UTF-8 JSON packet with this shape. The packet may be attached to the PR or committed under a temporary review-only path, but it must not remain as an ungoverned transfer artefact on `main`.

```json
{
  "packetVersion": "wave1-handoff-v1",
  "stream": "editorial",
  "wave": "RC-006-RC-010",
  "inspectedMainSha": "40-character SHA",
  "branch": "content/rc-006-010",
  "headSha": "40-character SHA",
  "gate": "G4",
  "assessment": "PASS",
  "changedFiles": [],
  "records": [
    {
      "recordId": "RC-006",
      "cultivarAssignment": "Acer species 'Cultivar'",
      "gate": "G4",
      "assessment": "PASS",
      "ownedFiles": [],
      "identifiers": {
        "recordId": "RC-006",
        "sourceIds": [],
        "mediaIds": []
      },
      "approval": {
        "authority": "named authority",
        "decisionRecord": "docs/DR-...md",
        "date": "YYYY-MM-DD"
      },
      "validation": [
        {
          "command": "exact command",
          "result": "PASS",
          "evidence": "concise result or artifact reference"
        }
      ],
      "relationshipCandidates": [],
      "unresolvedIssues": [],
      "nextReceiver": "engineering/integration",
      "requestedAction": "G6 compatibility review"
    }
  ],
  "unresolvedIssues": [],
  "nextReceiver": "engineering/integration",
  "requestedAction": "Converge with matching Wave 1 package"
}
```

### Editorial packet additions

For each record, `ownedFiles` must include the RC Markdown, source sidecar and approval Decision Record. `relationshipCandidates` must identify proposed endpoints, governed relationship type or requested type, rationale, evidence selectors, confidence and any uncertainty.

### Media packet additions

Use `stream: media`, `gate: G5` and branch `media/rc-006-010`. For each record include:

```json
{
  "mediaTreatment": "approved-primary-visual",
  "mediaSidecar": "atlas-repository/reference-standards/media/RC-006.media.json",
  "sourceAssets": [],
  "derivatives": [],
  "coverage": {
    "releaseMinimum": "met",
    "coverage": [],
    "gap": "remaining target gap"
  },
  "rightsApproval": {
    "status": "approved",
    "authority": "named authority",
    "date": "YYYY-MM-DD"
  }
}
```

For a governed gap use `mediaTreatment: governed-gap`, empty `sourceAssets` and `derivatives`, and `coverage.releaseMinimum: gap` with a specific gap and next acquisition action.

Every packet must record:

- inspected `main` SHA;
- branch and head SHA;
- gate entered or exited;
- exact changed-file list;
- exact validation performed;
- unresolved issues;
- next receiver and requested action;
- `PASS`, `CONDITIONAL` or `BLOCKED` assessment.

## 12. Programme-register update rule

Engineering updates `docs/PROGRAMME-REGISTER_RC-001-RC-025.md` only on the integration branch and only from verified packets.

- Do not mark another stream's unmerged work complete.
- Do not change `Cultivar assignment` until the editorial packet identifies the assignment and duplicate checks pass.
- Do not mark G5 ready from an asset description alone; the approved sidecar, rights metadata and governed source or gap must exist.
- Do not mark G6 or G7 `PASS` until the five-record cohort passes the corresponding checks.
- Do not mark `PUBLISHED` until G8 approval and the Wave 1 squash merge are complete.
- Record the inspected main SHA, branch, changed files, validation, unresolved issues, next receiver and assessment in the associated integration evidence.

## 13. RC-010 formative checkpoint

After RC-006 through RC-010 reach G9, engineering must record the formative checkpoint before any Sprint 12.1 or RC-011 integration begins. The checkpoint must assess:

- canonical-template practicality;
- repeated RC and source-sidecar defects;
- media classification and governed-gap practicality;
- profile and gallery clarity;
- search, graph, Explorer and comparison behaviour;
- production effort and bottlenecks;
- repeated editorial, media, technical and usability defects;
- contract changes recommended for Wave 2.

Until that checkpoint is repository-visible and owner-reviewed, `integration/rc-011-015` must not be created and RC-011 must remain `NOT PUBLIC`.
