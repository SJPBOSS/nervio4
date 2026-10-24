import fs from 'node:fs';
import path from 'node:path';
import { SITE, PUBLISHED, LANGS, TOPICS, CHROME, DISCLAIMERS, BLURBS, pagePath } from './content.js';
import { helpButtonHtml, helpDialogHtml, othersListHtml } from './helplines.js';
import { CHECKED, CHECKED_DATE, SHORT, LINK_LABELS, LEGAL_PAGES, legalPath } from './legal.js';
import { TRANSLATIONS } from '../i18n.js';
import { homePath } from '../settings.js';

const root = path.resolve(import.meta.dirname, '..');

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function inline(text) {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let html = '';
  let last = 0;
  for (const match of text.matchAll(re)) {
    html += esc(text.slice(last, match.index));
    const href = match[2];
    if (!href.startsWith('/') && !href.startsWith('https://') && !href.startsWith('tel:') && !href.startsWith('sms:')) {
      throw new Error(`Unsafe link in copy: ${href}`);
    }
    const external = href.startsWith('https://');
    html += `<a href="${esc(href)}"${external ? ' rel="noopener noreferrer"' : ''}>${esc(match[1])}</a>`;
    last = match.index + match[0].length;
  }
  html += esc(text.slice(last));
  return html;
}

function segments(parts) {
  return parts.map((part) => {
    if (part.href) {
      const external = part.href.startsWith('https://');
      return `<a href="${esc(part.href)}"${external ? ' rel="noopener noreferrer"' : ''}>${esc(part.label)}</a>`;
    }
    return esc(part.text);
  }).join('');
}

function appUrl(lang, mode, dur) {
  const params = new URLSearchParams();
  params.set('mode', mode);
  if (dur) params.set('dur', dur);
  return `${homePath(lang)}?${params.toString()}`;
}

function iconLinks() {
  return `
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="stylesheet" href="/styles.css" />`;
}

function guideColumns() {
  return LANGS.map((lang) => {
    const chrome = CHROME[lang];
    const items = TOPICS.map((topic) => {
      const copy = topic[lang];
      return `<li><a href="${esc(pagePath(topic, lang))}" lang="${esc(chrome.htmlLang)}">${esc(copy.h1)}</a></li>`;
    }).join('\n        ');
    return `<section aria-labelledby="guides-${lang}">
      <h3 id="guides-${lang}" lang="${esc(chrome.htmlLang)}">${esc(chrome.column)}</h3>
      <ul class="guide-list">
        ${items}
      </ul>
    </section>`;
  }).join('\n    ');
}

function legalLinksHtml(onlyLang) {
  const langs = onlyLang ? [onlyLang] : LANGS;
  const rows = langs.map((lang) => {
    const labels = LINK_LABELS[lang];
    const htmlLang = CHROME[lang].htmlLang;
    return `<p lang="${esc(htmlLang)}"><a href="${esc(legalPath('terms', lang))}" hreflang="${esc(htmlLang)}">${esc(labels.terms)}</a> · <a href="${esc(legalPath('privacy', lang))}" hreflang="${esc(htmlLang)}">${esc(labels.privacy)}</a></p>`;
  }).join('\n    ');
  const label = LINK_LABELS[onlyLang || 'en'].legal;
  return `<nav class="legal-links" aria-label="${esc(label)}">
    ${rows}
  </nav>`;
}

function footerHtml() {
  const blurbs = LANGS.map((lang) => `<p lang="${esc(CHROME[lang].htmlLang)}">${esc(BLURBS[lang])}</p>`).join('\n    ');
  return `<h2>Guides</h2>
  <div class="guide-columns">
    ${guideColumns()}
  </div>
  <div class="footer-blurbs">
    ${blurbs}
  </div>
  ${legalLinksHtml()}`;
}

