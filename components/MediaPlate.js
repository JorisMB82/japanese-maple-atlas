export default function MediaPlate({ media, cultivar, compact = false }) {
  if (!media?.assetPath) {
    const governedGap = cultivar?.mediaState === 'governed-gap';
    return <div className={`mediaFallback ${compact ? 'compact' : ''}`} aria-label={governedGap ? `No approved cultivar-specific image is currently available for ${cultivar?.cultivar || 'this cultivar'}` : `No media available for ${cultivar?.cultivar || 'this cultivar'}`}>
      <span aria-hidden="true">楓</span>
      <p>{governedGap ? 'No approved cultivar-specific image is currently available.' : 'Media reserved'}</p>
      {governedGap && !compact && <small>The Atlas has recorded a governed visual gap and will add an image after rights, provenance and identity review.</small>}
    </div>;
  }

  return <figure className={`mediaPlate ${compact ? 'compact' : ''}`}>
    <img src={media.assetPath} alt={media.altText || `${cultivar?.cultivar || 'Japanese maple'} governed visual`} loading={compact ? 'lazy' : 'eager'} />
    {!compact && <figcaption>
      <div><strong>{media.caption}</strong><span>{media.creator}</span></div>
      <span className="mediaEvidenceBadge">{media.evidentiaryStatus === 'illustrative-not-evidence' ? 'Reconstruction · not evidence' : media.evidentiaryStatus}</span>
    </figcaption>}
  </figure>;
}
