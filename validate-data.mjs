import fs from 'node:fs';
import Ajv from 'ajv';
const schema = JSON.parse(fs.readFileSync(new URL('../schemas/cultivar.schema.json', import.meta.url)));
const cultivars = JSON.parse(fs.readFileSync(new URL('../data/cultivars.json', import.meta.url)));
const ajv = new Ajv({allErrors:true, strict:false});
const validate = ajv.compile(schema);
let failed = false;
for (const c of cultivars) {
  if (!validate(c)) { failed = true; console.error(c.id, validate.errors); }
}
if (failed) process.exit(1);
console.log(`Validated ${cultivars.length} cultivar records.`);