function disclaimerHtml(lang) {
  const block = DISCLAIMERS[lang];
  const paragraphs = block.blocks.map((parts) => `<p>${segments(parts)}</p>`).join('\n      ');
  const checked = `<p class="checked"><time datetime="${CHECKED_DATE}">${esc(CHECKED[lang])}</time></p>`;
  const others = othersListHtml(lang);
  const tail = (block.tail || []).map((parts) => `<p>${segments(parts)}</p>`).join('\n      ');
  return `<aside class="disclaimer">
      <h2>${esc(block.heading)}</h2>
      ${paragraphs}
      ${checked}
      ${others}
      ${tail}
    </aside>`;
}

function shortLineHtml(lang) {
  const copy = SHORT[lang];
  return `<p class="liability">${esc(copy.line)} ${esc(copy.stop)} <a href="${esc(legalPath('terms', lang))}">${esc(LINK_LABELS[lang].terms)}</a></p>`;
}

function renderArticle(topic, lang) {
  const copy = topic[lang];
  const chrome = CHROME[lang];
  const canonicalPath = pagePath(topic, lang);
  const canonical = `${SITE}${canonicalPath}`;
  const alternates = LANGS.map((code) => {
    const href = `${SITE}${pagePath(topic, code)}`;
    const hreflang = CHROME[code].htmlLang;
    return `  <link rel="alternate" hreflang="${hreflang}" href="${href}" />`;
  });
  alternates.push(`  <link rel="alternate" hreflang="fr" href="${SITE}${pagePath(topic, 'fr')}" />`);
  alternates.push(`  <link rel="alternate" hreflang="pt" href="${SITE}${pagePath(topic, 'pt')}" />`);
  alternates.push(`  <link rel="alternate" hreflang="x-default" href="${SITE}${pagePath(topic, 'en')}" />`);

  const locales = LANGS.filter((code) => code !== lang)
    .map((code) => `  <meta property="og:locale:alternate" content="${CHROME[code].ogLocale}" />`)
    .join('\n');

  const intro = copy.paragraphs.map((paragraph, index) => (
    `<p${index === 0 ? ' class="lead"' : ''}>${inline(paragraph)}</p>`
  )).join('\n      ');

  const sections = copy.sections.map((section) => {
    const before = (section.before || []).map((paragraph) => `<p>${inline(paragraph)}</p>`).join('\n        ');
    const steps = section.steps?.length
      ? `<ol class="steps">\n          ${section.steps.map((step, index) => `<li><span class="step-index" aria-hidden="true">${index + 1}</span>${inline(step)}</li>`).join('\n          ')}\n        </ol>`
      : '';
    const after = (section.after || []).map((paragraph) => `<p>${inline(paragraph)}</p>`).join('\n        ');
    return `<section>
        <h2>${esc(section.h2)}</h2>
        ${before}
        ${steps}
        ${after}
      </section>`;
  }).join('\n      ');

  const related = TOPICS.filter((item) => item.id !== topic.id).map((item) => (
    `<li><a href="${esc(pagePath(item, lang))}">${esc(item[lang].h1)}</a></li>`
  )).join('\n        ');

  const langLinks = LANGS.map((code) => {
    const href = pagePath(topic, code);
    const current = code === lang ? ' aria-current="page"' : '';
    return `<a href="${href}" lang="${CHROME[code].htmlLang}" hreflang="${CHROME[code].htmlLang}"${current}>${code.toUpperCase()}</a>`;
  }).join('\n          ');

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: copy.h1,
        description: copy.description,
        inLanguage: chrome.htmlLang,
        datePublished: PUBLISHED,
        dateModified: PUBLISHED,
        mainEntityOfPage: canonical,
        image: `${SITE}/og.png`,
        author: { '@type': 'Organization', name: 'Nervio', url: `${SITE}/` },
        publisher: { '@type': 'Organization', name: 'Nervio', url: `${SITE}/` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Nervio', item: `${SITE}${homePath(lang)}` },
          { '@type': 'ListItem', position: 2, name: chrome.guides, item: `${SITE}${homePath(lang)}#guides` },
          { '@type': 'ListItem', position: 3, name: copy.h1, item: canonical },
        ],
      },
    ],
  }).replaceAll('<', '\\u003c');

  return `<!DOCTYPE html>
<html lang="${chrome.htmlLang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="theme-color" content="#090c0b" />
  <title>${esc(copy.title)}</title>
  <meta name="description" content="${esc(copy.description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
${alternates.join('\n')}
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Nervio" />
  <meta property="og:title" content="${esc(copy.title)}" />
  <meta property="og:description" content="${esc(copy.description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${SITE}/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Nervio, a free breathing app on a black background" />
  <meta property="og:locale" content="${chrome.ogLocale}" />
${locales}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(copy.title)}" />
  <meta name="twitter:description" content="${esc(copy.description)}" />
  <meta name="twitter:image" content="${SITE}/og.png" />
  ${iconLinks()}
  <script type="application/ld+json">
  ${jsonLd}
  </script>
</head>
<body>
  <a class="skip" href="#main">${esc(chrome.skip)}</a>
  <header class="nav">
    <a class="brand" href="${homePath(lang)}">
      <span class="brand-mark" aria-hidden="true"></span>
      <span class="brand-name">Nervio</span>
    </a>
    <div class="nav-actions">
      <nav class="langs" aria-label="${esc(chrome.language)}">
          ${langLinks}
      </nav>
    </div>
  </header>
  <main id="main" class="article">
    <nav class="crumbs" aria-label="${esc(chrome.breadcrumb)}">
      <ol>
        <li><a href="${homePath(lang)}">Nervio</a></li>
        <li><a href="${homePath(lang)}#guides">${esc(chrome.guides)}</a></li>
        <li aria-current="page">${esc(copy.h1)}</li>
      </ol>
    </nav>
    <article>
      <p class="eyebrow">${esc(chrome.guides)}</p>
      <h1>${esc(copy.h1)}</h1>
      <p class="note">${esc(copy.note)}</p>
      ${shortLineHtml(lang)}
      ${intro}
      ${sections}
      <p class="cta-row"><a class="go" href="${appUrl(lang, topic.mode, topic.dur)}">${esc(copy.cta)}</a></p>
      ${disclaimerHtml(lang)}
      <p class="published"><time datetime="${PUBLISHED}">${esc(chrome.published)} ${esc(chrome.date)}</time></p>
    </article>
    <nav class="related" aria-label="${esc(chrome.other)}">
      <h2>${esc(chrome.other)}</h2>
      <ul>
        ${related}
      </ul>
    </nav>
  </main>
  <footer class="site-footer">
    <p lang="${esc(chrome.htmlLang)}">${esc(BLURBS[lang])}</p>
    ${legalLinksHtml(lang)}
    <p><a href="${homePath(lang)}">${esc(chrome.openApp)}</a></p>
  </footer>
</body>
</html>
`;
}

