const labels = {
  documented: 'Documented identity',
  'source-asserted': 'Source-identified',
  'community-identified': 'Community-identified'
};

export default function MediaIdentityBadge({ confidence }) {
  if (!confidence) return null;
  return <span className={`mediaIdentityBadge mediaIdentity-${confidence}`}>{labels[confidence] || confidence}</span>;
}
