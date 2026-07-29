import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { renderRasterProfiles } from '../lib/raster-media.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const PROFILES = { thumb:[320,231], card:[560,404], display:[960,693], archive:[1440,1040] };
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive:true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};
const writeText = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive:true });
  fs.writeFileSync(file, value.endsWith('\n') ? value : `${value}\n`);
};

const manifestPath = path.join(ROOT, 'quality-reports/media-review/acquisition-manifest.json');
const acquisition = readJson(manifestPath);
const byId = new Map(acquisition.records.map(record => [record.mediaId, record]));
const expectedIds = [
  'MED-CUL-000011-001','MED-CUL-000011-002','MED-CUL-000011-003',
  'MED-CUL-000013-001','MED-CUL-000013-002','MED-CUL-000013-003'
];
if (expectedIds.some(id => !byId.has(id)) || acquisition.records.length !== expectedIds.length) {
  throw new Error('Acquisition manifest does not contain the exact six approved selections.');
}
for (const id of expectedIds) {
  const record = byId.get(id);
  const sourceFile = path.join(ROOT, record.sourcePath);
  if (!fs.existsSync(sourceFile)) throw new Error(`${id}: source file missing`);
  const bytes = fs.readFileSync(sourceFile);
  if (sha256(bytes) !== record.sourceSha256) throw new Error(`${id}: source checksum mismatch`);
}

const publicQualification = {
  source: 'Source-identified; not independently authenticated by the Japanese Maple Atlas.',
  community: 'Community-identified from the source record; not independently authenticated by the Japanese Maple Atlas.'
};

const metadata = {
  'MED-CUL-000011-001': {
    altText: "Mature rounded ‘Orange Dream’ Japanese maple with a dense yellow-green crown at Wojsławice Arboretum.",
    caption: "Mature source-identified ‘Orange Dream’ at Wojsławice Arboretum, photographed in May 2017.",
    identityConfidence: 'source-asserted',
    identificationBasis: "The Wikimedia Commons source identifies the cultivated specimen as Acer palmatum ‘Orange Dream’ at Wojsławice Arboretum.",
    limitations: 'No accession record, propagation chain or independent clonal authentication was recovered.',
    publicQualification: publicQualification.source,
    privacyStatus: 'location-generalised',
    locationGranularity: 'Wojsławice Arboretum, Poland'
  },
  'MED-CUL-000011-002': {
    altText: "Close view of attached ‘Orange Dream’ leaves with pale green blades and pink-red spring tips.",
    caption: "Spring foliage detail on retail material sold as ‘Orange Dream’.",
    identityConfidence: 'community-identified',
    identificationBasis: "The photographer recorded the plant as purchased under the cultivar name ‘Orange Dream’ from an English supermarket.",
    limitations: 'Retail labelling is the only cultivar-identity basis; no accession or propagation record is available.',
    publicQualification: publicQualification.community,
    privacyStatus: 'location-generalised',
    locationGranularity: 'England, United Kingdom'
  },
  'MED-CUL-000011-003': {
    altText: "Branch of ‘Orange Dream’ showing lime-green leaves and red-pink new spring growth.",
    caption: "Branch-scale spring flush on retail material sold as ‘Orange Dream’.",
    identityConfidence: 'community-identified',
    identificationBasis: "The photographer recorded the plant as purchased under the cultivar name ‘Orange Dream’ from an English supermarket.",
    limitations: 'Retail labelling is the only cultivar-identity basis; seasonal colour alone does not authenticate the cultivar.',
    publicQualification: publicQualification.community,
    privacyStatus: 'location-generalised',
    locationGranularity: 'England, United Kingdom'
  },
  'MED-CUL-000013-001': {
    altText: "Mature mound-shaped ‘Inaba-shidare’ Japanese maple with cascading dark red dissected foliage in a botanical garden.",
    caption: "Mature source-identified ‘Inaba-shidare’ at Mendocino Coast Botanical Gardens.",
    identityConfidence: 'source-asserted',
    identificationBasis: "The Wikimedia Commons source identifies the Mendocino Coast Botanical Gardens specimen by its displayed sign.",
    limitations: 'The sign-based identification is not an accession or propagation-chain record, and similar red dissectum cultivars can be difficult to distinguish photographically.',
    publicQualification: publicQualification.source,
    privacyStatus: 'location-generalised',
    locationGranularity: 'Mendocino Coast Botanical Gardens, California'
  },
  'MED-CUL-000013-002': {
    altText: "Close view of narrow, deeply dissected purple-red leaves identified by the source as ‘Inaba-shidare’.",
    caption: "Dissected foliage detail from a plant identified by the photographer as ‘Inaba-shidare’.",
    identityConfidence: 'community-identified',
    identificationBasis: "The photographer identifies the plant as ‘Inaba-shidare’ in the garden of botanist Robert R. Kowal.",
    limitations: 'No accession, sign or propagation record accompanies the image; the photograph does not independently distinguish all similar red dissectum cultivars.',
    publicQualification: publicQualification.community,
    privacyStatus: 'location-generalised',
    locationGranularity: 'Madison, Wisconsin'
  },
  'MED-CUL-000013-003': {
    altText: "Backlit red autumn foliage of a garden-centre plant sold as ‘Inaba-shidare’.",
    caption: "Autumn foliage on retail material sold as ‘Inaba-shidare’.",
    identityConfidence: 'community-identified',
    identificationBasis: "The photographer recorded garden-centre material offered for sale under the name ‘Inaba-shidare’.",
    limitations: 'Retail labelling is the only cultivar-identity basis; autumn colour and dissected leaves alone do not authenticate the cultivar.',
    publicQualification: publicQualification.community,
    privacyStatus: 'location-generalised',
    locationGranularity: 'West Midlands, England'
  }
};

