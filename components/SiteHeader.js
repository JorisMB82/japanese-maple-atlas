'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const links = [
  ['/explorer', 'Explorer'],
  ['/map', 'Map'],
  ['/compare', 'Compare'],
  ['/graph', 'Graph'],
  ['/editorial', 'Editorial'],
  ['/contribute', 'Contribute'],
  ['/sources', 'Sources'],
  ['/media', 'Media'],
  ['/repository', 'Repository'],
  ['/about', 'About']
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const closeOnEscape = event => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  return <header className="siteHeader">
    <a className="brand" href="/" aria-label="Japanese Maple Atlas home"><span className="brandMark" aria-hidden="true">楓</span><span><strong>Japanese Maple Atlas</strong><small>Evidence-based cultivar knowledge</small></span></a>
    <button type="button" className="mobileMenuButton" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(value => !value)}><span aria-hidden="true">{open ? '×' : '☰'}</span><span>{open ? 'Close' : 'Menu'}</span></button>
    <nav id="primary-navigation" aria-label="Primary navigation" className={open ? 'open' : ''}>{links.map(([href, label]) => <a key={href} href={href} aria-current={pathname === href || pathname.startsWith(`${href}/`) ? 'page' : undefined} className={pathname === href || pathname.startsWith(`${href}/`) ? 'active' : ''}>{label}</a>)}</nav>
  </header>;
}
