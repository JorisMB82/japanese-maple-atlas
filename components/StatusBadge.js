const labels = {
  'provisional-pilot': 'Provisional pilot',
  'canonical': 'Canonical',
  'under-review': 'Under review'
};
export default function StatusBadge({ status }) {
  return <span className={`statusBadge status-${status}`}>{labels[status] || status}</span>;
}
