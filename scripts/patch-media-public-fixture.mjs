import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const testPath = path.join(ROOT, 'tests/unit/media-governance.test.mjs');
let text = fs.readFileSync(testPath, 'utf8');
const oldLine = "    const target = path.join(root, relativePath.replace(/^\\//, ''));";
const newLine = "    const target = path.join(root, 'public', relativePath.replace(/^\\//, ''));";
if (!text.includes(oldLine)) throw new Error('Expected raster fixture derivative target was not found.');
text = text.replace(oldLine, newLine);
fs.writeFileSync(testPath, text);
fs.rmSync(path.join(ROOT, 'scripts/patch-media-public-fixture.mjs'), { force:true });
console.log('Updated raster unit fixture for static-public derivative paths.');
