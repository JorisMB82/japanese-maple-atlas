import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const INBOX = path.join(ROOT, 'editorial-inbox');
const errors = [];
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const jsonFiles = dir => fs.existsSync(dir) ? fs.readdirSync(dir).filter(file => file.endsWith('.json')).sort().map(file => path.join(dir, file)) : [];

const contributorFiles = jsonFiles(path.join(INBOX, 'contributors'));
const submissionFiles = jsonFiles(path.join(INBOX, 'submissions'));
const contributors = contributorFiles.map(read);
const submissions = submissionFiles.map(read);
const contributorIds = new Set();

for (const contributor of contributors) {
  if (!/^CTR-[A-Z0-9-]+$/.test(contributor.id || '')) errors.push(`Invalid contributor ID: ${contributor.id}`);
  if (contributorIds.has(contributor.id)) errors.push(`Duplicate contributor ID: ${contributor.id}`);
  contributorIds.add(contributor.id);
  for (const field of ['displayName','contributorType','roles','status','authorityScope','createdAt','version']) if (!(field in contributor)) errors.push(`${contributor.id}: missing ${field}`);
  if (!Array.isArray(contributor.roles) || contributor.roles.length === 0) errors.push(`${contributor.id}: roles must be non-empty`);
}

const stages = ['evidence-collection','evidence-evaluation','assertion-extraction','assertion-matrix','approved-register','unresolved-register','rejected-register','editorial-synthesis','five-pass-review','corrected-reference-standard','editorial-verification','freeze'];
const validStatuses = ['draft','submitted','triage','needs-revision','under-review','accepted','rejected','withdrawn'];
const ids = new Set();
for (const submission of submissions) {
  if (!/^SUB-[A-Z0-9-]+$/.test(submission.id || '')) errors.push(`Invalid submission ID: ${submission.id}`);
  if (ids.has(submission.id)) errors.push(`Duplicate submission ID: ${submission.id}`);
  ids.add(submission.id);
  for (const field of ['targetType','targetId','contributorId','contributionType','title','summary','status','submittedAt','version','workflow']) if (!(field in submission)) errors.push(`${submission.id}: missing ${field}`);
  if (!contributorIds.has(submission.contributorId)) errors.push(`${submission.id}: unknown contributor ${submission.contributorId}`);
  if (!validStatuses.includes(submission.status)) errors.push(`${submission.id}: invalid status ${submission.status}`);
  if (!submission.workflow || !stages.includes(submission.workflow.currentStage)) errors.push(`${submission.id}: invalid workflow stage`);
  const reviewPasses = submission.workflow?.reviewPasses || [];
  const passNumbers = new Set();
  for (const review of reviewPasses) {
    if (!Number.isInteger(review.passNumber) || review.passNumber < 1 || review.passNumber > 5) errors.push(`${submission.id}: invalid review pass ${review.passNumber}`);
    if (passNumbers.has(review.passNumber)) errors.push(`${submission.id}: duplicate review pass ${review.passNumber}`);
    passNumbers.add(review.passNumber);
    for (const field of ['code','lens','result','exitCriterion','completedAt']) if (!(field in review)) errors.push(`${submission.id} pass ${review.passNumber}: missing ${field}`);
  }
  if (submission.workflow.status === 'frozen') {
    if (submission.status !== 'accepted') errors.push(`${submission.id}: frozen workflow requires accepted submission`);
    if (submission.workflow.currentStage !== 'freeze') errors.push(`${submission.id}: frozen workflow must be at freeze`);
    if (reviewPasses.length !== 5 || reviewPasses.some(pass => !['pass','pass-qualified'].includes(pass.result))) errors.push(`${submission.id}: frozen workflow requires five successful review passes`);
    if (!submission.evidenceProvided || !submission.uncertaintyDisclosed || !submission.rightsConfirmed) errors.push(`${submission.id}: frozen workflow missing contributor attestations`);
  }
}

console.log('Japanese Maple Atlas — contributor input validation');
console.log(`Contributors: ${contributors.length}`);
console.log(`Submissions: ${submissions.length}`);
if (errors.length) {
  console.error(`Errors: ${errors.length}`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('Errors: 0');
console.log('Contributor input validation: PASS');