function render404() {
  const blocks = LANGS.map((lang, index) => {
    const chrome = CHROME[lang];
    const tag = index === 0 ? 'h1' : 'h2';
    return `<${tag} lang="${chrome.htmlLang}">${esc(chrome.notFoundH1)}</${tag}>
    <p lang="${chrome.htmlLang}">${esc(chrome.notFoundBody)}</p>`;
  }).join('\n    ');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="theme-color" content="#090c0b" />
  <title>${esc(CHROME.en.notFoundTitle)}</title>
  <meta name="description" content="This page is not on Nervio. Go back to the free breathing app or read a guide." />
  <meta name="robots" content="noindex" />
  ${iconLinks()}
</head>
<body>
  <a class="skip" href="#main">${esc(CHROME.en.skip)}</a>
  <header class="nav">
    <a class="brand" href="/">
      <span class="brand-mark" aria-hidden="true"></span>
      <span class="brand-name">Nervio</span>
    </a>
  </header>
  <main id="main" class="article">
    ${blocks}
    <p class="cta-row"><a class="go" href="/">Nervio</a></p>
  </main>
  <footer class="site-footer" id="guides">
    ${footerHtml()}
  </footer>
</body>
</html>
`;
}

function legalSectionHtml(section, lang) {
  const before = (section.paragraphs || []).map((paragraph) => `<p>${inline(paragraph)}</p>`).join('\n        ');
  const steps = section.steps?.length
    ? `<ul class="plain-list">\n          ${section.steps.map((step) => `<li>${inline(step)}</li>`).join('\n          ')}\n        </ul>`
    : '';
  const after = (section.after || []).map((paragraph) => `<p>${inline(paragraph)}</p>`).join('\n        ');
  const crisis = section.crisis ? disclaimerHtml(lang) : '';
  return `<section>
        <h2>${esc(section.h2)}</h2>
        ${before}
        ${steps}
        ${after}
        ${crisis}
      </section>`;
}

function renderLegal(kind, lang) {
  const page = LEGAL_PAGES[lang][kind];
  const chrome = CHROME[lang];
  const canonicalPath = legalPath(kind, lang);
  const canonical = `${SITE}${canonicalPath}`;
  const alternates = LANGS.map((code) => {
    const href = `${SITE}${legalPath(kind, code)}`;
    return `  <link rel="alternate" hreflang="${CHROME[code].htmlLang}" href="${href}" />`;
  });
  alternates.push(`  <link rel="alternate" hreflang="fr" href="${SITE}${legalPath(kind, 'fr')}" />`);
  alternates.push(`  <link rel="alternate" hreflang="pt" href="${SITE}${legalPath(kind, 'pt')}" />`);
  alternates.push(`  <link rel="alternate" hreflang="x-default" href="${SITE}${legalPath(kind, 'en')}" />`);
  const locales = LANGS.filter((code) => code !== lang)
    .map((code) => `  <meta property="og:locale:alternate" content="${CHROME[code].ogLocale}" />`)
    .join('\n');
  const langLinks = LANGS.map((code) => {
    const href = legalPath(kind, code);
    const current = code === lang ? ' aria-current="page"' : '';
    return `<a href="${href}" lang="${CHROME[code].htmlLang}" hreflang="${CHROME[code].htmlLang}"${current}>${code.toUpperCase()}</a>`;
  }).join('\n          ');
  const sections = page.sections.map((section) => legalSectionHtml(section, lang)).join('\n      ');
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.h1,
    description: page.description,
    inLanguage: chrome.htmlLang,
    dateModified: PUBLISHED,
    url: canonical,
    isPartOf: { '@type': 'WebSite', name: 'Nervio', url: `${SITE}/` },
  }).replaceAll('<', '\\u003c');

  return `<!DOCTYPE html>
<html lang="${chrome.htmlLang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="theme-color" content="#090c0b" />
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
${alternates.join('\n')}
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Nervio" />
  <meta property="og:title" content="${esc(page.title)}" />
  <meta property="og:description" content="${esc(page.description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${SITE}/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Nervio, a free breathing app on a black background" />
  <meta property="og:locale" content="${chrome.ogLocale}" />
${locales}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(page.title)}" />
  <meta name="twitter:description" content="${esc(page.description)}" />
  <meta name="twitter:image" content="${SITE}/og.png" />
  ${iconLinks()}
  <script type="application/ld+json">
  ${jsonLd}
  </script>