function licenceUrl(record) {
  const raw = record.licenceUrl || (record.licenceFromSource.includes('3.0')
    ? 'https://creativecommons.org/licenses/by-sa/3.0/'
    : 'https://creativecommons.org/licenses/by-sa/4.0/');
  return raw.endsWith('/') ? raw : `${raw}/`;
}

function buildAsset(record) {
  const details = metadata[record.mediaId];
  const sourceBytes = fs.readFileSync(path.join(ROOT, record.sourcePath));
  const rendered = renderRasterProfiles(sourceBytes, PROFILES);
  const cultivar = record.cultivarId.toLowerCase();
  const media = record.mediaId.toLowerCase();
  const base = `/media/derivatives/catalogue/${cultivar}/${media}`;
  const creator = record.creatorFromSource;
  return {
    id: record.mediaId,
    cultivarId: record.cultivarId,
    mediaType: 'photograph',
    role: record.proposedRole,
    isPrimary: record.proposedRole === 'habit-primary',
    status: 'approved',
    assetPath: `${base}-display.jpg`,
    thumbnailPath: `${base}-thumb.jpg`,
    altText: details.altText,
    caption: details.caption,
    creator,
    rightsHolder: record.rightsHolderFromSource || creator,
    rightsBasis: 'creative-commons',
    licence: record.licenceFromSource,
    licenceUrl: licenceUrl(record),
    sourceUrl: record.sourcePage,
    sourceItemId: `Wikimedia Commons ${record.title}`,
    attributionText: `${creator}, ${record.licenceFromSource}, via Wikimedia Commons.`,
    source: {
      path: `/${record.sourcePath}`,
      sha256: record.sourceSha256,
      preservation: 'Exact original JPEG bytes downloaded from Wikimedia Commons and retained without modification.'
    },
    identity: {
      confidence: details.identityConfidence,
      identificationBasis: details.identificationBasis,
      limitations: details.limitations,
      publicQualification: details.publicQualification
    },
    privacy: {
      status: details.privacyStatus,
      exifRetained: false,
      gpsRetained: false,
      locationGranularity: details.locationGranularity
    },
    derivatives: Object.entries(rendered).map(([profile, output]) => ({
      profile,
      path: `${base}-${profile}.jpg`,
      width: output.width,
      height: output.height,
      mimeType: output.mimeType,
      sha256: sha256(output.bytes),
      derivedFrom: record.mediaId
    })),
    approvalHistory: [{
      status: 'approved',
      date: '2026-07-29',
      authority: 'Japanese Maple Atlas media / visual-assets stream',
      note: 'Rights, provenance, identity qualification, privacy treatment, visual role and deterministic derivatives reviewed under the Visual-First Catalogue contract.'
    }]
  };
}

