import { useEffect } from 'react';
import {
  SITE_NAME,
  SEO_KEYWORDS,
  DEFAULT_OG_IMAGE,
  buildCanonical,
} from '../lib/seo';

const JSON_LD_ID = 'page-json-ld';

function upsertMeta(attr, key, content) {
  if (content == null) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(data) {
  const existing = document.getElementById(JSON_LD_ID);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement('script');
  script.id = JSON_LD_ID;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/** Updates document title, meta tags, canonical & optional JSON-LD per route. */
export default function usePageSEO({
  enabled = true,
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  keywords = SEO_KEYWORDS,
  jsonLd = null,
  type = 'website',
}) {
  useEffect(() => {
    if (!enabled) return;
    const canonical = buildCanonical(path);

    document.title = title;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'keywords', keywords);
    upsertMeta(
      'name',
      'robots',
      noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    );

    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:locale', 'en_IN');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);

    upsertLink('canonical', canonical);
    upsertJsonLd(jsonLd);

    return () => {
      const ld = document.getElementById(JSON_LD_ID);
      if (ld) ld.remove();
    };
  }, [enabled, title, description, path, image, noindex, keywords, jsonLd, type]);
}
