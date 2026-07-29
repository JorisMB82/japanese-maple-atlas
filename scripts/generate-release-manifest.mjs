import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { CATALOGUE_COMPILER_VERSION } from '../lib/catalogue-profile-compiler.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'out');
const RELEASE = path.join(ROOT, 'release-artifacts');
const CATALOGUE = path.join(ROOT, 'atlas-repository', 'catalogue-profiles');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const relative = file => path.relative(ROOT, file).replaceAll(path.sep, '/');

if (!fs.existsSync(OUT)) {
  console.error('Production export is missing. Run `npm run build` before `npm run release:manifest`.');
  process.exit(1);
}

function filesUnder(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(file) : [file];
  }).sort();
}

fs.rmSync(RELEASE, { recursive: true, force: true });
fs.mkdirSync(RELEASE, { recursive: true });

const packageJson = readJson(path.join(ROOT, 'package.json'));
const manifest = readJson(path.join(ROOT, 'atlas-repository', 'manifest.json'));
const gates = readJson(path.join(ROOT, 'quality', 'quality-gates.json'));
const identityRegistryPath = path.join(CATALOGUE, 'contract', 'cultivar-identity-registry.json');
const identityRegistry = readJson(identityRegistryPath);
const catalogueProfileFiles = fs.readdirSync(CATALOGUE)
  .filter(file => /^CUL-\d{6}\.json$/.test(file))
  .sort()
  .map(file => path.join(CATALOGUE, file));
const exportFiles = filesUnder(OUT);
const releaseFiles = gates.releaseFiles.map(file => path.join(ROOT, file));
const allReleaseFiles = Array.from(new Set([...releaseFiles, ...catalogueProfileFiles, ...exportFiles].map(file => path.resolve(file))));
const checksums = allReleaseFiles.map(file => ({
  path: relative(file),
  bytes: fs.statSync(file).size,
  sha256: sha256(fs.readFileSync(file))
})).sort((a, b) => a.path.localeCompare(b.path));
const checksumByPath = new Map(checksums.map(item => [item.path, item]));
const catalogueProfiles = catalogueProfileFiles.map(file => {
  const profile = readJson(file);
  const checksum = checksumByPath.get(relative(file));
  return {
    cultivarId: profile.cultivarId,
    slug: profile.slug,
    version: profile.profileVersion,
    batchId: profile.batchId,
    riskLevel: profile.riskLevel,
    mediaState: profile.media.state,
    path: relative(file),
    sha256: checksum.sha256
  };
});
const catalogueHash = sha256(catalogueProfiles.map(profile => `${profile.path}:${profile.sha256}`).join('\n'));

const releaseManifest = {
  schemaVersion: '1.1.0',
  product: 'Japanese Maple Atlas',
  applicationVersion: packageJson.version,
  repositoryVersion: manifest.repositoryVersion,
  compilerVersion: manifest.compiler.version,
  repositoryHash: manifest.repositoryHash,
  graphHash: manifest.graph.graphHash,
  sourceCommit: process.env.GITHUB_SHA || process.env.VERCEL_GIT_COMMIT_SHA || 'local',
  sourceRef: process.env.GITHUB_REF_NAME || 'local',
  generatedAt: new Date().toISOString(),
  publicationModel: {
    classes: identityRegistry.publicationClasses,
    stableIdentityFamily: identityRegistry.identityFamily,
    stableIdentities: identityRegistry.entries.length
  },
  catalogue: {
    compilerVersion: CATALOGUE_COMPILER_VERSION,
    profileCount: catalogueProfiles.length,
    identityRegistryPath: relative(identityRegistryPath),
    identityRegistrySha256: checksumByPath.get(relative(identityRegistryPath))?.sha256 || null,
    catalogueHash,
    profiles: catalogueProfiles
  },
  qualityGates: {
    coverage: gates.coverage,
    requiredRoutes: gates.requiredRoutes.length + catalogueProfiles.length,
    repositoryInvariants: gates.repositoryInvariants
  },
  artifact: {
    staticExportFiles: exportFiles.length,
    files: checksums.length,
    bytes: checksums.reduce((sum, item) => sum + item.bytes, 0)
  },
  checksums
};

fs.writeFileSync(path.join(RELEASE, 'release-manifest.json'), `${JSON.stringify(releaseManifest, null, 2)}\n`);
fs.writeFileSync(path.join(RELEASE, 'checksums.sha256'), `${checksums.map(item => `${item.sha256}  ${item.path}`).join('\n')}\n`);
fs.writeFileSync(path.join(RELEASE, 'release-summary.md'), `# Japanese Maple Atlas ${packageJson.version}\n\n- Repository data: ${manifest.repositoryVersion}\n- Reference Standard compiler: ${manifest.compiler.version}\n- Catalogue compiler: ${CATALOGUE_COMPILER_VERSION}\n- Reference Standard repository objects: ${manifest.objectTotal}\n- Stable cultivar identities: ${identityRegistry.entries.length}\n- Published Catalogue Profiles: ${catalogueProfiles.length}\n- Reference Standard repository hash: \`${manifest.repositoryHash}\`\n- Catalogue hash: \`${catalogueHash}\`\n- Graph hash: \`${manifest.graph.graphHash}\`\n- Static files: ${exportFiles.length}\n- Release files with checksums: ${checksums.length}\n- Source commit: \`${releaseManifest.sourceCommit}\`\n`);

console.log('Japanese Maple Atlas — release manifest generated');
console.log(`Application version: ${packageJson.version}`);
console.log(`Stable cultivar identities: ${identityRegistry.entries.length}`);
console.log(`Catalogue Profiles: ${catalogueProfiles.length}`);
console.log(`Static export files: ${exportFiles.length}`);
console.log(`Checksummed files: ${checksums.length}`);
console.log(`Output: ${relative(RELEASE)}`);