</head>
<body>
  <a class="skip" href="#main">${esc(chrome.skip)}</a>
  <header class="nav">
    <a class="brand" href="${homePath(lang)}">
      <span class="brand-mark" aria-hidden="true"></span>
      <span class="brand-name">Nervio</span>
    </a>
    <div class="nav-actions">
      <nav class="langs" aria-label="${esc(chrome.language)}">
          ${langLinks}
      </nav>
    </div>
  </header>
  <main id="main" class="article">
    <nav class="crumbs" aria-label="${esc(chrome.breadcrumb)}">
      <ol>
        <li><a href="${homePath(lang)}">Nervio</a></li>
        <li aria-current="page">${esc(page.h1)}</li>
      </ol>
    </nav>
    <article>
      <h1>${esc(page.h1)}</h1>
      ${sections}
    </article>
  </main>
  <footer class="site-footer">
    <p lang="${esc(chrome.htmlLang)}">${esc(BLURBS[lang])}</p>
    ${legalLinksHtml(lang)}
    <p><a href="${homePath(lang)}">${esc(chrome.openApp)}</a></p>
  </footer>
</body>
</html>
`;
}

const MODE_ICONS = {
  calm: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 14c2.2-3.6 3.8-3.6 6 0s3.8 3.6 6 0 3.8-3.6 6 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  focus: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  sleep: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15.2 5.2a6.8 6.8 0 1 0 5.2 11.2A7.2 7.2 0 0 1 15.2 5.2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  panic: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="6.2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="1.35" fill="currentColor"/></svg>',
};

const HOME_HREFLANG = [
  ['en', `${SITE}/`],
  ['fr-CA', `${SITE}/fr/`],
  ['fr', `${SITE}/fr/`],
  ['es', `${SITE}/es/`],
  ['pt-BR', `${SITE}/pt/`],
  ['pt', `${SITE}/pt/`],
  ['x-default', `${SITE}/`],
];

function homeHreflangLinks() {
  return HOME_HREFLANG
    .map(([hreflang, href]) => `  <link rel="alternate" hreflang="${hreflang}" href="${href}" />`)
    .join('\n');
}

function langBootScript() {
  return `<script>
