import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, readJson } from '../helpers/repository-fixture.mjs';

const OUT = path.join(ROOT, 'out');
const gates = readJson(path.join(ROOT, 'quality', 'quality-gates.json'));

function allFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? allFiles(file) : [file];
  });
}
function routeCandidates(route) {
  if (route === '/') return [path.join(OUT, 'index.html')];
  const clean = route.replace(/^\//, '').replace(/\/$/, '');
  return [path.join(OUT, `${clean}.html`), path.join(OUT, clean, 'index.html')];
}
function routeFile(route) { return routeCandidates(route).find(file => fs.existsSync(file)); }
function localRouteFromHref(href) {
  if (!href.startsWith('/') || href.startsWith('//')) return null;
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || clean.startsWith('/_next/') || clean.startsWith('/media/') || path.extname(clean)) return null;
  return clean;
}

const htmlFor = route => fs.readFileSync(routeFile(route), 'utf8');

test('production export contains every governed public route', () => {
  assert.equal(fs.existsSync(OUT), true, 'run npm run build before regression tests');
  for (const route of gates.requiredRoutes) {
    const file = routeFile(route);
    assert.ok(file, `${route} should have a static HTML output`);
    const html = fs.readFileSync(file, 'utf8');
    assert.match(html, /<html/i, `${route} should contain an HTML document`);
    assert.match(html, /Japanese Maple Atlas/i, `${route} should retain the Atlas identity`);
  }
});

test('critical pages retain the remediated first-touch experience', () => {
  const home = htmlFor('/');
  assert.match(home, /Find, understand and compare Japanese maples/i);
  assert.match(home, /Browse the five pilot cultivars/i);
  const explorer = htmlFor('/explorer');
  assert.match(explorer, /Find and compare Japanese maple cultivars/i);
  assert.match(explorer, /More filters/i);
  assert.match(explorer, /Try a guided starting point/i);
  assert.match(explorer, /Trait table/i);
  assert.match(explorer, /saved for research/i);
  assert.match(explorer, /Save view/i);
  assert.doesNotMatch(explorer, /window\.prompt/);
});

test('navigation, repository, compare and records expose usability safeguards', () => {
  const home = htmlFor('/');
  for (const destination of ['Explorer', 'Compare', 'Graph', 'Editorial', 'Contribute', 'Sources', 'Media', 'Repository', 'About']) assert.match(home, new RegExp(`>${destination}<`));
  assert.match(home, /aria-controls="primary-navigation"/);
  assert.match(htmlFor('/repository'), /Copy repository hash/i);
  assert.match(htmlFor('/compare'), /Preparing the cultivar selectors/i);
  assert.match(htmlFor('/cultivars/seiryu'), /On this record/i);
  assert.match(htmlFor('/graph'), /Try:/i);
});

test('internal application links resolve to exported routes', () => {
  const htmlFiles = allFiles(OUT).filter(file => file.endsWith('.html'));
  const broken = [];
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const hrefs = [...html.matchAll(/href=["']([^"']+)["']/g)].map(match => match[1]);
    for (const href of hrefs) {
      const route = localRouteFromHref(href);
      if (route && !routeFile(route)) broken.push(`${path.relative(OUT, file)} -> ${route}`);
    }
  }
  assert.deepEqual(broken, []);
});

test('referenced Next.js static assets exist in the export', () => {
  const htmlFiles = allFiles(OUT).filter(file => file.endsWith('.html'));
  const missing = new Set();
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    for (const match of html.matchAll(/(?:src|href)=["'](\/_next\/static\/[^"']+)["']/g)) {
      const decodedPath = decodeURIComponent(match[1]).replace(/^\//, '');
      const asset = path.join(OUT, decodedPath);
      if (!fs.existsSync(asset)) missing.add(match[1]);
    }
  }
  assert.deepEqual([...missing], []);
});
