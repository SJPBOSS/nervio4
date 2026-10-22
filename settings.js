export const LANGS = ['en', 'fr', 'es', 'pt'];
export const MODE_IDS = ['calm', 'focus', 'sleep', 'panic'];
export const DURATIONS = ['30s', '1m', '2m'];

export function normalizeLang(value) {
  const v = String(value || '').toLowerCase();
  if (v === 'en' || v.startsWith('en-')) return 'en';
  if (v === 'fr' || v.startsWith('fr')) return 'fr';
  if (v === 'es' || v.startsWith('es')) return 'es';
  if (v === 'pt' || v.startsWith('pt')) return 'pt';
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

/**
 * URL wins over saved preferences, which win over the browser language.
 * Shared links like /?lang=fr&mode=sleep stay stable across refresh.
 */
export function resolveSettings({ search = '', stored = null, languages = [] } = {}) {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const saved = stored && typeof stored === 'object' ? stored : {};
  const lang = normalizeLang(params.get('lang')) || normalizeLang(saved.lang) || detectLang(languages) || 'en';
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