(function () {
  function code(value) {
    var v = String(value || '').toLowerCase();
    if (v.indexOf('fr') === 0) return 'fr';
    if (v.indexOf('es') === 0) return 'es';
    if (v.indexOf('pt') === 0) return 'pt';
    if (v.indexOf('en') === 0) return 'en';
    return '';
  }
  function home(lang) { return lang === 'en' ? '/' : '/' + lang + '/'; }
  var path = location.pathname.replace(/\\/index\\.html$/, '');
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  var onHome = path === '' || path === '/' || path === '/fr' || path === '/es' || path === '/pt';
  if (!onHome) return;
  var params = new URLSearchParams(location.search);
  var queryLang = code(params.get('lang'));
  if (queryLang) {
    try {
      var saved = JSON.parse(localStorage.getItem('nervio') || '{}') || {};
      if (!saved || typeof saved !== 'object') saved = {};
      saved.v = 1;
      saved.lang = queryLang;
      localStorage.setItem('nervio', JSON.stringify(saved));
    } catch (err) {}
    params.delete('lang');
    var qs = params.toString();
    var dest = home(queryLang) + (qs ? '?' + qs : '') + location.hash;
    var here = (path === '' || path === '/') ? '/' : path + '/';
    if (here !== home(queryLang)) location.replace(dest);
    else history.replaceState(null, '', dest);
    return;
  }
  if (path !== '' && path !== '/') return;
  var preferred = '';
  try {
    var note = JSON.parse(localStorage.getItem('nervio') || 'null');
    preferred = code(note && note.lang);
  } catch (err) {}
  if (!preferred) {
    var list = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < list.length; i += 1) {
      preferred = code(list[i]);
      if (preferred) break;
    }
  }
  if (!preferred || preferred === 'en') return;
  params.delete('lang');
  var rest = params.toString();
  location.replace(home(preferred) + (rest ? '?' + rest : '') + location.hash);
})();
</script>`;
}

function renderHome(lang) {
  const copy = TRANSLATIONS[lang];
  const chrome = CHROME[lang];
  const canonical = `${SITE}${homePath(lang)}`;
  const locales = LANGS.filter((code) => code !== lang)
    .map((code) => `  <meta property="og:locale:alternate" content="${CHROME[code].ogLocale}" />`)
    .join('\n');
  const langLinks = LANGS.map((code) => {
    const current = code === lang ? ' aria-current="page"' : '';
    return `<a href="${homePath(code)}" data-set-lang="${code}" lang="${CHROME[code].htmlLang}" hreflang="${CHROME[code].htmlLang}"${current}>${code.toUpperCase()}</a>`;
  }).join('\n          ');
  const modes = ['calm', 'focus', 'sleep', 'panic'].map((id) => `        <button type="button" class="mode-btn" data-mode="${id}" aria-pressed="${id === 'calm' ? 'true' : 'false'}">
          <span class="mode-icon" aria-hidden="true">${MODE_ICONS[id]}</span>
          <span class="mode-copy"><span class="mode-name">${esc(copy.modes[id].name)}</span><span class="mode-sub">${esc(copy.modes[id].sub)}</span></span>
        </button>`).join('\n');
  const durations = [
    ['30s', 'quick', false],
    ['1m', 'min1', false],
    ['2m', 'min2', true],
  ].map(([id, key, on]) => `        <button type="button" data-dur="${id}" aria-pressed="${on}">${esc(copy.durations[key])}</button>`).join('\n');
  const pattern = `${copy.phases.INHALE} ${copy.sec(4)} · ${copy.phases.EXHALE} ${copy.sec(6)} · ${copy.durations.min2}`;
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Nervio',
        url: canonical,
        inLanguage: ['en', 'fr-CA', 'es', 'pt-BR'],
        description: copy.description,
      },
      {
        '@type': 'WebApplication',
        name: 'Nervio',
        url: canonical,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        inLanguage: ['en', 'fr-CA', 'es', 'pt-BR'],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' },
        description: copy.description,
      },
    ],
  }).replaceAll('<', '\\u003c');

  return `<!DOCTYPE html>
