import fs from 'node:fs';

for (const cultivarId of ['CUL-000016', 'CUL-000019']) {
  const file = `atlas-repository/catalogue-profiles/media/${cultivarId}.media.json`;
  const sidecar = JSON.parse(fs.readFileSync(file, 'utf8'));
  sidecar.roleException = null;
  sidecar.review = {
    reviewedBy: 'Japanese Maple Atlas media / visual-assets stream',
    reviewedAt: '2026-07-29T19:00:00Z',
    notes: 'Complete three-role Visual-First gallery; every item carries a lawful Creative Commons reuse basis, complete attribution, source-asserted identity qualification, exact source preservation and privacy-treated deterministic derivatives.'
  };
  fs.writeFileSync(file, `${JSON.stringify(sidecar, null, 2)}\n`);
}
