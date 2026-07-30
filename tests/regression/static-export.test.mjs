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

test('critical pages retain the remediated two-speed first-touch experience', () => {
  const home = htmlFor('/');
  assert.match(home, /Find, understand and compare Japanese maples/i);
  assert.match(home, /Browse the cultivar profiles/i);
  assert.match(home, /Catalogue Profiles/i);
  assert.match(home, /Reference Standards/i);
  assert.match(home, /Publication class/i);
  const explorer = htmlFor('/explorer');
  assert.match(explorer, /Find Japanese maples by the traits that matter to you/i);
  assert.match(explorer, /Publication class/i);
  assert.match(explorer, /All classes/i);
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
  const cultivar = htmlFor('/cultivars/seiryu');
  assert.match(cultivar, /On this record/i);
  assert.match(cultivar, /Reference Standard/i);
  assert.match(cultivar, /Stable cultivar ID/i);
  assert.match(htmlFor('/graph'), /Try:/i);
});

test('published Catalogue profiles disclose approved galleries or controlled visual gaps', () => {
  const approved = [
    ['orange-dream', '000011'],
    ['inaba-shidare', '000013'],
    ['autumn-moon', '000016'],
    ['shin-deshojo', '000019']
  ];
  for (const [slug, id] of approved) {
    const profile = htmlFor(`/cultivars/${slug}`);
    assert.match(profile, /Catalogue Profile/i);
    assert.match(profile, /approved-gallery/i);
    assert.match(profile, /Source-identified|Community-identified/i);
    assert.match(profile, /not independently authenticated by the Japanese Maple Atlas/i);
    assert.match(profile, new RegExp(`/media/derivatives/catalogue/cul-${id}/`));
  }

  for (const slug of ['koto-no-ito', 'beni-kawa', 'trompenburg']) {
    const profile = htmlFor(`/cultivars/${slug}`);
    assert.match(profile, /Catalogue Profile/i);
    assert.match(profile, /No approved cultivar-specific image is currently available/i);
    assert.match(profile, /No generic or substitute cultivar image is displayed/i);
    assert.match(profile, /governed visual gap/i);
  }
});

test('Shin-deshōjō public gallery preserves the separate bonsai limitation', () => {
  const profile = htmlFor('/cultivars/shin-deshojo');
  assert.match(profile, /separate source-identified.*bonsai/i);
  assert.match(profile, /bonsai form is not cultivar habit/i);
  assert.match(profile, /not independently authenticated by the Japanese Maple Atlas/i);
  assert.match(profile, /not a same-plant seasonal sequence/i);
});

test('profiles outside controlled C-002 tranche 01 remain absent from public routes', () => {
  for (const slug of ['waterfall', 'aoyagi', 'red-dragon', 'tamukeyama', 'orangeola', 'higasa-yama', 'arakawa', 'red-pygmy']) {
    assert.equal(routeFile(`/cultivars/${slug}`), undefined, `${slug} must remain non-public`);
  }
});

test('visual library exposes lawful Catalogue photography and separates identity plates', () => {
  const media = htmlFor('/media');
  assert.match(media, /A growing library of lawful Japanese maple photographs/i);
  assert.match(media, /Orange Dream/i);
  assert.match(media, /Inaba-shidare/i);
  assert.match(media, /Autumn Moon/i);
  assert.match(media, /Shin-deshōjō/i);
  assert.match(media, /Whole plant · habit/i);
  assert.match(media, /Foliage detail/i);
  assert.match(media, /Seasonal · diagnostic/i);
  assert.match(media, /Rights and identity are reviewed separately/i);
  assert.match(media, /Reference Standard visual layer/i);
  assert.match(media, /Not photographs/i);
  assert.match(media, /Open visual gaps/i);
  assert.doesNotMatch(media, /the current identity plates are editorial illustrations/i);
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
