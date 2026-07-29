import jpegModule from 'jpeg-js';
import pngModule from 'pngjs';

const { decode: decodeJpeg, encode: encodeJpeg } = jpegModule;
const { PNG } = pngModule;

export const RASTER_MEDIA_TYPES = new Set(['photograph', 'archival-photograph', 'specimen-image', 'scan']);
export const RASTER_MIME_TYPES = new Set(['image/jpeg', 'image/png']);

const JPEG_SOI = Buffer.from([0xff, 0xd8]);
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

export function isRasterMediaType(mediaType) {
  return RASTER_MEDIA_TYPES.has(mediaType);
}

export function detectRasterMime(buffer) {
  if (buffer.subarray(0, 2).equals(JPEG_SOI)) return 'image/jpeg';
  if (buffer.subarray(0, 8).equals(PNG_SIGNATURE)) return 'image/png';
  throw new Error('unsupported raster format; expected JPEG or PNG');
}

function jpegSegments(buffer) {
  const segments = [];
  if (!buffer.subarray(0, 2).equals(JPEG_SOI)) return segments;
  let offset = 2;
  while (offset + 3 < buffer.length) {
    if (buffer[offset] !== 0xff) break;
    let marker = buffer[offset + 1];
    while (marker === 0xff && offset + 2 < buffer.length) marker = buffer[++offset + 1];
    offset += 2;
    if (marker === 0xd9 || marker === 0xda) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > buffer.length) break;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) break;
    segments.push({ marker, start: offset + 2, end: offset + length });
    offset += length;
  }
  return segments;
}

export function detectJpegMetadata(buffer) {
  const segments = jpegSegments(buffer);
  return {
    hasExif: segments.some(segment => segment.marker === 0xe1 && buffer.subarray(segment.start, segment.start + 6).toString('ascii') === 'Exif\0\0'),
    hasComment: segments.some(segment => segment.marker === 0xfe),
    hasApplicationMetadata: segments.some(segment => segment.marker >= 0xe1 && segment.marker <= 0xef)
  };
}

export function hasRasterPrivacyMetadata(buffer, mimeType = detectRasterMime(buffer)) {
  if (mimeType === 'image/jpeg') {
    const metadata = detectJpegMetadata(buffer);
    return metadata.hasExif || metadata.hasComment || metadata.hasApplicationMetadata;
  }
  if (mimeType === 'image/png') {
    const decoded = PNG.sync.read(buffer, { skipRescale: true });
    return Boolean(decoded.data && (decoded.text || decoded.gamma || decoded.exif));
  }
  return false;
}

export function decodeRaster(buffer) {
  const mimeType = detectRasterMime(buffer);
  if (mimeType === 'image/jpeg') {
    const decoded = decodeJpeg(buffer, { useTArray: true, formatAsRGBA: true });
    if (!decoded?.width || !decoded?.height || !decoded?.data) throw new Error('invalid JPEG source');
    return { ...decoded, mimeType };
  }
  const decoded = PNG.sync.read(buffer, { skipRescale: true });
  if (!decoded?.width || !decoded?.height || !decoded?.data) throw new Error('invalid PNG source');
  return { width: decoded.width, height: decoded.height, data: decoded.data, mimeType };
}

export function renderRasterProfiles(buffer, profiles) {
  const source = decodeRaster(buffer);
  const output = {};
  for (const [profile, [targetWidth, targetHeight]] of Object.entries(profiles)) {
    const scale = Math.min(targetWidth / source.width, targetHeight / source.height, 1);
    const width = Math.max(1, Math.round(source.width * scale));
    const height = Math.max(1, Math.round(source.height * scale));
    const resized = resizeRgba(source.data, source.width, source.height, width, height);
    if (source.mimeType === 'image/jpeg') {
      const encoded = encodeJpeg({ data: resized, width, height }, 90);
      output[profile] = { bytes: Buffer.from(encoded.data), width, height, mimeType: 'image/jpeg' };
    } else {
      output[profile] = { bytes: PNG.sync.write({ data: Buffer.from(resized), width, height }, { colorType: 6, inputColorType: 6, inputHasAlpha: true }), width, height, mimeType: 'image/png' };
    }
  }
  return output;
}

function resizeRgba(source, sourceWidth, sourceHeight, targetWidth, targetHeight) {
  const target = new Uint8Array(targetWidth * targetHeight * 4);
  for (let y = 0; y < targetHeight; y += 1) {
    const sourceY = Math.min(sourceHeight - 1, Math.floor(y * sourceHeight / targetHeight));
    for (let x = 0; x < targetWidth; x += 1) {
      const sourceX = Math.min(sourceWidth - 1, Math.floor(x * sourceWidth / targetWidth));
      const sourceIndex = (sourceY * sourceWidth + sourceX) * 4;
      const targetIndex = (y * targetWidth + x) * 4;
      target[targetIndex] = source[sourceIndex];
      target[targetIndex + 1] = source[sourceIndex + 1];
      target[targetIndex + 2] = source[sourceIndex + 2];
      target[targetIndex + 3] = source[sourceIndex + 3];
    }
  }
  return target;
}
