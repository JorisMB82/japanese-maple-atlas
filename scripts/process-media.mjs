import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isRasterMediaType, renderRasterProfiles } from '../lib/raster-media.mjs';

export const ROOT = path.resolve(import.meta.dirname, '..');
export const PROFILES = { thumb:[320,231], card:[560,404], display:[960,693], archive:[1440,1040] };
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const json = file => JSON.parse(fs.readFileSync(file,'utf8'));
const clean = value => value.replace(/^\/+/, '');

export function render(svg, profile, width, height) {
  return svg.replace('<svg ', `<svg width="${width}" height="${height}" data-atlas-profile="${profile}" `);
}

export function resolveSourcePath(root, sourcePath) {
  const relative = clean(sourcePath);
  return relative.startsWith('media/') ? path.join(root, 'public', relative) : path.join(root, relative);
}

export function resolveDerivativePath(root, derivativePath) {
  const relative = clean(derivativePath);
  return relative.startsWith('media/') ? path.join(root, 'public', relative) : path.join(root, relative);
}

function discoverSidecars(directory, pattern, publicationClass) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter(file => pattern.test(file))
    .sort()
    .map(file => ({ file:path.join(directory, file), publicationClass }));
}

export function buildMedia({
  check = false,
  root = ROOT,
  sideDirectory = path.join(root, 'atlas-repository/reference-standards/media'),
  catalogueSideDirectory = path.join(root, 'atlas-repository/catalogue-profiles/media'),
  manifestDirectory = path.join(root, 'public/media/derivatives')
} = {}) {
  const entries = [];
  const errors = [];
  const sidecars = [
    ...discoverSidecars(sideDirectory, /^RC-\d{3}\.media\.json$/, 'reference-standard'),
    ...discoverSidecars(catalogueSideDirectory, /^CUL-\d{6}\.media\.json$/, 'catalogue-profile')
  ];

  for (const descriptor of sidecars) {
    const sidecar = json(descriptor.file);
    for (const asset of sidecar.assets) {
      const sourcePath = resolveSourcePath(root, asset.source.path);
      if (!fs.existsSync(sourcePath)) {
        errors.push(`${asset.id}: source file missing`);
        continue;
      }
      const sourceBytes = fs.readFileSync(sourcePath);
      if (sha(sourceBytes) !== asset.source.sha256) errors.push(`${asset.id}: source checksum mismatch`);

      let rasterProfiles = null;
      if (isRasterMediaType(asset.mediaType)) {
        try {
          rasterProfiles = renderRasterProfiles(sourceBytes, PROFILES);
        } catch (error) {
          errors.push(`${asset.id}: ${error.message}`);
          continue;
        }
      }

      for (const derivative of asset.derivatives) {
        const profileDimensions = PROFILES[derivative.profile];
        if (!profileDimensions) {
          errors.push(`${asset.id}: unknown profile ${derivative.profile}`);
          continue;
        }

        let content;
        let width;
        let height;
        let mimeType;
        if (rasterProfiles) {
          const rendered = rasterProfiles[derivative.profile];
          content = rendered.bytes;
          width = rendered.width;
          height = rendered.height;
          mimeType = rendered.mimeType;
        } else {
          const svg = sourceBytes.toString('utf8');
          if (!svg.includes('<svg ')) {
            errors.push(`${asset.id}: non-raster source is not a processable SVG`);
            continue;
          }
          content = Buffer.from(render(svg, derivative.profile, ...profileDimensions));
          [width, height] = profileDimensions;
          mimeType = 'image/svg+xml';
        }

        const digest = sha(content);
        if (digest !== derivative.sha256) errors.push(`${asset.id}/${derivative.profile}: declared checksum mismatch`);
        if (derivative.width !== width || derivative.height !== height) errors.push(`${asset.id}/${derivative.profile}: declared dimensions mismatch`);
        if (derivative.mimeType !== mimeType) errors.push(`${asset.id}/${derivative.profile}: declared MIME type mismatch`);

        const target = resolveDerivativePath(root, derivative.path);
        if (check) {
          if (!fs.existsSync(target) || !fs.readFileSync(target).equals(content)) errors.push(`${asset.id}/${derivative.profile}: derivative drift`);
        } else {
          fs.mkdirSync(path.dirname(target), { recursive:true });
          fs.writeFileSync(target, content);
        }
        entries.push({
          mediaId: asset.id,
          publicationClass: descriptor.publicationClass,
          profile: derivative.profile,
          path: derivative.path,
          width,
          height,
          mimeType,
          sha256: digest
        });
      }
    }
  }

  const manifest = {
    version:'media-pipeline-v2.2',
    derivativeCount:entries.length,
    publicationClasses:[...new Set(entries.map(entry => entry.publicationClass))].sort(),
    entries
  };
  const manifestPath = path.join(manifestDirectory, 'manifest.json');
  const text = `${JSON.stringify(manifest, null, 2)}\n`;
  if (check) {
    if (!fs.existsSync(manifestPath) || fs.readFileSync(manifestPath, 'utf8') !== text) errors.push('media derivative manifest drift');
  } else {
    fs.mkdirSync(manifestDirectory, { recursive:true });
    fs.writeFileSync(manifestPath, text);
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return manifest;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const check = process.argv.includes('--check');
  const result = buildMedia({ check });
  console.log(`Media pipeline: PASS — ${result.derivativeCount} derivatives${check ? ' verified' : ' generated'}`);
}
