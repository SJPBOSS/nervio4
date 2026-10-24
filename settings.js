export const LANGS = ['en', 'fr', 'es', 'pt', 'de', 'it', 'nl', 'ja', 'ko', 'hi'];
export const MODE_IDS = ['calm', 'focus', 'sleep', 'panic'];
export const DURATIONS = ['30s', '1m', '2m'];

export const LANG_META = {
  en: { htmlLang: 'en', og: 'en_US', code: 'EN', name: 'English', breadcrumb: 'Breadcrumb' },
  fr: { htmlLang: 'fr-CA', og: 'fr_CA', code: 'FR', name: 'Français', breadcrumb: 'Fil d’Ariane' },
  es: { htmlLang: 'es', og: 'es_ES', code: 'ES', name: 'Español', breadcrumb: 'Miga de pan' },
  pt: { htmlLang: 'pt-BR', og: 'pt_BR', code: 'PT', name: 'Português', breadcrumb: 'Caminho' },
  de: { htmlLang: 'de', og: 'de_DE', code: 'DE', name: 'Deutsch', breadcrumb: 'Pfad' },
  it: { htmlLang: 'it', og: 'it_IT', code: 'IT', name: 'Italiano', breadcrumb: 'Percorso' },
  nl: { htmlLang: 'nl', og: 'nl_NL', code: 'NL', name: 'Nederlands', breadcrumb: 'Pad' },
  ja: { htmlLang: 'ja', og: 'ja_JP', code: 'JA', name: '日本語', breadcrumb: 'パンくず' },
  ko: { htmlLang: 'ko', og: 'ko_KR', code: 'KO', name: '한국어', breadcrumb: '경로' },
  hi: { htmlLang: 'hi', og: 'hi_IN', code: 'HI', name: 'हिन्दी', breadcrumb: 'पथ' },
};

export function normalizeLang(value) {
  const v = String(value || '').toLowerCase().replaceAll('_', '-');
  for (const code of LANGS) {
    if (v === code || v.startsWith(`${code}-`)) return code;
  }
  return null;
}

export function normalizeMode(value) {
  const v = String(value || '').toLowerCase();
  if (v === 'reset' || v === 'panic') return 'panic';
  if (MODE_IDS.includes(v)) return v;
  return null;
}

export function normalizeDur(value) {
  const v = String(value || '').toLowerCase();
  if (DURATIONS.includes(v)) return v;
  return null;
}

export function detectLang(languages) {
  const list = Array.isArray(languages) ? languages : [];
  for (const raw of list) {
    const found = normalizeLang(raw);
    if (found) return found;
  }
  return null;
}

export function publicMode(mode) {
  return mode === 'panic' ? 'reset' : mode;
}

export function clampDifficulty(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  const stepped = Math.round(n * 2) / 2;
  return Math.min(6, Math.max(-3, stepped));
}

/** App home for a language. English stays at `/` so the existing canonical does not move. */
export function homePath(lang) {
  const code = normalizeLang(lang) || 'en';
  return code === 'en' ? '/' : `/${code}/`;
}

/**
 * Language of an app home, or null for guides and legal pages.
 * `/` is the English home. `/fr/conditions/` is not.
 */
export function homeLang(pathname) {
  let path = String(pathname || '');
  path = path.replace(/\/index\.html$/, '');
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  if (path === '' || path === '/') return 'en';
  const code = path.slice(1);
  if (LANGS.includes(code) && code !== 'en') return code;
  return null;
}

/**
 * Where a visit should go so the address matches the language.
 * `replace` loads another home. `replaceState` only strips a redundant ?lang=.
 * Returns null when the current home should stay.
 */
export function languageTarget({ pathname = '/', search = '', hash = '', stored = null, languages = [] } = {}) {
  const pathLang = homeLang(pathname);
  if (!pathLang) return null;
  const raw = String(search || '').replace(/^\?/, '');
  const params = new URLSearchParams(raw);
  const queryLang = normalizeLang(params.get('lang'));
  params.delete('lang');
  const qs = params.toString();
  const hashPart = !hash ? '' : hash.startsWith('#') ? hash : `#${hash}`;
  const build = (lang) => `${homePath(lang)}${qs ? `?${qs}` : ''}${hashPart}`;
  const currentHome = homePath(pathLang);

  if (queryLang) {
    const dest = build(queryLang);
    if (currentHome !== homePath(queryLang)) return { url: dest, method: 'replace' };
    const current = `${currentHome}${search ? (String(search).startsWith('?') ? search : `?${search}`) : ''}${hashPart}`;
    if (current !== dest) return { url: dest, method: 'replaceState' };
    return null;
  }

  if (pathLang !== 'en') return null;
  const saved = stored && typeof stored === 'object' ? normalizeLang(stored.lang) : null;
  const preferred = saved || detectLang(languages);
  if (preferred && preferred !== 'en') return { url: build(preferred), method: 'replace' };
  return null;
}

/**
 * A ?lang= query still wins, so old shared links work until they redirect.
 * A language home such as /fr/ wins over a saved language when the query is absent.
 * On `/`, saved preferences win over the browser language.
 */
export function resolveSettings({ search = '', pathname = '', stored = null, languages = [] } = {}) {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const saved = stored && typeof stored === 'object' ? stored : {};
  const pathLang = pathname ? homeLang(pathname) : null;
  const specificPath = pathLang && pathLang !== 'en' ? pathLang : null;
  const lang = normalizeLang(params.get('lang')) || specificPath || normalizeLang(saved.lang) || detectLang(languages) || 'en';
  const mode = normalizeMode(params.get('mode')) || normalizeMode(saved.mode) || 'calm';
  const duration = normalizeDur(params.get('dur')) || normalizeDur(saved.duration) || '2m';
  const sessions = Number.isFinite(Number(saved.sessions)) ? Math.max(0, Math.floor(Number(saved.sessions))) : 0;
  return {
    lang,
    mode,
    duration,
    muted: Boolean(saved.muted),
    difficulty: clampDifficulty(saved.difficulty),
    sessions,
  };
}
