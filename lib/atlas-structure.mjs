const HORTICULTURAL_LENSES = [
  {
    id: 'upright-tree-form',
    label: 'Upright and tree-form',
    shortLabel: 'Upright',
    description: 'Cultivars presented primarily as upright shrubs or small trees.',
    pattern: /upright|tree-form|small tree|broadening tree|vase-shaped/i
  },
  {
    id: 'dissected-cascading',
    label: 'Dissected and cascading',
    shortLabel: 'Dissected',
    description: 'Laceleaf, finely cut, arching, weeping or cascading forms.',
    pattern: /dissect|laceleaf|lace-leaf|cascad|weeping|pendulous|feathery/i
  },
  {
    id: 'compact-dwarf',
    label: 'Compact, dwarf and mounding',
    shortLabel: 'Compact',
    description: 'Compact, dense, dwarf, bushy or mound-forming garden plants.',
    pattern: /compact|dwarf|mound|mounding|bushy|dense|small shrub/i
  },
  {
    id: 'bark-winter-interest',
    label: 'Bark and winter interest',
    shortLabel: 'Bark',
    description: 'Cultivars where young stems, bark colour or winter structure matter.',
    pattern: /bark|stem|shoot|coral|winter interest|green-stem|red-stem/i
  },
  {
    id: 'variegated-foliage',
    label: 'Variegated foliage',
    shortLabel: 'Variegated',
    description: 'Cultivars with governed cream, white, pink or mottled variegation.',
    pattern: /variegat|cream|white margin|pink margin|mottl|speckl/i
  },
  {
    id: 'golden-orange-foliage',
    label: 'Golden, yellow and orange foliage',
    shortLabel: 'Golden',
    description: 'Cultivars valued for yellow, gold, orange or salmon foliage phases.',
    pattern: /gold|yellow|orange|salmon/i
  },
  {
    id: 'linear-narrow-lobed',
    label: 'Linear and narrow-lobed foliage',
    shortLabel: 'Linear',
    description: 'Thread-like, strap-like, ribbon-like or unusually narrow lobes.',
    pattern: /linear|thread|narrow-lobed|narrow lob|strap|ribbon/i
  },
  {
    id: 'red-purple-seasonal',
    label: 'Red and purple seasonal colour',
    shortLabel: 'Red seasonal',
    description: 'Cultivars with prominent red, crimson, burgundy or purple phases.',
    pattern: /red|crimson|burgundy|purple|wine-red/i
  }
];

function searchableText(cultivar) {
  return [
    cultivar.cultivar,
    cultivar.acceptedWorkingName,
    cultivar.scientificName,
    cultivar.summary,
    cultivar.habit,
    cultivar.leafForm,
    cultivar.bark,
    cultivar.springColor,
    cultivar.summerColor,
    cultivar.autumnColor,
    cultivar.sizeClass,
    cultivar.cultivation,
    ...(cultivar.diagnosticTraits || [])
  ].filter(Boolean).join(' ');
}

function speciesName(cultivar) {
  return cultivar.species
    || cultivar.taxon?.scientificName
    || String(cultivar.scientificName || '').replace(/\s+[‘'][^’']+[’'].*$/u, '')
    || 'Unresolved taxon';
}

function cultivarView(cultivar) {
  return {
    id: cultivar.cultivarId || cultivar.id,
    displayId: cultivar.displayId || cultivar.id || cultivar.cultivarId,
    name: cultivar.cultivar || cultivar.acceptedWorkingName,
    slug: cultivar.slug,
    scientificName: cultivar.scientificName,
    species: speciesName(cultivar),
    taxonId: cultivar.taxonId,
    publicationClass: cultivar.publicationClass,
    publicationClassLabel: cultivar.publicationClassLabel
      || (cultivar.publicationClass === 'reference-standard' ? 'Reference Standard' : 'Catalogue Profile'),
    hasApprovedVisual: Boolean(cultivar.primaryMedia),
    searchableText: searchableText(cultivar)
  };
}

function sortCultivars(items) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}

export function buildAtlasStructure(cultivars = []) {
  const publishedCultivars = sortCultivars(cultivars.map(cultivarView));
  const speciesMap = new Map();

  for (const cultivar of publishedCultivars) {
    const key = cultivar.taxonId || cultivar.species;
    if (!speciesMap.has(key)) {
      speciesMap.set(key, {
        id: key,
        scientificName: cultivar.species,
        cultivars: []
      });
    }
    speciesMap.get(key).cultivars.push(cultivar);
  }

  const species = [...speciesMap.values()]
    .map(group => ({ ...group, cultivars: sortCultivars(group.cultivars), count: group.cultivars.length }))
    .sort((a, b) => b.count - a.count || a.scientificName.localeCompare(b.scientificName));

  const groupedIds = new Set();
  const horticulturalGroups = HORTICULTURAL_LENSES.map(lens => {
    const members = sortCultivars(publishedCultivars.filter(cultivar => lens.pattern.test(cultivar.searchableText)));
    for (const member of members) groupedIds.add(member.id);
    return {
      id: lens.id,
      label: lens.label,
      shortLabel: lens.shortLabel,
      description: lens.description,
      count: members.length,
      cultivars: members
    };
  }).filter(group => group.count > 0);

  const ungrouped = publishedCultivars.filter(cultivar => !groupedIds.has(cultivar.id));
  if (ungrouped.length) {
    horticulturalGroups.push({
      id: 'other-published-forms',
      label: 'Other published forms',
      shortLabel: 'Other',
      description: 'Published profiles not yet represented by one of the current practical lenses.',
      count: ungrouped.length,
      cultivars: ungrouped
    });
  }

  const publicationClasses = [
    {
      id: 'reference-standard',
      label: 'Reference Standards',
      description: 'Deeply governed, frozen records with the highest evidence and review depth.'
    },
    {
      id: 'catalogue-profile',
      label: 'Catalogue Profiles',
      description: 'Lean, reviewed records designed to expand lawful public breadth at scale.'
    }
  ].map(group => {
    const members = publishedCultivars.filter(cultivar => cultivar.publicationClass === group.id);
    return { ...group, count: members.length, cultivars: members };
  });

  return {
    genus: 'Acer',
    totalCultivars: publishedCultivars.length,
    speciesCount: species.length,
    visualCultivarCount: publishedCultivars.filter(cultivar => cultivar.hasApprovedVisual).length,
    species,
    horticulturalGroups,
    publicationClasses
  };
}

export { HORTICULTURAL_LENSES };