const sidecars = {};
for (const cultivarId of ['CUL-000011','CUL-000013']) {
  const assets = acquisition.records.filter(record => record.cultivarId === cultivarId).map(buildAsset);
  const sidecar = {
    schemaVersion: '1.0.0',
    cultivarId,
    publicationClass: 'catalogue-profile',
    status: 'approved',
    assets,
    roleException: null,
    review: {
      reviewedBy: 'Japanese Maple Atlas media / visual-assets stream',
      reviewedAt: '2026-07-29T07:30:00Z',
      notes: 'Complete three-role Visual-First gallery; all items carry lawful reuse, attribution, identity-confidence qualification and privacy treatment.'
    }
  };
  sidecars[cultivarId] = sidecar;
  writeJson(path.join(ROOT, `atlas-repository/catalogue-profiles/media/${cultivarId}.media.json`), sidecar);
}

for (const cultivarId of ['CUL-000011','CUL-000013']) {
  const profilePath = path.join(ROOT, `atlas-repository/catalogue-profiles/${cultivarId}.json`);
  const profile = readJson(profilePath);
  profile.profileVersion = '1.2.0';
  profile.media = {
    state: 'approved-primary',
    primaryMediaId: `MED-${cultivarId}-001`,
    candidateMediaIds: [`MED-${cultivarId}-002`, `MED-${cultivarId}-003`],
    governedGap: null,
    visualComplete: true,
    identityBasis: 'asserted'
  };
  profile.revisionHistory.push({
    version: '1.2.0',
    date: '2026-07-29T07:30:00Z',
    actor: 'Japanese Maple Atlas media / visual-assets stream',
    change: 'Replaced the temporary governed visual gap with a validated three-item Visual-First gallery using lawful, attributed and identity-qualified external photographs.'
  });
  writeJson(profilePath, profile);
}

const processorPath = path.join(ROOT, 'scripts/process-media.mjs');
let processor = fs.readFileSync(processorPath, 'utf8');
const oldResolver = `export function resolveDerivativePath(root, derivativePath) {\n  return path.join(root, clean(derivativePath));\n}`;
const newResolver = `export function resolveDerivativePath(root, derivativePath) {\n  const relative = clean(derivativePath);\n  return relative.startsWith('media/') ? path.join(root, 'public', relative) : path.join(root, relative);\n}`;
if (!processor.includes(oldResolver)) throw new Error('Expected derivative resolver was not found.');
processor = processor.replace(oldResolver, newResolver);
writeText(processorPath, processor);

const testPath = path.join(ROOT, 'tests/integration/catalogue-media-pipeline.test.mjs');
let testText = fs.readFileSync(testPath, 'utf8');
const testNeedle = `  assert.equal(manifest.entries.every(entry => entry.publicationClass === 'catalogue-profile'), true);\n`;
const testInsert = `${testNeedle}  assert.equal(fs.existsSync(path.join(root, 'public/media/derivatives/catalogue/cul-000011/med-cul-000011-001-display.png')), true);\n  assert.equal(fs.existsSync(path.join(root, 'media/derivatives/catalogue/cul-000011/med-cul-000011-001-display.png')), false);\n`;
if (!testText.includes(testNeedle)) throw new Error('Expected Catalogue media integration assertion was not found.');
testText = testText.replace(testNeedle, testInsert);
writeText(testPath, testText);

const ignorePath = path.join(ROOT, '.gitignore');
let ignoreText = fs.readFileSync(ignorePath, 'utf8');
ignoreText = ignoreText.replace('# Deterministic Sprint 11.5 media derivatives\npublic/media/derivatives/\n', '# Deterministic media derivatives are tracked under public/media/derivatives for static export.\n');
writeText(ignorePath, ignoreText);
fs.rmSync(path.join(ROOT, 'media/derivatives'), { recursive:true, force:true });

