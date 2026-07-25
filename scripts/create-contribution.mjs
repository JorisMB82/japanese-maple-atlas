import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const readArg = name => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
};
const required = ['target','type','title','contributor'];
const values = Object.fromEntries(required.map(key => [key, readArg(key)]));
const missing = required.filter(key => !values[key]);
if (missing.length) {
  console.error(`Missing arguments: ${missing.map(key => `--${key}`).join(', ')}`);
  console.error('Usage: npm run contribution:new -- --target RC-001 --type evidence-addition --title "Title" --contributor CTR-CONTRIBUTOR-ID');
  process.exit(1);
}
const date = new Date().toISOString().slice(0, 10);
const slug = values.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 36);
const id = `SUB-DRAFT-${date.replaceAll('-', '')}-${slug.toUpperCase()}`;
const submission = {
  id,
  targetType: 'cultivar',
  targetId: values.target,
  contributorId: values.contributor,
  contributionType: values.type,
  title: values.title,
  summary: readArg('summary') || 'Describe the proposed change, evidence, uncertainty, and expected repository impact.',
  status: 'draft',
  submittedAt: date,
  version: '0.1',
  evidenceProvided: false,
  uncertaintyDisclosed: false,
  rightsConfirmed: false,
  workflow: { status: 'draft', currentStage: 'evidence-collection', startedAt: date, reviewPasses: [] }
};
const target = path.join(ROOT, 'editorial-inbox', 'submissions', `${id}.json`);
if (fs.existsSync(target)) {
  console.error(`Contribution already exists: ${path.relative(ROOT, target)}`);
  process.exit(1);
}
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, `${JSON.stringify(submission, null, 2)}\n`);
console.log(`Created ${path.relative(ROOT, target)}`);
console.log('Complete the evidence and attestation fields, then run npm run validate:contributions.');
