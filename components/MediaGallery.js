'use client';

import { useState } from 'react';
import MediaPlate from './MediaPlate';

export default function MediaGallery({ cultivar }) {
  const [selected, setSelected] = useState(cultivar.media?.[0]?.id || null);
  const active = cultivar.media?.find(item => item.id === selected) || cultivar.media?.[0];

  if (!cultivar.media?.length) {
    const governedGap = cultivar.mediaState === 'governed-gap';
    return <div className="empty card">
      <h3>{governedGap ? 'Governed visual gap' : 'No media objects'}</h3>
      <p>{governedGap
        ? 'No approved cultivar-specific image is currently available. The Atlas has recorded this as a governed visual gap and will add an image after rights, provenance and identity review.'
        : 'The repository has no media attached to this cultivar.'}</p>
      {governedGap && <p>No generic or substitute cultivar image is displayed.</p>}
    </div>;
  }

  return <div className="mediaGallery">
    <MediaPlate media={active} cultivar={cultivar} />
    <div className="mediaMetadata card">
      <div className="kicker">Media object</div>
      <h3>{active.role.replaceAll('-', ' ')}</h3>
      <dl className="compactDl">
        <dt>Object ID</dt><dd><code>{active.id}</code></dd>
        <dt>Type</dt><dd>{active.mediaType}</dd>
        <dt>Subject</dt><dd>{active.subject}</dd>
        <dt>Status</dt><dd>{active.status}</dd>
        <dt>Rights holder</dt><dd>{active.rightsHolder}</dd>
        <dt>Licence</dt><dd>{active.licence}</dd>
        <dt>Evidence</dt><dd>{active.evidentiaryStatus}</dd>
        <dt>Style</dt><dd>{active.styleVersion}</dd>
        <dt>Derivatives</dt><dd>{active.derivatives?.length || 0}</dd>
      </dl>
      <p className="mediaReviewNote"><strong>{active.syntheticLabel}</strong><br />{active.reviewNotes}</p>
    </div>
    {cultivar.media.length > 1 && <div className="mediaThumbnails">
      {cultivar.media.map(item => <button type="button" key={item.id} onClick={() => setSelected(item.id)} className={item.id === active.id ? 'active' : ''}>
        <img src={item.thumbnailPath || item.assetPath} alt="" />
        <span>{item.role}</span>
      </button>)}
    </div>}
  </div>;
}
