import fs from 'node:fs';
import path from 'node:path';
import { SITE, PUBLISHED, LANGS, TOPICS, CHROME, DISCLAIMERS, BLURBS, pagePath } from './content.js';

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
  params.set('lang', lang);
  params.set('mode', mode);
  if (dur) params.set('dur', dur);
  return `/?${params.toString()}`;
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

function footerHtml() {
  const blurbs = LANGS.map((lang) => `<p lang="${esc(CHROME[lang].htmlLang)}">${esc(BLURBS[lang])}</p>`).join('\n    ');
  return `<h2>Guides</h2>
  <div class="guide-columns">
    ${guideColumns()}
  </div>
  <div class="footer-blurbs">
    ${blurbs}
  </div>`;
}

function disclaimerHtml(lang) {
  const block = DISCLAIMERS[lang];
  const paragraphs = block.blocks.map((parts) => `<p>${segments(parts)}</p>`).join('\n      ');
  return `<aside class="disclaimer">
      <h2>${esc(block.heading)}</h2>
      ${paragraphs}
    </aside>`;
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
          { '@type': 'ListItem', position: 1, name: 'Nervio', item: `${SITE}/?lang=${lang}` },
          { '@type': 'ListItem', position: 2, name: chrome.guides, item: `${SITE}/?lang=${lang}#guides` },
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
  <meta name="theme-color" content="#050505" />
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
    <a class="brand" href="/?lang=${lang}">
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
        <li><a href="/?lang=${lang}">Nervio</a></li>
        <li><a href="/?lang=${lang}#guides">${esc(chrome.guides)}</a></li>
        <li aria-current="page">${esc(copy.h1)}</li>
      </ol>
    </nav>
    <article>
      <p class="eyebrow">${esc(chrome.guides)}</p>
      <h1>${esc(copy.h1)}</h1>
      <p class="note">${esc(copy.note)}</p>
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
    <p><a href="/?lang=${lang}">${esc(chrome.openApp)}</a></p>
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
  <meta name="theme-color" content="#050505" />
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

function sitemap() {
  const urls = [`${SITE}/`, ...TOPICS.flatMap((topic) => LANGS.map((lang) => `${SITE}${pagePath(topic, lang)}`))];
  const body = urls.map((loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${PUBLISHED}</lastmod>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
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

write('404.html', render404());
write('sitemap.xml', sitemap());

const indexPath = path.join(root, 'index.html');
const index = fs.readFileSync(indexPath, 'utf8');
if (!index.includes('<!-- guides:start -->') || !index.includes('<!-- guides:end -->')) {
  throw new Error('Could not find guide markers in index.html');
}
const next = index.replace(
  /<!-- guides:start -->[\s\S]*?<!-- guides:end -->/,
  `<!-- guides:start -->\n    ${footerHtml()}\n    <!-- guides:end -->`,
);
fs.writeFileSync(indexPath, next);

console.log(`Wrote ${TOPICS.length * LANGS.length} guides, 404.html, sitemap.xml, and the home footer.`);
