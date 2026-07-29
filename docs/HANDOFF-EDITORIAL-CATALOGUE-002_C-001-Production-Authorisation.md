# HANDOFF-EDITORIAL-CATALOGUE-002 — C-001 Production Authorisation

**Status:** ACTIVE — READY FOR EDITORIAL EXECUTION  
**Authority:** DR-CATALOGUE-001  
**Branch baseline:** `4a4c67ec400644431b2c54cdd13ab842da847d00`  
**Next receiver:** Editorial / content-production stream  
**Target branch:** `content/catalogue-c-001`

## 1. Authorised batch

| Stable identity | Approved working name | Taxon | Preliminary risk |
| --- | --- | --- | --- |
| CUL-000011 | *Acer palmatum* ‘Orange Dream’ | TAX-APAL | LOW |
| CUL-000012 | *Acer palmatum* ‘Koto-no-ito’ | TAX-APAL | LOW |
| CUL-000013 | *Acer palmatum* ‘Inaba-shidare’ | TAX-APAL | LOW |
| CUL-000014 | *Acer palmatum* ‘Beni-kawa’ | TAX-APAL | LOW |
| CUL-000015 | *Acer palmatum* ‘Trompenburg’ | TAX-APAL | LOW |

## 2. Required editorial output

Produce one canonical Catalogue Profile JSON input per approved identity under `atlas-repository/catalogue-profiles/` using the merged schema and registry assignment.

Each record must include:

- accepted working name, epithet, taxon and scientific name;
- completed duplicate review against RC-001–RC-010 and the other approved Catalogue assignments;
- naming variants and concise identity notes;
- LOW-risk justification and any bounded residual issue;
- practical summary, habit, leaf form, seasonal colour, size, cultivation and diagnostic comparison content;
- two to five credible sources by default, with claim support and limitations;
- honest confidence wording;
- non-published catalogue state and `publishedAt: null`;
- C-001 batch ID;
- media state supplied by or reconciled with the media stream;
- revision history and editorial review metadata.

## 3. C0 requirements

- **Orange Dream:** confirm distinctness from RC-009 ‘Katsura’ and RC-005 ‘Aureum’.
- **Koto-no-ito:** distinguish ‘Yamato-koto-no-ito’, ‘Koto-ito-komachi’ and spacing/hyphenation variants.
- **Inaba-shidare:** confirm distinction from RC-004 ‘Crimson Queen’ and the approved red dissectum cohort.
- **Beni-kawa:** confirm distinction from RC-003 ‘Sango-kaku’ and other bark-led assignments.
- **Trompenburg:** distinguish ‘Green Trompenburg’ and document the comparison with RC-001 ‘Bloodgood’.

C0 must resolve as `unique` for every record before routine batch approval.

## 4. Source standard

Use the lean Catalogue source model rather than the Reference Standard evidence matrix:

- prefer RHS, botanical gardens, universities, herbaria, accessioned collections and other authoritative institutional sources;
- use established specialist or nursery sources only as qualified supplements;
- retain precise locators, access dates, supported claims and limitations;
- do not inflate source count where two or three strong sources adequately support the profile;
- stop and escalate if a record becomes HIGH risk or an identity conflict remains unresolved.

## 5. Ownership boundary

Editorial owns botanical and horticultural content, source records, duplicate review, risk treatment and editorial approval.

Editorial must not:

- alter the schema, compiler, validators, application or CI;
- approve media rights or a governed visual gap;
- mark a profile published;
- allocate an RC identifier;
- modify frozen Reference Standards;
- begin full C-002 or C-003 production before the C-001 process review, except bounded background research authorised by the CTO.

## 6. Validation and handoff

Before handoff to engineering:

1. run `npm run validate:catalogue`;
2. run `npm run compile:catalogue:check`;
3. run the applicable repository and test commands;
4. confirm all five records remain non-public;
5. provide an exact changed-file list, C0 decisions, source counts, unresolved issues and media dependencies;
6. stop before integration or publication.

## 7. Success condition

Editorial success is five C-001 inputs at C1-ready status, with completed C0 decisions and no invented media approval. Publication remains an engineering/CTO action after C2 and C3.