const registerPath = path.join(ROOT, 'docs/registers/MEDIA-CANDIDATE-REGISTER_C-001.md');
let register = fs.readFileSync(registerPath, 'utf8');
register = register.replace('**Register status:** ACTIVE — Visual-First reassessment complete; temporary governed gaps remain authoritative', '**Register status:** ACTIVE — CUL-000011 and CUL-000013 approved displayable galleries; remaining governed gaps authoritative');
register = register.replace(/^\| CUL-000011 \|.*$/m, '| CUL-000011 | *Acer palmatum* ‘Orange Dream’ | 3 approved | complete: habit-primary, foliage-detail and seasonal-diagnostic | approved displayable gallery; C2 visual target met |');
register = register.replace(/^\| CUL-000013 \|.*$/m, '| CUL-000013 | *Acer palmatum* ‘Inaba-shidare’ | 3 approved | complete: habit-primary, foliage-detail and seasonal-diagnostic | approved displayable gallery; C2 visual target met |');
register = register.replace('No candidate has been assigned an approved `MED-CUL-######-###` identity. Proposed IDs below are reservations only and become valid only through an approved sidecar.', '`MED-CUL` identities for CUL-000011 and CUL-000013 are approved through validated sidecars. Other proposed IDs remain reservations only.');
register = register.replace(/## CUL-000011[\s\S]*?(?=\n## CUL-000012)/, `## CUL-000011 — *Acer palmatum* ‘Orange Dream’\n\n| Candidate ID | Approved asset ID | Exact item | Rights | Identity confidence | Approved role | Disposition |\n| --- | --- | --- | --- | --- | --- | --- |\n| MCAND-CUL-000011-001 | MED-CUL-000011-001 | Wikimedia Commons, \`Acer palmatum 'Orange Dream' Klon palmowy 2017-05-14 01.jpg\` | Agnieszka Kwiecień (Nova); CC BY-SA 4.0 | \`source-asserted\`; cultivated specimen identified by the source at Wojsławice Arboretum | \`habit-primary\` | approved displayable asset; source and four derivatives validated |\n| MCAND-CUL-000011-002 | MED-CUL-000011-002 | Wikimedia Commons, Andy Mabbett frame 11 | Andy Mabbett; CC BY-SA 4.0 | \`community-identified\`; retail material sold under the cultivar name | \`foliage-detail\` | approved displayable asset with conspicuous identity qualification |\n| MCAND-CUL-000011-003 | MED-CUL-000011-003 | Wikimedia Commons, Andy Mabbett frame 06 | Andy Mabbett; CC BY-SA 4.0 | \`community-identified\`; retail material sold under the cultivar name | \`seasonal-diagnostic\` | approved displayable asset with conspicuous identity qualification |\n\n**Public qualification:** source-identified or community-identified; not independently authenticated by the Japanese Maple Atlas.\n\n**Execution result:** complete three-role gallery approved on 2026-07-29. Source SHA-256 and derivative lineage are recorded in \`CUL-000011.media.json\`.\n`);
register = register.replace(/## CUL-000013[\s\S]*?(?=\n## CUL-000014)/, `## CUL-000013 — *Acer palmatum* ‘Inaba-shidare’\n\n| Candidate ID | Approved asset ID | Exact item | Rights | Identity confidence | Approved role | Disposition |\n| --- | --- | --- | --- | --- | --- | --- |\n| MCAND-CUL-000013-002 | MED-CUL-000013-001 | Wikimedia Commons, \`Acer palmatum 'Inaba Shidare' IMG 1966.jpg\` | Don McCulley; CC BY-SA 4.0 | \`source-asserted\`; botanical-garden specimen identified by sign | \`habit-primary\` | approved displayable asset; similar red dissectum limitation disclosed |\n| MCAND-CUL-000013-005 | MED-CUL-000013-002 | Wikimedia Commons, \`Acer palmatum var. dissectum 'Inaba-shidare'.JPG\` | James Steakley; CC BY-SA 3.0 | \`community-identified\`; photographer identification in a botanist's garden | \`foliage-detail\` | approved displayable asset with conspicuous identity qualification |\n| MCAND-CUL-000013-003 | MED-CUL-000013-003 | Wikimedia Commons, Andy Mabbett autumn frame 01 | Andy Mabbett; CC BY-SA 4.0 | \`community-identified\`; garden-centre material sold under the cultivar name | \`seasonal-diagnostic\` | approved displayable asset with conspicuous identity qualification |\n\n**Public qualification:** source-identified or community-identified; not independently authenticated by the Japanese Maple Atlas. Similar red dissectum cultivars may be difficult to distinguish from photographs alone.\n\n**Execution result:** complete three-role gallery approved on 2026-07-29. Source SHA-256 and derivative lineage are recorded in \`CUL-000013.media.json\`.\n`);
register = register.replace(/## Execution blocker and preservation boundary[\s\S]*$/, `## Execution and preservation status\n\nExternal binary acquisition is now operational through the protected branch workflow. CUL-000011 and CUL-000013 have preserved originals, exact source SHA-256 values, metadata-neutral public derivatives, approved sidecars and complete three-role galleries.\n\nCUL-000012, CUL-000014 and CUL-000015 retain their existing controlled gaps or permission dependencies. No generic substitute, unresolved-rights image or weakened Reference Standard rule is introduced.\n`);
writeText(registerPath, register);

const queuePath = path.join(ROOT, 'docs/MEDIA-017_Visual-First-Permission-and-Source-Acquisition-Queue.md');
let queue = fs.readFileSync(queuePath, 'utf8');
queue = queue.replace('**Status:** ACTIVE EXECUTION QUEUE', '**Status:** ACTIVE — FIRST DISPLAYABLE ASSET PACKAGE COMPLETED');
queue = queue.replace(/## 5\. Open-source-byte acquisition queue[\s\S]*$/, `## 5. Completed open-source acquisition\n\n| Completed | Cultivar | Outcome |\n| --- | --- | --- |\n| 2026-07-29 | CUL-000011 ‘Orange Dream’ | three original Commons JPEGs preserved; habit-primary, foliage-detail and seasonal-diagnostic gallery approved |\n| 2026-07-29 | CUL-000013 ‘Inaba-shidare’ | three original Commons JPEGs preserved; habit-primary, foliage-detail and seasonal-diagnostic gallery approved |\n\nAll six items have exact source hashes, deterministic thumb/card/display/archive derivatives, item-level attribution, Creative Commons licence records, privacy treatment and conspicuous identity-confidence qualification.\n\n## 6. Next acquisition queue\n\n| Priority | Cultivar | Route | Required action |\n| ---: | --- | --- | --- |\n| 1 | CUL-000014 ‘Beni-kawa’ | Drew Avery CC BY 2.0 item plus permission-dependent role backfill | preserve the lawful item; continue habit-primary and winter-stem acquisition; prepare but do not self-approve any partial-gallery exception |\n| 2 | CUL-000016 ‘Autumn Moon’ | open Commons sequence | select and acquire a same-tree or otherwise clearly qualified three-role set |\n| 3 | CUL-000019 ‘Shin-deshōjō’ | Meise Commons sequence | acquire originals and confirm materially distinct roles |\n| 4 | CUL-000017 ‘Waterfall’ | Commons plus institutional route | secure whole-plant primary and exact item-level licences |\n| 5 | CUL-000018 ‘Aoyagi’ | institutional permission | obtain original files, derivative permission and accession mapping |\n| 6 | CUL-000020 ‘Red Dragon’ | institutional and contributor routes | obtain accession-mapped or clearly qualified originals |\n\n## 7. Remaining controlled gaps\n\nCUL-000012 ‘Koto-no-ito’, CUL-000014 ‘Beni-kawa’ and CUL-000015 ‘Trompenburg’ remain incomplete. Permission-dependent candidates are still leads only and have not been copied into public display packages.\n`);
writeText(queuePath, queue);

for (const request of [
  'docs/requests/MVG-CUL-000011-001_Orange-Dream.md',
  'docs/requests/MVG-CUL-000013-001_Inaba-shidare.md'
]) {
  const file = path.join(ROOT, request);
  if (!fs.existsSync(file)) continue;
  let text = fs.readFileSync(file, 'utf8');
  if (!text.includes('Closure notice — 2026-07-29')) {
    text = `> **Closure notice — 2026-07-29:** CLOSED. The temporary governed gap has been replaced by a validated three-item Visual-First gallery with preserved lawful originals, deterministic derivatives and an approved Catalogue media sidecar.\n\n${text}`;
    writeText(file, text);
  }
}

const handoffRows = Object.values(sidecars).flatMap(sidecar => sidecar.assets.map(asset => {
  const derivatives = asset.derivatives.map(item => `${item.profile}: \`${item.sha256}\``).join('<br>');
  return `| ${asset.cultivarId} | ${asset.id} | ${asset.role} | ${asset.creator} | ${asset.licence} | \`${asset.source.sha256}\` | ${derivatives} |`;
}));
const handoff = `# HANDOFF-MEDIA-CATALOGUE-006 — Visual-First C-001 Asset Package 01\n\n**Status:** EXECUTED — PROTECTED VALIDATION REQUIRED  \n**Baseline:** \`b33feecb617b23a7c9c31fe86b25459e891e8818\`  \n**Branch:** \`media/visual-first-assets-c001-c002\`  \n**Scope:** CUL-000011 and CUL-000013 complete galleries; CUL-000014 remains partial\n\n## Outcome\n\n- CUL-000011 ‘Orange Dream’: PASS — three lawful displayable items covering habit-primary, foliage-detail and seasonal-diagnostic.\n- CUL-000013 ‘Inaba-shidare’: PASS — three lawful displayable items covering habit-primary, foliage-detail and seasonal-diagnostic.\n- CUL-000014 ‘Beni-kawa’: CONDITIONAL — one lawful lead remains, but habit-primary and winter-stem coverage are missing and no exception is self-approved.\n\n## Asset and checksum register\n\n| Cultivar | Media ID | Role | Creator | Licence | Source SHA-256 | Derivative SHA-256 |\n| --- | --- | --- | --- | --- | --- | --- |\n${handoffRows.join('\n')}\n\n## Rights and identity posture\n\nEvery displayed item uses a documented Creative Commons licence and item-level attribution. Identity is deliberately classified as source-asserted or community-identified. Each non-documented item carries conspicuous wording that the Japanese Maple Atlas has not independently authenticated the clone. No generic substitute or unresolved-rights image is included.\n\n## Technical execution\n\n- exact original JPEG bytes retained beneath \`atlas-repository/media-sources/catalogue/\`;\n- source SHA-256 verified before processing;\n- deterministic thumb, card, display and archive JPEG derivatives generated;\n- derivative re-encoding removes EXIF, textual metadata and precise GPS;\n- Catalogue sidecars validate against schema v1.0.0;\n- canonical profiles transition from governed-gap to approved-primary only for the two complete galleries;\n- the generic derivative resolver now publishes \`/media/...\` outputs beneath \`public/media/...\` for static export;\n- Reference Standard G5 semantics are unchanged.\n\n## Validation\n\nThe finalisation workflow runs media processing, derivative drift checks, Catalogue and repository validation, compiler checks, unit/integration/coverage tests, production build, static regression, aggregate quality validation and release-manifest generation. Protected PR results remain the final merge gate.\n`;
writeText(path.join(ROOT, 'docs/HANDOFF-MEDIA-CATALOGUE-006_Visual-First-C001-Asset-Package-01.md'), handoff);

fs.rmSync(path.join(ROOT, 'quality-reports/media-review'), { recursive:true, force:true });
for (const relative of [
  '.github/workflows/visual-first-asset-acquisition.yml',
  '.github/workflows/visual-first-asset-review.yml',
  '.github/workflows/visual-first-candidate-review.yml',
  '.github/workflows/visual-first-asset-finalise.yml',
  'scripts/finalise-visual-first-c001.mjs'
]) fs.rmSync(path.join(ROOT, relative), { force:true });

console.log('Visual-First C-001 finalisation inputs prepared.');
