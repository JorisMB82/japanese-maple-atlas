import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const testPath = path.join(ROOT, 'tests/regression/static-export.test.mjs');
let text = fs.readFileSync(testPath, 'utf8');
const oldBlock = `test('published Catalogue profiles disclose class and temporary governed visual gaps', () => {\n  for (const slug of ['orange-dream', 'koto-no-ito', 'inaba-shidare', 'beni-kawa', 'trompenburg']) {\n    const profile = htmlFor(\`/cultivars/\${slug}\`);\n    assert.match(profile, /Catalogue Profile/i);\n    assert.match(profile, /No approved cultivar-specific image is currently available/i);\n    assert.match(profile, /No generic or substitute cultivar image is displayed/i);\n    assert.match(profile, /governed visual gap/i);\n  }\n});`;
const newBlock = `test('published Catalogue profiles disclose approved galleries or controlled visual gaps', () => {\n  for (const slug of ['orange-dream', 'inaba-shidare']) {\n    const profile = htmlFor(\`/cultivars/\${slug}\`);\n    assert.match(profile, /Catalogue Profile/i);\n    assert.match(profile, /approved-gallery/i);\n    assert.match(profile, /Source-identified|Community-identified/i);\n    assert.match(profile, /not independently authenticated by the Japanese Maple Atlas/i);\n    assert.match(profile, new RegExp(\`/media/derivatives/catalogue/cul-0000\${slug === 'orange-dream' ? '11' : '13'}/\`));\n  }\n\n  for (const slug of ['koto-no-ito', 'beni-kawa', 'trompenburg']) {\n    const profile = htmlFor(\`/cultivars/\${slug}\`);\n    assert.match(profile, /Catalogue Profile/i);\n    assert.match(profile, /No approved cultivar-specific image is currently available/i);\n    assert.match(profile, /No generic or substitute cultivar image is displayed/i);\n    assert.match(profile, /governed visual gap/i);\n  }\n});`;
if (!text.includes(oldBlock)) throw new Error('Expected pre-asset Catalogue static regression block was not found.');
text = text.replace(oldBlock, newBlock);
fs.writeFileSync(testPath, text);
fs.rmSync(path.join(ROOT, 'scripts/patch-visual-first-static-regression.mjs'), { force:true });
console.log('Updated static export regression for two approved galleries and three controlled gaps.');
