import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../helpers/repository-fixture.mjs';

const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('mobile navigation uses a disclosed menu with every destination', () => {
  const header = read('components/SiteHeader.js');
  const css = read('app/globals.css');
  for (const destination of ['Explorer', 'Compare', 'Graph', 'Editorial', 'Contribute', 'Sources', 'Media', 'Repository', 'About']) assert.match(header, new RegExp(`'${destination}'`));
  assert.match(header, /aria-expanded/);
  assert.match(header, /aria-controls="primary-navigation"/);
  assert.match(header, /aria-current/);
  assert.match(css, /\.mobileMenuButton\{display:none/);
  assert.match(css, /\.siteHeader nav\.open\{display:grid\}/);
  assert.doesNotMatch(header, /overflow-x/);
});

test('explorer defaults to progressive disclosure and explicit comparison pairing', () => {
  const workspace = read('components/AtlasExplorerWorkspace.js');
  assert.match(workspace, /<summary>More filters<\/summary>/);
  assert.match(workspace, /<summary>Try a guided starting point<\/summary>/);
  assert.match(workspace, /state\.view === 'matrix'/);
  assert.match(workspace, /Pair to compare/);
  assert.match(workspace, /First cultivar to compare/);
  assert.match(workspace, /Second cultivar to compare/);
  assert.doesNotMatch(workspace, /window\.prompt/);
  assert.match(workspace, /<dialog ref=\{saveDialog\}/);
  assert.match(workspace, /Print \/ save as PDF/);
  assert.match(workspace, /Download CSV/);
  assert.match(workspace, /Download JSON/);
});

test('repository identifiers cannot force page-wide horizontal overflow', () => {
  const css = read('app/globals.css');
  const repository = read('app/repository/page.js');
  assert.match(css, /\.twoColumn>\*\{min-width:0\}/);
  assert.match(css, /overflow-wrap:anywhere/);
  assert.match(css, /word-break:break-all/);
  assert.match(repository, /CopyIdentifier/);
  assert.match(repository, /repositoryIntegrityGrid/);
});

test('long records and comparison loading have usable navigation and recovery', () => {
  const profile = read('app/cultivars/[slug]/page.js');
  const compare = read('app/compare/page.js');
  assert.match(profile, /On this record/);
  for (const anchor of ['overview', 'seasonal', 'cultivation', 'identity', 'media', 'relationships', 'evidence']) assert.match(profile, new RegExp(`'${anchor}'`));
  assert.match(compare, /role="status"/);
  assert.match(compare, /aria-live="polite"/);
  assert.match(compare, /href="\/explorer"/);
});
