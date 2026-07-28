# HANDOFF-EDITORIAL-CATALOGUE-001 — Slots 011–025 Planning

**Status:** READY FOR PROJECT OWNER AND CTO / ENGINEERING REVIEW  
**Inspected `main`:** `f8aeff982c5d155ae4880a618453dc38c40f008e`  
**Branch:** `content/catalogue-cohort-011-025-planning`  
**Ownership boundary:** editorial planning documents only  
**Publication authority:** none issued

## 1. Handoff summary

Editorial proposes fifteen cultivar assignments for the first Catalogue cohort and a three-batch production sequence. No stable cultivar ID, Catalogue JSON object, media approval, programme-register update or public publication has been created.

Recommended first batch C-001:

- slot 011 — *Acer palmatum* ‘Orange Dream’;
- slot 012 — *Acer palmatum* ‘Koto-no-ito’;
- slot 013 — *Acer palmatum* ‘Inaba-shidare’;
- slot 014 — *Acer palmatum* ‘Beni-kawa’;
- slot 015 — *Acer palmatum* ‘Trompenburg’.

All five are preliminarily LOW risk, institutionally sourceable, visually feasible and differentiated from RC-001 through RC-010.

## 2. Files in this packet

- `docs/CATALOGUE-ASSIGNMENTS-001_Slots-011-025-Proposal.md`;
- `docs/CATALOGUE-RISK-001_Slots-011-025-Triage.md`;
- `docs/CATALOGUE-EDITORIAL-001_Lean-Authoring-and-Source-Operations.md`;
- `docs/METRICS-EDITORIAL-001_Wave-1-Reference-Standard-Effort.md`;
- `docs/HANDOFF-EDITORIAL-CATALOGUE-001_Slots-011-025-Planning.md`.

## 3. Proposed production sequence

### Batch C-001 — lowest risk / highest delivery confidence

| Slot | Cultivar | Risk | Estimated editorial hours | Expected sources | Media forecast |
| --- | --- | --- | ---: | ---: | --- |
| 011 | ‘Orange Dream’ | LOW | 4–6 | 3–4 | HIGH |
| 012 | ‘Koto-no-ito’ | LOW | 4–6 | 3–4 | HIGH |
| 013 | ‘Inaba-shidare’ | LOW | 4–6 | 3–5 | HIGH |
| 014 | ‘Beni-kawa’ | LOW | 4–6 | 3–4 | HIGH |
| 015 | ‘Trompenburg’ | LOW | 4–6 | 3–4 | HIGH |

Expected editorial effort: 25–35 hours including cohort consistency and review. Expected calendar cycle after schema readiness: 7–12 working days when media and engineering run in parallel.

### Batch C-002

- slot 016 — ‘Autumn Moon’ — MEDIUM;
- slot 017 — ‘Waterfall’ — LOW;
- slot 018 — ‘Aoyagi’ — LOW;
- slot 019 — ‘Shin-deshōjō’ — MEDIUM;
- slot 020 — ‘Red Dragon’ — LOW.

Expected editorial effort: 27–39 hours. Expected calendar cycle: 8–14 working days, with targeted taxon/alias and romanisation reviews.

### Batch C-003

- slot 021 — ‘Tamukeyama’ — MEDIUM;
- slot 022 — ‘Orangeola’ — LOW;
- slot 023 — ‘Higasa-yama’ — MEDIUM;
- slot 024 — ‘Arakawa’ — MEDIUM;
- slot 025 — ‘Red Pygmy’ — LOW.

Expected editorial effort: 29–43 hours. Expected calendar cycle: 9–16 working days, with synonym, spelling/source-sufficiency and accepted-name reviews.

## 4. Risk and escalation forecast

- LOW: 10 records;
- MEDIUM: 5 records;
- HIGH: 0 records proposed;
- likely record-specific owner escalations after assignment: up to 5, each bounded to one naming, taxon or source-sufficiency issue;
- likely governed media gaps: slots 018, 023 and 024 if suitable identified material is unavailable;
- immediate blocker for final profile production: Catalogue MVP schema and validator are not yet merged;
- immediate governance blocker: Project Owner has not yet approved the fifteen assignments.

