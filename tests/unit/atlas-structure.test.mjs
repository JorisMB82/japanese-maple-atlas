import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAtlasStructure, HORTICULTURAL_LENSES } from '../../lib/atlas-structure.mjs';

const cultivars = [
  {
    id: 'RC-001',
    cultivarId: 'CUL-000001',
    displayId: 'RC-001',
    slug: 'bloodgood',
    cultivar: 'Bloodgood',
    scientificName: "Acer palmatum 'Bloodgood'",
    species: 'Acer palmatum',
    taxonId: 'TAX-APAL',
    publicationClass: 'reference-standard',
    publicationClassLabel: 'Reference Standard',
    habit: 'Upright small tree',
    springColor: 'Reddish purple',
    primaryMedia: { id: 'MED-001' }
  },
  {
    id: 'RC-004',
    cultivarId: 'CUL-000004',
    displayId: 'RC-004',
    slug: 'crimson-queen',
    cultivar: 'Crimson Queen',
    scientificName: "Acer palmatum 'Crimson Queen'",
    species: 'Acer palmatum',
    taxonId: 'TAX-APAL',
    publicationClass: 'reference-standard',
    habit: 'Mounding and cascading',
    leafForm: 'Deeply dissected laceleaf foliage',
    autumnColor: 'Crimson red'
  },
  {
    id: 'CUL-000016',
    cultivarId: 'CUL-000016',
    displayId: 'CUL-000016',
    slug: 'autumn-moon',
    cultivar: 'Autumn Moon',
    scientificName: "Acer shirasawanum 'Autumn Moon'",
    species: 'Acer shirasawanum',
    taxonId: 'TAX-ASHI',
    publicationClass: 'catalogue-profile',
    publicationClassLabel: 'Catalogue Profile',
    habit: 'Bushy small tree',
    springColor: 'Yellow with orange and salmon tones',
    primaryMedia: { id: 'MED-016' }
  },
  {
    id: 'CUL-000099',
    cultivarId: 'CUL-000099',
    displayId: 'CUL-000099',
    slug: 'quiet-green',
    cultivar: 'Quiet Green',
    scientificName: "Acer japonicum 'Quiet Green'",
    taxon: { scientificName: 'Acer japonicum' },
    taxonId: 'TAX-AJAP',
    publicationClass: 'catalogue-profile',
    summary: 'A broadly spreading green-leaved specimen.'
  }
];

test('Maple Map builds a deterministic genus, species and cultivar hierarchy', () => {
  const map = buildAtlasStructure(cultivars);
  assert.equal(map.genus, 'Acer');
  assert.equal(map.totalCultivars, 4);
  assert.equal(map.speciesCount, 3);
  assert.equal(map.visualCultivarCount, 2);
  assert.deepEqual(map.species.map(species => [species.scientificName, species.count]), [
    ['Acer palmatum', 2],
    ['Acer japonicum', 1],
    ['Acer shirasawanum', 1]
  ]);
  assert.deepEqual(map.species[0].cultivars.map(cultivar => cultivar.name), ['Bloodgood', 'Crimson Queen']);
});

test('publication layers remain separate from taxonomy', () => {
  const map = buildAtlasStructure(cultivars);
  assert.deepEqual(map.publicationClasses.map(group => [group.id, group.count]), [
    ['reference-standard', 2],
    ['catalogue-profile', 2]
  ]);
  assert.equal(map.publicationClasses[0].cultivars.every(cultivar => cultivar.species === 'Acer palmatum'), true);
  assert.equal(map.publicationClasses[1].cultivars.some(cultivar => cultivar.species === 'Acer shirasawanum'), true);
});

test('horticultural lenses overlap and retain unmatched published forms', () => {
  const map = buildAtlasStructure(cultivars);
  const byId = new Map(map.horticulturalGroups.map(group => [group.id, group]));
  assert.deepEqual(byId.get('upright-tree-form').cultivars.map(cultivar => cultivar.name), ['Autumn Moon', 'Bloodgood']);
  assert.deepEqual(byId.get('dissected-cascading').cultivars.map(cultivar => cultivar.name), ['Crimson Queen']);
  assert.deepEqual(byId.get('compact-dwarf').cultivars.map(cultivar => cultivar.name), ['Autumn Moon', 'Crimson Queen']);
  assert.deepEqual(byId.get('golden-orange-foliage').cultivars.map(cultivar => cultivar.name), ['Autumn Moon']);
  assert.deepEqual(byId.get('red-purple-seasonal').cultivars.map(cultivar => cultivar.name), ['Bloodgood', 'Crimson Queen']);
  assert.deepEqual(byId.get('other-published-forms').cultivars.map(cultivar => cultivar.name), ['Quiet Green']);
});

test('empty input produces an empty but valid scalable structure', () => {
  const map = buildAtlasStructure();
  assert.equal(map.totalCultivars, 0);
  assert.equal(map.speciesCount, 0);
  assert.deepEqual(map.species, []);
  assert.deepEqual(map.horticulturalGroups, []);
  assert.deepEqual(map.publicationClasses.map(group => group.count), [0, 0]);
  assert.ok(HORTICULTURAL_LENSES.length >= 8);
});
