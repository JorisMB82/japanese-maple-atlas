export default function MediaPlate({ media, cultivar, compact = false }) {
  if (!media?.assetPath) {
    return <div className={`mediaFallback ${compact ? 'compact' : ''}`} aria-label={`No media available for ${cultivar?.cultivar || 'this cultivar'}`}>
      <span aria-hidden="true">楓</span>
      <p>Media reserved</p>
    </div>;
  }

  return <figure className={`mediaPlate ${compact ? 'compact' : ''}`}>
    <img src={media.assetPath} alt={`${cultivar?.cultivar || 'Japanese maple'} standardized botanical illustration`} loading={compact ? 'lazy' : 'eager'} />
    {!compact && <figcaption>
      <div><strong>{media.caption}</strong><span>{media.credit}</span></div>
      <span className="mediaEvidenceBadge">{media.evidentiaryStatus === 'illustrative-not-evidence' ? 'Illustration · not evidence' : media.evidentiaryStatus}</span>
    </figcaption>}
  </figure>;
}