## 5. Source and authoring recommendations

Editorial recommends retaining the two-to-five-source LOW-risk default. One authoritative source may be accepted only through a narrow documented exception. Medium risk requires a targeted issue review, not a full evidence matrix. High risk stops routine batching.

The future profile should keep compact identity, horticultural content, source, risk, confidence, media and revision fields in one authoring object. No schema change is proposed from this branch.

## 6. Reference Standard evidence

Wave 1 used 32 source objects across five records, averaging 6.4 per record. Estimated editorial effort was 82–121 hours, or approximately 16–24 hours per record. Three of five records required explicit Project Owner acceptance of bounded nomenclatural conditions.

For ordinary Catalogue Profiles, estimated effort is 4–6 hours for LOW risk and 6–9 hours for MEDIUM risk. Complete historical monographs, seven domains, separate evidence matrices, long rejected-claim registers and unique Decision Records are not routine requirements.

## 7. Required decisions

### Project Owner

1. approve or amend slots 011–025;
2. approve C-001 as the first production batch;
3. approve targeted-review treatment for slots 016, 019, 021, 023 and 024;
4. confirm that slot approval precedes stable `CUL-######` assignment;
5. confirm that Catalogue slots do not automatically receive `RC-###` identifiers.

### CTO / engineering

1. review the assignment packet against the stable identity architecture;
2. confirm supported taxon keys `TAX-APAL` and `TAX-ASHI` in the Catalogue MVP contract;
3. merge the Catalogue schema, validator, compiler/generator and front-end support before editorial creates final profile JSON;
4. encode deterministic source locators and compact claim support without recreating Reference Standard sidecars;
5. preserve current RC-001–RC-010 routes and identities during migration;
6. notify editorial when the Stage C authoring contract is stable.

### Media stream

After owner assignment approval, media may begin candidate discovery for C-001, but no candidate becomes C2-approved without rights, provenance, identity basis, privacy treatment, caption/alt text and derivative validation.

## 8. Structured handoff

The final GitHub head SHA and validation result are supplied in the PR and final execution response because a file cannot truthfully contain its own resulting commit SHA.

