import crypto from 'node:crypto';
import path from 'node:path';

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

export function syntheticReferenceStandard(id, options = {}) {
  const number = Number(id.slice(3));
  const cultivar = options.cultivar || `Atlas Test ${String(number).padStart(3, '0')}`;
  const species = options.species || 'Acer palmatum';
  const status = options.status || 'Approved and frozen';
  return `# Japanese Maple Atlas

## ${id} — *${species}* ‘${cultivar}’

# Reference Standard v1.0

**Reference Cultivar ID:** ${id}
**Accepted working name:** *${species}* ‘${cultivar}’
**Entity type:** Named cultivar
**Record status:** ${status}
**Version:** Reference Standard v1.0
**Freeze date:** 2026-07-26
**Compiler profile:** canonical-rc-v1
**Approval decision:** DR-${id}-FREEZE-001

# 1. At-a-glance summary

| Attribute | Governed summary |
| --- | --- |
| Accepted working name | *${species}* ‘${cultivar}’ |
| Synonyms and spelling variants | None established |
| Entity type | Named cultivar |
| Whole-plant architecture | Upright small tree with a broadly vase-shaped crown |
| Leaf morphology | Palmately lobed leaves with five to seven lobes |
| Spring foliage | Fresh green with restrained red margins |
| Summer foliage | Medium green |
| Autumn foliage | Yellow, orange and red |
| Published mature height | Approximately 10–15 ft with source qualification |
| Published mature spread | Approximately 8–12 ft with source qualification |
| Growth rate | Slow to moderate |
| Flowers | Small reddish spring flowers |
| Fruit | Winged samaras |
| Exposure | Full sun to partial shade with regional qualification |
| Soil | Moist but well-drained soil |
| Hardiness | USDA zones 5–8 with regional qualification |
| Propagation | Vegetative propagation is required to preserve identity |
| Historical provenance | Synthetic scale-test record with no historical claim |
| Diagnostic strength | Descriptively useful but not independently authenticating |
| Overall descriptive confidence | High for synthetic compiler testing |
| Bark and stem characteristics | Gray-brown stems |

# 2. Cultivar identity and nomenclature

The accepted working identity is governed for compiler testing.

# 3. Naming variants and synonyms

No naming variants are established for this synthetic fixture.

# 4. Botanical description

This synthetic description provides structurally complete botanical content for scale testing.

# 5. Whole-plant architecture

The plant is represented as an upright small tree with qualified crown architecture.

# 6. Leaf morphology

Leaves are palmately lobed and retained as a descriptive rather than authenticating character.

# 7. Seasonal characteristics

Spring, summer and autumn expressions are represented separately and remain environmentally qualified.

# 8. Horticultural information

Cultivation guidance is climate- and site-dependent and is not represented as a universal guarantee.

# 9. Historical provenance

No historical proposition is asserted beyond the synthetic purpose of this record.

# 10. Propagation and cultivar continuity

Vegetative propagation is required to preserve a named cultivar identity.

# 11. Diagnostic framework

The trait combination is useful for description but does not independently authenticate clonal identity.

# 12. Confidence profile

Compiler-structure confidence is high; botanical content is synthetic and must not be published as real knowledge.

# 13. Relationship register

No real cultivar relationships are asserted by this synthetic fixture.

# 14. Source and evidence register

The synthetic source sidecar maps every required evidence group to one non-botanical test source.

# 15. Media register

The synthetic media sidecar supplies one illustrative test asset that is not botanical evidence.

# 16. Unresolved Research Register

All real botanical and historical questions remain unresolved because this is a synthetic test record.

# 17. Rejected claims

The synthetic record rejects any interpretation as a real cultivar or real botanical authority.

# 18. Freeze Decision

Approved only for deterministic compiler scale testing and never for public botanical publication.
`;
}

export function syntheticSupport(id, root = process.cwd()) {
  const sourceId = `SRC-${id}-001`;
  const provenance = {
    recordId: id,
    status: 'approved',
    sources: [{
      id: sourceId,
      title: `${id} synthetic compiler source`,
      citation: `${id} synthetic compiler source, generated for scale validation only.`,
      sourceType: 'synthetic-test-fixture',
      authority: 'Japanese Maple Atlas test suite',
      domainScope: ['identity', 'morphology', 'seasonal', 'dimensions', 'cultivation', 'history', 'diagnosis'],
      sourceLocations: ['Synthetic fixture']
    }],
    evidenceMap: Object.fromEntries(['identity', 'morphology', 'seasonal', 'dimensions', 'cultivation', 'history', 'diagnosis'].map(group => [group, [sourceId]]))
  };
  const media = {
    recordId: id,
    status: 'approved',
    assets: [{
      id: `MED-${id}-IDENTITY-001`,
      cultivarId: id,
      mediaType: 'diagram',
      role: 'identity-plate',
      subject: 'synthetic-scale-test',
      season: 'representative',
      status: 'approved',
      assetPath: `/media/synthetic/${id.toLowerCase()}.svg`,
      thumbnailPath: `/media/synthetic/${id.toLowerCase()}.svg`,
      altText: `Synthetic non-botanical compiler scale-test illustration for ${id}.`,
      caption: `${id} synthetic compiler fixture.`,
      credit: 'Japanese Maple Atlas test suite',
      evidentiaryStatus: 'illustrative-not-evidence'
    }]
  };
  const provenanceRaw = `${JSON.stringify(provenance, null, 2)}\n`;
  const mediaRaw = `${JSON.stringify(media, null, 2)}\n`;
  return {
    provenance,
    media,
    provenanceInput: { inputPath: path.join(root, 'synthetic', 'sources', `${id}.sources.json`), inputSha256: sha256(provenanceRaw) },
    mediaInput: { inputPath: path.join(root, 'synthetic', 'media', `${id}.media.json`), inputSha256: sha256(mediaRaw) }
  };
}
