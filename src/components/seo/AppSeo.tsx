import { useEffect } from 'react';
import { useLocation } from 'react-router';
import {
  DEFAULT_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  absoluteImageUrl,
  absoluteUrl,
} from '@/lib/siteSeo';
import { resolvePageSeo } from '@/lib/seoRoutes';

const MANAGED = 'data-seo-managed';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(`${selector}[${MANAGED}]`);
  if (!el) {
    el = document.head.querySelector<HTMLMetaElement>(selector);
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute(MANAGED, 'true');
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"]`;
  let el = document.head.querySelector<HTMLLinkElement>(`${selector}[${MANAGED}]`);
  if (!el) {
    el = document.head.querySelector<HTMLLinkElement>(selector);
  }
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.setAttribute(MANAGED, 'true');
  el.href = href;
}

function clearManagedJsonLd() {
  document.head.querySelectorAll('script[data-seo-jsonld]').forEach((node) => node.remove());
}

function injectJsonLd(blocks: Record<string, unknown>[]) {
  clearManagedJsonLd();
  blocks.forEach((data) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-jsonld', '1');
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  });
}

/** Updates document title, meta, canonical, Open Graph, Twitter, and per-route JSON-LD on navigation. */
export default function AppSeo() {
  const location = useLocation();

  useEffect(() => {
    const config = resolvePageSeo(location.pathname);
    const canonical = absoluteUrl(config.canonicalPath);
    const description = config.description;
    const title = config.title;
    const robots = config.robots ?? 'index, follow';
    const keywords = config.keywords ?? DEFAULT_KEYWORDS;
    const ogType = config.ogType ?? 'website';
    const ogImage = absoluteImageUrl(config.ogImagePath);

    document.title = title;

    upsertMeta('name', 'title', title);
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'keywords', keywords);
    upsertMeta('name', 'robots', robots);
    upsertMeta('name', 'author', SITE_NAME);

    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:image:alt', `${SITE_NAME} — Prepare like an officer`);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:locale', SITE_LOCALE);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:url', canonical);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

    upsertLink('canonical', canonical);

    const jsonBlocks = config.jsonLd
      ? Array.isArray(config.jsonLd)
        ? config.jsonLd
        : [config.jsonLd]
      : [];
    if (jsonBlocks.length > 0) {
      injectJsonLd(jsonBlocks);
    } else {
      clearManagedJsonLd();
    }
  }, [location.pathname]);

  return null;
}
