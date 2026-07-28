import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT, PROFILES, buildMedia, resolveDerivativePath, resolveSourcePath } from './process-media.mjs';
import { decodeRaster, detectRasterMime, hasRasterPrivacyMetadata, isRasterMediaType } from '../lib/raster-media.mjs';

const SIDE = path.join(ROOT, 'atlas-repository/reference-standards/media');
const PLAN = path.join(ROOT, 'atlas-repository/media-coverage.json');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const text = value => typeof value === 'string' && value.trim().length > 0;
const requiredProfiles = Object.keys(PROFILES);

function actualMime(bytes) {
  const prefix = bytes.subarray(0, 256).toString('utf8').trimStart();
  if (prefix.startsWith('<svg') || prefix.startsWith('<?xml')) return 'image/svg+xml';
  return detectRasterMime(bytes);
}

export function validateAsset(asset, { root = ROOT } = {}) {
  const errors = [];
  const label = asset?.id || 'unknown-media';
  const required = ['id','cultivarId','mediaType','role','status','assetPath','altText','evidentiaryStatus','creator','rightsHolder','licence','source','identification','privacy','derivatives','approvalHistory'];
  for (const key of required) if (asset?.[key] == null) errors.push(`${label}: missing ${key}`);
  if (errors.length) return errors;

  if (asset.status !== 'approved') errors.push(`${label}: asset not approved`);
  for (const key of ['creator','rightsHolder','licence','altText']) if (!text(asset[key])) errors.push(`${label}: ${key} must be non-empty`);
  if (!text(asset.source?.preservation)) errors.push(`${label}: source preservation statement is required`);
  if (!text(asset.identification?.specimenIdentity) || !text(asset.identification?.confidence) || !text(asset.identification?.editorialStatus)) {
    errors.push(`${label}: complete identification metadata is required`);
  }
  if (asset.privacy?.gpsRetained !== false) errors.push(`${label}: precise GPS must not be retained publicly`);

  const raster = isRasterMediaType(asset.mediaType);
  if (asset.mediaType === 'atlas-illustration') {
    if (asset.evidentiaryStatus !== 'illustrative-not-evidence') errors.push(`${label}: Atlas illustrations must remain non-evidentiary`);
    if (!text(asset.syntheticLabel) || asset.syntheticLabel.trim().length < 20) errors.push(`${label}: conspicuous synthetic label is required`);
  }
  if (raster) {
    if (!/^\/?atlas-repository\/media-sources\//.test(asset.source.path)) errors.push(`${label}: raster original must be preserved beneath atlas-repository/media-sources`);
    if (asset.privacy?.exifRetained !== false) errors.push(`${label}: public raster derivatives must not retain EXIF`);
    if (['supporting-evidence','primary-evidence'].includes(asset.evidentiaryStatus)) {
      if (asset.identification.confidence === 'not-applicable' || asset.identification.editorialStatus === 'illustrative') {
        errors.push(`${label}: evidentiary photographs require substantive identity metadata`);
      }
    }
  }

  const sourcePath = resolveSourcePath(root, asset.source.path);
  let sourceRaster = null;
  if (!fs.existsSync(sourcePath)) {
    errors.push(`${label}: source file missing`);
  } else {
    const sourceBytes = fs.readFileSync(sourcePath);
    if (sha(sourceBytes) !== asset.source.sha256) errors.push(`${label}: invalid source checksum`);
    if (raster) {
      try {
        sourceRaster = decodeRaster(sourceBytes);
        if (!['image/jpeg','image/png'].includes(sourceRaster.mimeType)) errors.push(`${label}: unsupported raster source MIME type`);
      } catch (error) {
        errors.push(`${label}: ${error.message}`);
      }
    }
  }

  const derivatives = Array.isArray(asset.derivatives) ? asset.derivatives : [];
  const profiles = derivatives.map(item => item.profile);
  for (const profile of requiredProfiles) {
    if (profiles.filter(value => value === profile).length !== 1) errors.push(`${label}: profile ${profile} must appear exactly once`);
  }
  if (profiles.some(profile => !requiredProfiles.includes(profile))) errors.push(`${label}: unknown derivative profile`);

  for (const derivative of derivatives) {
    const derivativeLabel = `${label}/${derivative.profile || 'unknown'}`;
    if (derivative.derivedFrom !== asset.id) errors.push(`${derivativeLabel}: derivedFrom must reference the asset`);
    if (!Number.isInteger(derivative.width) || derivative.width < 1 || !Number.isInteger(derivative.height) || derivative.height < 1) {
      errors.push(`${derivativeLabel}: invalid dimensions`);
    }
    if (!['image/svg+xml','image/jpeg','image/png'].includes(derivative.mimeType)) errors.push(`${derivativeLabel}: unsupported MIME type`);
    const target = resolveDerivativePath(root, derivative.path);
    if (!fs.existsSync(target)) {
      errors.push(`${derivativeLabel}: derivative file missing`);
      continue;
    }
    const bytes = fs.readFileSync(target);
    if (sha(bytes) !== derivative.sha256) errors.push(`${derivativeLabel}: invalid derivative checksum`);
    let mimeType;
    try { mimeType = actualMime(bytes); } catch (error) { errors.push(`${derivativeLabel}: ${error.message}`); continue; }
    if (mimeType !== derivative.mimeType) errors.push(`${derivativeLabel}: MIME declaration does not match bytes`);

    if (mimeType === 'image/svg+xml') {
      if (raster) errors.push(`${derivativeLabel}: raster media cannot publish SVG derivatives`);
    } else {
      if (!raster) errors.push(`${derivativeLabel}: non-raster media cannot publish raster derivatives`);
      if (hasRasterPrivacyMetadata(bytes, mimeType)) errors.push(`${derivativeLabel}: public derivative retains EXIF or textual metadata`);
      try {
        const decoded = decodeRaster(bytes);
        if (decoded.width !== derivative.width || decoded.height !== derivative.height) errors.push(`${derivativeLabel}: dimensions do not match encoded bytes`);
        if (sourceRaster && (decoded.width > sourceRaster.width || decoded.height > sourceRaster.height)) errors.push(`${derivativeLabel}: derivative upscales beyond oriented source dimensions`);
      } catch (error) {
        errors.push(`${derivativeLabel}: ${error.message}`);
      }
    }
  }

  const display = derivatives.find(item => item.profile === 'display');
  const thumb = derivatives.find(item => item.profile === 'thumb');
  if (display && asset.assetPath !== display.path) errors.push(`${label}: assetPath must reference the display derivative`);
  if (thumb && asset.thumbnailPath != null && asset.thumbnailPath !== thumb.path) errors.push(`${label}: thumbnailPath must reference the thumb derivative`);
  return errors;
}

export function validateMediaRepository({
  root = ROOT,
  sideDirectory = path.join(root, 'atlas-repository/reference-standards/media'),
  coveragePlan = path.join(root, 'atlas-repository/media-coverage.json'),
  requireCoverage = true
} = {}) {
  const errors = [];
  let assets = 0;
  const files = fs.readdirSync(sideDirectory).filter(file => /^RC-\d{3}\.media\.json$/.test(file)).sort();
  for (const file of files) {
    const sidecar = read(path.join(sideDirectory, file));
    if (sidecar.status !== 'approved') errors.push(`${sidecar.recordId}: sidecar not approved`);
    for (const asset of sidecar.assets) {
      assets += 1;
      errors.push(...validateAsset(asset, { root }));
    }
  }

  try { buildMedia({ check:true, root, sideDirectory, manifestDirectory:path.join(root, 'public/media/derivatives') }); }
  catch (error) { errors.push(error.message); }

  if (requireCoverage) {
    const plan = read(coveragePlan);
    const ids = plan.records.map(row => row.recordId);
    if (plan.records.length !== 20 || new Set(ids).size !== 20) errors.push('coverage plan must contain RC-001 through RC-020 exactly once');
    for (let number = 1; number <= 20; number += 1) {
      const id = `RC-${String(number).padStart(3,'0')}`;
      if (!ids.includes(id)) errors.push(`coverage plan missing ${id}`);
    }
    for (const row of plan.records.slice(0,5)) if (row.releaseMinimum !== 'met') errors.push(`${row.recordId}: release minimum not met`);
  }
  return { errors, assets, derivatives:assets * requiredProfiles.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = validateMediaRepository({ root:ROOT, sideDirectory:SIDE, coveragePlan:PLAN });
  if (result.errors.length) {
    console.error(result.errors.join('\n'));
    process.exit(1);
  }
  console.log(`Media validation: PASS — ${result.assets} governed assets; ${result.derivatives} derivatives; 20-record coverage plan`);
}
