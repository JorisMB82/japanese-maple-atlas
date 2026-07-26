'use client';

import { useState } from 'react';

export default function CopyIdentifier({ value, label = 'identifier' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return <span className="copyIdentifier"><code>{value}</code><button type="button" onClick={copy} aria-label={`Copy ${label}`}>{copied ? 'Copied' : 'Copy'}</button></span>;
}
