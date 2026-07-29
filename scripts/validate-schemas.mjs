import fs from 'node:fs';
import path from 'node:path';
import { formatSchemaErrors, validateJsonSchema } from '../lib/json-schema-validator.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const REPOSITORY = path.join(ROOT, 'atlas-repository');
const SCHEMAS = path.join(REPOSITORY, 'schemas');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const jsonFiles = directory => fs.readdirSync(directory)
  .filter(file => file.endsWith('.json'))
  .sort()
  .map(file => path.join(directory, file));

const targets = [
  ['cultivar.schema.json', 'cultivars'],
  ['assertion.schema.json', 'assertions'],
  ['evidence.schema.json', 'evidence'],
  ['source.schema.json', 'sources'],
  ['taxonomy.schema.json', 'taxonomy'],
  ['relationship.schema.json', 'relationships'],
  ['relationship-type.schema.json', 'relationship-types'],
  ['media.schema.json', 'media'],
  ['contributor.schema.json', 'contributors'],
  ['submission.schema.json', 'submissions'],
  ['editorial-workflow.schema.json', 'editorial-workflows'],
  ['editorial-review.schema.json', 'editorial-reviews'],
  ['manifest.schema.json', 'manifest.json'],
  ['graph-index.schema.json', path.join('indexes', 'graph-index.json')],
  ['catalogue-media.schema.json', path.join('catalogue-profiles', 'media')]
];

const failures = [];
let schemaCount = 0;
let objectCount = 0;

for (const [schemaName, target] of targets) {
  const schemaPath = path.join(SCHEMAS, schemaName);
  if (!fs.existsSync(schemaPath)) {
    failures.push(`${schemaName}: schema file is missing`);
    continue;
  }
  const schema = readJson(schemaPath);
  schemaCount += 1;
  const targetPath = path.join(REPOSITORY, target);
  if (!fs.existsSync(targetPath)) continue;
  const files = fs.statSync(targetPath).isDirectory() ? jsonFiles(targetPath) : [targetPath];
  for (const file of files) {
    const result = validateJsonSchema(readJson(file), schema);
    objectCount += 1;
    if (!result.valid) {
      const relative = path.relative(ROOT, file).replaceAll(path.sep, '/');
      for (const error of formatSchemaErrors(result.errors)) failures.push(`${relative}: ${error}`);
    }
  }
}

console.log('Japanese Maple Atlas — JSON Schema validation');
console.log(`Schemas: ${schemaCount}`);
console.log(`Objects validated: ${objectCount}`);
if (failures.length) {
  console.error(`\nErrors: ${failures.length}`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('\nErrors: 0');
console.log('Schema validation: PASS');
