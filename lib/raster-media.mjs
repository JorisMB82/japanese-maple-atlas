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

export function hasJpegExif(buffer) {
  return jpegSegments(buffer).some(({ marker, start, end }) =>
    marker === 0xe1 && end - start >= 6 && buffer.subarray(start, start + 6).toString('ascii') === 'Exif\0\0');
}

export function readExifOrientation(buffer) {
  const segment = jpegSegments(buffer).find(({ marker, start, end }) =>
    marker === 0xe1 && end - start >= 14 && buffer.subarray(start, start + 6).toString('ascii') === 'Exif\0\0');
  if (!segment) return 1;

  const tiff = segment.start + 6;
  const littleEndian = buffer.subarray(tiff, tiff + 2).toString('ascii') === 'II';
  const bigEndian = buffer.subarray(tiff, tiff + 2).toString('ascii') === 'MM';
  if (!littleEndian && !bigEndian) return 1;
  const read16 = littleEndian ? Buffer.prototype.readUInt16LE : Buffer.prototype.readUInt16BE;
  const read32 = littleEndian ? Buffer.prototype.readUInt32LE : Buffer.prototype.readUInt32BE;
  if (read16.call(buffer, tiff + 2) !== 42) return 1;
  const ifdOffset = read32.call(buffer, tiff + 4);
  const ifd = tiff + ifdOffset;
  if (ifd + 2 > segment.end) return 1;
  const count = read16.call(buffer, ifd);
  for (let index = 0; index < count; index += 1) {
    const entry = ifd + 2 + index * 12;
    if (entry + 12 > segment.end) break;
    const tag = read16.call(buffer, entry);
    const type = read16.call(buffer, entry + 2);
    const values = read32.call(buffer, entry + 4);
    if (tag === 0x0112 && type === 3 && values === 1) {
      const orientation = read16.call(buffer, entry + 8);
      return orientation >= 1 && orientation <= 8 ? orientation : 1;
    }
  }
  return 1;
}

function pngChunkTypes(buffer) {
  if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) return [];
  const types = [];
  let offset = 8;
  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    const end = offset + 12 + length;
    if (end > buffer.length) break;
    types.push(type);
    offset = end;
    if (type === 'IEND') break;
  }
  return types;
}

export function hasRasterPrivacyMetadata(buffer, mimeType = detectRasterMime(buffer)) {
  if (mimeType === 'image/jpeg') return hasJpegExif(buffer);
  return pngChunkTypes(buffer).some(type => ['eXIf', 'tEXt', 'zTXt', 'iTXt'].includes(type));
}

function orientRgba(image, orientation) {
  if (orientation === 1) return { ...image, data: Uint8Array.from(image.data) };
  const swap = orientation >= 5;
  const outputWidth = swap ? image.height : image.width;
  const outputHeight = swap ? image.width : image.height;
  const output = new Uint8Array(outputWidth * outputHeight * 4);

  const sourceCoordinate = (x, y) => {
    switch (orientation) {
      case 2: return [image.width - 1 - x, y];
      case 3: return [image.width - 1 - x, image.height - 1 - y];
      case 4: return [x, image.height - 1 - y];
      case 5: return [y, x];
      case 6: return [y, image.height - 1 - x];
      case 7: return [image.width - 1 - y, image.height - 1 - x];
      case 8: return [image.width - 1 - y, x];
      default: return [x, y];
    }
  };

  for (let y = 0; y < outputHeight; y += 1) {
    for (let x = 0; x < outputWidth; x += 1) {
      const [sourceX, sourceY] = sourceCoordinate(x, y);
      const sourceIndex = (sourceY * image.width + sourceX) * 4;
      const targetIndex = (y * outputWidth + x) * 4;
      output.set(image.data.subarray(sourceIndex, sourceIndex + 4), targetIndex);
    }
  }
  return { width: outputWidth, height: outputHeight, data: output };
}

export function decodeRaster(buffer) {
  const mimeType = detectRasterMime(buffer);
  if (mimeType === 'image/jpeg') {
    const decoded = decodeJpeg(buffer, {
      useTArray: true,
      formatAsRGBA: true,
      tolerantDecoding: false,
      maxResolutionInMP: 80,
      maxMemoryUsageInMB: 512
    });
    return { ...orientRgba(decoded, readExifOrientation(buffer)), mimeType, sourceOrientation: readExifOrientation(buffer) };
  }
  const decoded = PNG.sync.read(buffer, { skipRescale: true });
  return { width: decoded.width, height: decoded.height, data: Uint8Array.from(decoded.data), mimeType, sourceOrientation: 1 };
}

export function fitDimensions(width, height, maxWidth, maxHeight) {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.floor(width * scale)),
    height: Math.max(1, Math.floor(height * scale)),
    scale
  };
}

export function resizeRgba(image, width, height) {
  if (width === image.width && height === image.height) return { ...image, data: Uint8Array.from(image.data) };
  const output = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    const sourceY = Math.max(0, Math.min(image.height - 1, (y + 0.5) * image.height / height - 0.5));
    const y0 = Math.floor(sourceY);
    const y1 = Math.min(image.height - 1, y0 + 1);
    const fy = sourceY - y0;
    for (let x = 0; x < width; x += 1) {
      const sourceX = Math.max(0, Math.min(image.width - 1, (x + 0.5) * image.width / width - 0.5));
      const x0 = Math.floor(sourceX);
      const x1 = Math.min(image.width - 1, x0 + 1);
      const fx = sourceX - x0;
      const target = (y * width + x) * 4;
      for (let channel = 0; channel < 4; channel += 1) {
        const topLeft = image.data[(y0 * image.width + x0) * 4 + channel];
        const topRight = image.data[(y0 * image.width + x1) * 4 + channel];
        const bottomLeft = image.data[(y1 * image.width + x0) * 4 + channel];
        const bottomRight = image.data[(y1 * image.width + x1) * 4 + channel];
        const top = topLeft + (topRight - topLeft) * fx;
        const bottom = bottomLeft + (bottomRight - bottomLeft) * fx;
        output[target + channel] = Math.round(top + (bottom - top) * fy);
      }
    }
  }
  return { width, height, data: output };
}

export function encodeRaster(image, mimeType, { quality = 90 } = {}) {
  if (mimeType === 'image/jpeg') {
    return Buffer.from(encodeJpeg({ data: Buffer.from(image.data), width: image.width, height: image.height }, quality).data);
  }
  if (mimeType === 'image/png') {
    return PNG.sync.write({ width: image.width, height: image.height, data: Buffer.from(image.data) }, {
      colorType: 6,
      inputColorType: 6,
      inputHasAlpha: true,
      deflateLevel: 9,
      deflateStrategy: 3,
      filterType: -1
    });
  }
  throw new Error(`unsupported output MIME type ${mimeType}`);
}

export function renderRasterProfiles(sourceBuffer, profiles, { quality = 90 } = {}) {
  const decoded = decodeRaster(sourceBuffer);
  const rendered = {};
  for (const [profile, [maxWidth, maxHeight]] of Object.entries(profiles)) {
    const dimensions = fitDimensions(decoded.width, decoded.height, maxWidth, maxHeight);
    const image = resizeRgba(decoded, dimensions.width, dimensions.height);
    const bytes = encodeRaster(image, decoded.mimeType, { quality });
    rendered[profile] = {
      bytes,
      width: image.width,
      height: image.height,
      mimeType: decoded.mimeType,
      sourceWidth: decoded.width,
      sourceHeight: decoded.height,
      sourceOrientation: decoded.sourceOrientation
    };
  }
  return rendered;
}
