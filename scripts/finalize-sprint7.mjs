import fs from 'node:fs';

const replaceRange = (file, startMarker, endMarker, replacement) => {
  const source = fs.readFileSync(file, 'utf8');
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`${file}: start marker not found`);
  const endStart = source.indexOf(endMarker, start);
  if (endStart < 0) throw new Error(`${file}: end marker not found`);
  const end = endStart + endMarker.length;
  fs.writeFileSync(file, `${source.slice(0, start)}${replacement}${source.slice(end)}`);
};

const compilerReplacement = `  const registry = \`// GENERATED FILE — DO NOT EDIT. Run \\\`npm run compile:atlas\\\`.\\n\\nimport fs from 'node:fs';\\nimport path from 'node:path';\\n\\nconst repositoryRoot = path.join(process.cwd(), 'atlas-repository');\\nconst loadJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));\\nconst loadDirectory = directory => {\\n  const fullPath = path.join(repositoryRoot, directory);\\n  return fs.readdirSync(fullPath)\\n    .filter(file => file.endsWith('.json'))\\n    .sort()\\n    .map(file => loadJson(path.join(fullPath, file)));\\n};\\n\\nexport const manifest = loadJson(path.join(repositoryRoot, 'manifest.json'));\\nexport const cultivars = loadDirectory('cultivars');\\nexport const assertions = loadDirectory('assertions');\\nexport const evidence = loadDirectory('evidence');\\nexport const sources = loadDirectory('sources');\\nexport const taxa = loadDirectory('taxonomy');\\nexport const relationships = loadDirectory('relationships');\\nexport const media = loadDirectory('media');\\nexport const contributors = loadDirectory('contributors');\\nexport const submissions = loadDirectory('submissions');\\nexport const editorialWorkflows = loadDirectory('editorial-workflows');\\nexport const editorialReviews = loadDirectory('editorial-reviews');\\n\`;
  outputs.set('lib/repository-registry.js', registry);
`;

replaceRange(
  'scripts/compile-atlas.mjs',
  '  function registrySection(',
  "  outputs.set('lib/repository-registry.js', registry);\n",
  compilerReplacement
);

const validatorReplacement = `const registry = fs.readFileSync(path.join(ROOT, 'lib', 'repository-registry.js'), 'utf8');
const registryCategories = ['cultivars','assertions','evidence','sources','taxonomy','relationships','media','contributors','submissions','editorial-workflows','editorial-reviews'];
for (const category of registryCategories) if (!registry.includes(\`loadDirectory('\\${category}')\`)) errors.push(\`Registry missing category \\${category}\`);
if (!registry.includes("loadJson(path.join(repositoryRoot, 'manifest.json'))")) errors.push('Registry missing manifest loader');
if (!errors.some(error => error.startsWith('Registry missing'))) pass('generated JavaScript registry');
`;

replaceRange(
  'scripts/validate-repository.mjs',
  "const registry = fs.readFileSync(path.join(ROOT, 'lib', 'repository-registry.js'), 'utf8');",
  "if (!errors.some(error => error.startsWith('Registry missing'))) pass('generated JavaScript registry');\n",
  validatorReplacement
);

console.log('Sprint 7 compiler and validator finalisation applied.');
