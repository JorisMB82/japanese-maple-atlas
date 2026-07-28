const labels = {
  'reference-standard': 'Reference Standard',
  'catalogue-profile': 'Catalogue Profile'
};

export default function PublicationClassBadge({ publicationClass }) {
  const value = publicationClass || 'reference-standard';
  return <span className={`publicationBadge publication-${value}`}>{labels[value] || value}</span>;
}