```json
{
  "inspectedMainSha": "f8aeff982c5d155ae4880a618453dc38c40f008e",
  "branch": "content/catalogue-cohort-011-025-planning",
  "headCommit": "RESOLVE_FROM_FINAL_PR_HEAD",
  "proposedSlots": [
    {
      "slot": "011",
      "acceptedWorkingName": "Acer palmatum 'Orange Dream'",
      "taxonId": "TAX-APAL",
      "riskLevel": "LOW",
      "duplicateCheck": "Distinct from RC-009 and all existing identities; seasonal-yellow comparison retained",
      "sourceFeasibility": "3-4 credible institutional sources expected",
      "mediaFeasibility": "HIGH",
      "recommendedBatch": "C-001",
      "recommendation": "ACCEPT"
    },
    {
      "slot": "012",
      "acceptedWorkingName": "Acer palmatum 'Koto-no-ito'",
      "taxonId": "TAX-APAL",
      "riskLevel": "LOW",
      "duplicateCheck": "No existing linearilobum identity; near-name cultivars must remain separate",
      "sourceFeasibility": "3-4 credible institutional sources expected",
      "mediaFeasibility": "HIGH",
      "recommendedBatch": "C-001",
      "recommendation": "ACCEPT"
    },
    {
      "slot": "013",
      "acceptedWorkingName": "Acer palmatum 'Inaba-shidare'",
      "taxonId": "TAX-APAL",
      "riskLevel": "LOW",
      "duplicateCheck": "Close comparison with RC-004 but not duplicate",
      "sourceFeasibility": "3-5 credible institutional sources expected",
      "mediaFeasibility": "HIGH",
      "recommendedBatch": "C-001",
      "recommendation": "ACCEPT"
    },
    {
      "slot": "014",
      "acceptedWorkingName": "Acer palmatum 'Beni-kawa'",
      "taxonId": "TAX-APAL",
      "riskLevel": "LOW",
      "duplicateCheck": "Deliberate bark comparison with RC-003; distinct identity",
      "sourceFeasibility": "3-4 credible institutional sources expected",
      "mediaFeasibility": "HIGH",
      "recommendedBatch": "C-001",
      "recommendation": "ACCEPT"
    },
    {
      "slot": "015",
      "acceptedWorkingName": "Acer palmatum 'Trompenburg'",
      "taxonId": "TAX-APAL",
      "riskLevel": "LOW",
      "duplicateCheck": "Distinct from RC-001 and from 'Green Trompenburg'",
      "sourceFeasibility": "3-4 credible institutional sources expected",
      "mediaFeasibility": "HIGH",
      "recommendedBatch": "C-001",
      "recommendation": "ACCEPT"
    },
    {
      "slot": "016",
      "acceptedWorkingName": "Acer shirasawanum 'Autumn Moon'",
      "taxonId": "TAX-ASHI",
      "riskLevel": "MEDIUM",
      "duplicateCheck": "Distinct from RC-005; taxon-mismatched synonym forms require alias review",
      "sourceFeasibility": "3-5 credible sources expected",
      "mediaFeasibility": "HIGH",
      "recommendedBatch": "C-002",
      "recommendation": "ACCEPT WITH TARGETED REVIEW"
    },
    {
      "slot": "017",
      "acceptedWorkingName": "Acer palmatum 'Waterfall'",
      "taxonId": "TAX-APAL",
      "riskLevel": "LOW",
      "duplicateCheck": "Distinct green weeping dissectum role",
      "sourceFeasibility": "3-4 credible institutional sources expected",
      "mediaFeasibility": "HIGH",
      "recommendedBatch": "C-002",
      "recommendation": "ACCEPT"
    },
    {
      "slot": "018",
      "acceptedWorkingName": "Acer palmatum 'Aoyagi'",
      "taxonId": "TAX-APAL",
      "riskLevel": "LOW",
      "duplicateCheck": "Distinct from RC-003, 'Beni-kawa' and 'Yamato-aoyagi'",
      "sourceFeasibility": "3-4 credible institutional sources expected",
      "mediaFeasibility": "MEDIUM-HIGH",
      "recommendedBatch": "C-002",
      "recommendation": "ACCEPT"
    },
    {
      "slot": "019",
      "acceptedWorkingName": "Acer palmatum 'Shin-deshōjō'",
      "taxonId": "TAX-APAL",
      "riskLevel": "MEDIUM",
      "duplicateCheck": "Distinct from RC-009; romanisation variants require normalization",
      "sourceFeasibility": "3-5 credible sources expected",
      "mediaFeasibility": "HIGH but time-sensitive",
      "recommendedBatch": "C-002",
      "recommendation": "ACCEPT WITH TARGETED REVIEW"
    },
    {
      "slot": "020",
      "acceptedWorkingName": "Acer palmatum 'Red Dragon'",
      "taxonId": "TAX-APAL",
      "riskLevel": "LOW",
      "duplicateCheck": "Distinct compact dissectum; cross-genus homonyms excluded by taxon",
      "sourceFeasibility": "3-4 credible institutional sources expected",
      "mediaFeasibility": "HIGH",
      "recommendedBatch": "C-002",
      "recommendation": "ACCEPT"
    },
    {
      "slot": "021",
      "acceptedWorkingName": "Acer palmatum 'Tamukeyama'",
      "taxonId": "TAX-APAL",
      "riskLevel": "MEDIUM",
      "duplicateCheck": "Distinct from other dissectums; 'Beni-hagoromo' synonym requires review",
      "sourceFeasibility": "3-5 credible sources expected",
      "mediaFeasibility": "HIGH",
      "recommendedBatch": "C-003",
      "recommendation": "ACCEPT WITH TARGETED REVIEW"
    },
    {
      "slot": "022",
      "acceptedWorkingName": "Acer palmatum 'Orangeola'",
      "taxonId": "TAX-APAL",
      "riskLevel": "LOW",
      "duplicateCheck": "Distinct orange seasonal dissectum role",
      "sourceFeasibility": "3-4 credible institutional sources expected",
      "mediaFeasibility": "HIGH",
      "recommendedBatch": "C-003",
      "recommendation": "ACCEPT"
    },
    {
      "slot": "023",
      "acceptedWorkingName": "Acer palmatum 'Higasa-yama'",
      "taxonId": "TAX-APAL",
      "riskLevel": "MEDIUM",
      "duplicateCheck": "Distinct from RC-007; joined spelling 'Higasayama' requires normalization",
      "sourceFeasibility": "2-4 sources expected; descriptive sufficiency must be confirmed",
      "mediaFeasibility": "MEDIUM",
      "recommendedBatch": "C-003",
      "recommendation": "ACCEPT WITH TARGETED REVIEW"
    },
    {
      "slot": "024",
      "acceptedWorkingName": "Acer palmatum 'Arakawa'",
      "taxonId": "TAX-APAL",
      "riskLevel": "MEDIUM",
      "duplicateCheck": "No duplicate; 'Rough Bark Maple' alias direction requires review",
      "sourceFeasibility": "3-5 credible sources expected",
      "mediaFeasibility": "MEDIUM",
      "recommendedBatch": "C-003",
      "recommendation": "ACCEPT WITH TARGETED REVIEW"
    },
    {
      "slot": "025",
      "acceptedWorkingName": "Acer palmatum 'Red Pygmy'",
      "taxonId": "TAX-APAL",
      "riskLevel": "LOW",
      "duplicateCheck": "Distinct red dwarf linearilobum; cross-genus homonyms excluded by taxon",
      "sourceFeasibility": "3-4 credible institutional sources expected",
      "mediaFeasibility": "HIGH",
      "recommendedBatch": "C-003",
      "recommendation": "ACCEPT"
    }
  ],
  "batchC001": ["011", "012", "013", "014", "015"],
  "ownerDecisionsRequired": [
    "Approve or amend slots 011-025",
    "Approve C-001 production order",
    "Approve targeted-review treatment for five MEDIUM-risk records",
    "Confirm CUL IDs follow final C0 review and engineering contract merge",
    "Confirm Catalogue slots do not automatically receive RC identifiers"
  ],
  "expectedThroughput": {
    "lowRiskHoursPerProfile": "4-6",
    "mediumRiskHoursPerProfile": "6-9",
    "batchC001EditorialHours": "25-35",
    "batchC001CycleTime": "7-12 working days after schema readiness",
    "cohortEditorialHours": "80-123 estimated"
  },
  "changedFiles": [
    "docs/CATALOGUE-ASSIGNMENTS-001_Slots-011-025-Proposal.md",
    "docs/CATALOGUE-RISK-001_Slots-011-025-Triage.md",
    "docs/CATALOGUE-EDITORIAL-001_Lean-Authoring-and-Source-Operations.md",
    "docs/METRICS-EDITORIAL-001_Wave-1-Reference-Standard-Effort.md",
    "docs/HANDOFF-EDITORIAL-CATALOGUE-001_Slots-011-025-Planning.md"
  ],
  "validationPerformed": ["RESOLVE_FROM_FINAL_PR_CI"],
  "unresolvedIssues": [
    "Project Owner assignment approval pending",
    "Catalogue MVP schema and validator not merged",
    "Final C0 duplicate and alias review pending",
    "C-001 media rights and identity review not started"
  ],
  "nextReceiver": "Project Owner and CTO / engineering"
}
```

## 9. Stop condition

Editorial stops after this planning PR. Final Catalogue JSON production must not start until:

1. the Project Owner approves the cultivar assignments; and
2. engineering confirms that the Catalogue MVP schema and validator are merged and stable.