<html lang="${chrome.htmlLang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ${langBootScript()}
  <meta name="color-scheme" content="dark" />
  <meta name="theme-color" content="#090c0b" />
  <link rel="preload" href="/fonts/fraunces-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/outfit-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin />
  <title>${esc(copy.title)}</title>
  <meta name="description" content="${esc(copy.description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Nervio" />
  <meta property="og:title" content="${esc(copy.title)}" />
  <meta property="og:description" content="${esc(copy.description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${SITE}/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Nervio, a free breathing app on a black background" />
  <meta property="og:locale" content="${chrome.ogLocale}" />
${locales}
${homeHreflangLinks()}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(copy.title)}" />
  <meta name="twitter:description" content="${esc(copy.description)}" />
  <meta name="twitter:image" content="${SITE}/og.png" />
  ${iconLinks()}
  <script type="application/ld+json">
  ${jsonLd}
  </script>
</head>
<body>
  <a class="skip" href="#main" id="skip">${esc(copy.skip)}</a>
  <div class="app is-idle" id="app" data-mode="calm">
    <div class="progress" id="progress" hidden>
      <div class="progress-fill" id="progress-fill" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="${esc(copy.progress)}"></div>
    </div>
    <header class="nav">
      <a class="brand" href="${homePath(lang)}" id="brand">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-name">Nervio</span>
      </a>
      ${helpButtonHtml(lang)}
      <div class="nav-actions">
        <nav class="langs" id="langs" aria-label="${esc(copy.language)}">
          ${langLinks}
        </nav>
        <button type="button" class="icon-btn" id="cancel" hidden aria-label="${esc(copy.cancel)}"><span aria-hidden="true">✕</span></button>
        <button type="button" class="icon-btn" id="mute" aria-pressed="false" aria-label="${esc(copy.mute)}">
          <svg class="icon-on" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 9h4l5-4v14l-5-4H4V9zm12.5 3a3.5 3.5 0 0 0-1.8-3.06v6.12A3.5 3.5 0 0 0 16.5 12z"/></svg>
          <svg class="icon-off" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" hidden><path fill="currentColor" d="M4 9h4l5-4v14l-5-4H4V9zm13.1 3 2.4-2.4-1.4-1.4L15.7 10.6 13.3 8.2l-1.4 1.4 2.4 2.4-2.4 2.4 1.4 1.4 2.4-2.4 2.4 2.4 1.4-1.4z"/></svg>
        </button>
      </div>
    </header>
    <main id="main" class="stage-wrap">
      <div class="hero" id="hero">
        <h1 id="hero-title">${esc(copy.welcome)}</h1>
        <p class="hero-sub" id="hero-sub">${esc(copy.subWelcome)}</p>
      </div>
      <div class="stage" id="stage" aria-hidden="true">
        <div class="breath" id="breath">
          <div class="glow"></div>
          <div class="orb" id="orb"></div>
          <div class="ring"></div>
        </div>
      </div>
      <p class="phase" id="phase" aria-live="polite"></p>
      <p class="hint" id="hint"></p>
    </main>
    <section class="controls" id="controls" aria-label="${esc(copy.sessionControls)}">
      <p class="pattern" id="pattern">${esc(pattern)}</p>
      <div class="checkin" id="checkin" hidden>
        <h2 id="how-feel" tabindex="-1">${esc(copy.howFeel)}</h2>
        <div class="checkin-grid">
          <button type="button" data-feedback="better"><span id="label-better">${esc(copy.better)}</span></button>
          <button type="button" data-feedback="same"><span id="label-same">${esc(copy.same)}</span></button>
          <button type="button" data-feedback="worse"><span id="label-worse">${esc(copy.worse)}</span></button>
        </div>
      </div>
      <div class="modes" id="modes" role="group" aria-label="${esc(copy.modesLabel)}">
