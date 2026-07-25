const labels = {
  'provisional-pilot': 'Provisional pilot',
  'canonical': 'Canonical',
  'canonical-compiled': 'Canonical compiled',
  'frozen-reference-standard': 'Frozen standard',
  'frozen': 'Frozen',
  'approved': 'Approved',
  'pilot-approved': 'Pilot approved',
  'under-review': 'Under review'
};

const visualStatus = {
  'canonical-compiled': 'canonical',
  'frozen-reference-standard': 'canonical',
  'frozen': 'canonical',
  'approved': 'canonical',
  'pilot-approved': 'canonical'
};

export default function StatusBadge({ status }) {
  const cssStatus = visualStatus[status] || status;
  return <span className={`statusBadge status-${cssStatus}`}>{labels[status] || status}</span>;
}