${modes}
      </div>
      <div class="durations" id="durations" role="group" aria-label="${esc(copy.durationLabel)}">
${durations}
      </div>
      <button type="button" class="go" id="go" aria-describedby="pattern">${esc(copy.breathe)}</button>
      <a class="guides-jump" id="guides-jump" href="#guides">${esc(copy.guides)}</a>
      <p class="liability" id="liability">
        <span id="liability-line">${esc(copy.liability)}</span>
        <span id="liability-stop">${esc(copy.liabilityStop)}</span>
        <a id="liability-terms" href="${esc(legalPath('terms', lang))}">${esc(copy.terms)}</a>
      </p>
    </section>
  </div>
  <noscript class="noscript">
    <p>The guided exercise needs JavaScript. The written guides below work without it.</p>
    <p lang="fr-CA">L’exercice guidé a besoin de JavaScript. Les guides écrits plus bas fonctionnent sans.</p>
    <p lang="es">El ejercicio guiado necesita JavaScript. Las guías escritas de abajo funcionan sin él.</p>
    <p lang="pt-BR">O exercício guiado precisa de JavaScript. Os guias escritos abaixo funcionam sem ele.</p>
  </noscript>
  <footer class="site-footer" id="guides">
    <!-- guides:start -->
    ${footerHtml()}
    <!-- guides:end -->
  </footer>
  ${helpDialogHtml(lang)}
  <script type="module" src="/help.js"></script>
  <script type="module" src="/app.js"></script>
</body>
</html>
`;
}

function homeAlternatesXml() {
  return HOME_HREFLANG
    .map(([hreflang, href]) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`)
    .join('\n');
}

function sitemap() {
  const homeLastmod = '2026-10-24';
  const homes = LANGS.map((lang) => `  <url>\n    <loc>${SITE}${homePath(lang)}</loc>\n    <lastmod>${homeLastmod}</lastmod>\n${homeAlternatesXml()}\n  </url>`);
  const rest = [
    ...LANGS.flatMap((lang) => ['terms', 'privacy'].map((kind) => `${SITE}${legalPath(kind, lang)}`)),
    ...TOPICS.flatMap((topic) => LANGS.map((lang) => `${SITE}${pagePath(topic, lang)}`)),
  ].map((loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${PUBLISHED}</lastmod>\n  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${homes.concat(rest).join('\n')}\n</urlset>\n`;
}

function write(file, contents) {
  const dest = path.join(root, file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, contents);
}

for (const topic of TOPICS) {
  for (const lang of LANGS) {
    if (!topic[lang]) throw new Error(`Missing ${lang} copy for ${topic.id}`);
    write(path.join(lang, topic[lang].slug, 'index.html'), renderArticle(topic, lang));
  }
}

for (const kind of ['terms', 'privacy']) {
  for (const lang of LANGS) {
    const rel = legalPath(kind, lang).replace(/^\/|\/$/g, '');
    write(path.join(rel, 'index.html'), renderLegal(kind, lang));
  }
}

write('404.html', render404());
write('sitemap.xml', sitemap());
for (const lang of LANGS) {
  write(lang === 'en' ? 'index.html' : path.join(lang, 'index.html'), renderHome(lang));
}

console.log(`Wrote ${TOPICS.length * LANGS.length} guides, ${LANGS.length * 2} legal pages, 4 language homes, 404.html, and sitemap.xml.`);
