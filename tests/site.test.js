import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { DURATION_SECONDS, TECHNIQUES, durationOf, nextPhase, scaleFor, stepSession, withDifficulty } from '../breathing.js';
import { TRANSLATIONS } from '../i18n.js';
import { publicMode, resolveSettings } from '../settings.js';
import { LANGS, TOPICS, pagePath } from '../scripts/content.js';
import { CHECKED, legalPath } from '../scripts/legal.js';

const root = path.resolve(import.meta.dirname, '..');

function advance(tech, seconds, { length = 120, openEnded = false } = {}) {
  let state = { phase: 'INHALE', phaseElapsed: 0, sessionElapsed: 0 };
  let left = seconds;
  while (left > 0) {
    const dt = Math.min(left, 0.25);
    state = stepSession(state, dt, tech, length, openEnded);
    if (state.completed) return state;
    left -= dt;
  }
  return state;
}

test('base timings are unchanged', () => {
  assert.deepEqual(TECHNIQUES.relax, { inhale: 4, hold: 0, exhale: 6, holdPost: 0 });
  assert.deepEqual(TECHNIQUES.box, { inhale: 4, hold: 4, exhale: 4, holdPost: 4 });
  assert.deepEqual(TECHNIQUES.sleep, { inhale: 4, hold: 7, exhale: 8, holdPost: 0 });
  assert.deepEqual(TECHNIQUES.panic, { inhale: 3, hold: 0, exhale: 5, holdPost: 0 });
  assert.deepEqual(DURATION_SECONDS, { '30s': 30, '1m': 60, '2m': 120 });
});

test('box breathing changes phase on the count, not a second late', () => {
  const tech = TECHNIQUES.box;
  assert.equal(advance(tech, 3.9).phase, 'INHALE');
  const atFour = advance(tech, 4);
  assert.equal(atFour.phase, 'HOLD');
  assert.ok(atFour.phaseElapsed < 0.02);
  assert.equal(advance(tech, 8).phase, 'EXHALE');
  assert.equal(advance(tech, 12).phase, 'HOLD_POST');
  assert.equal(advance(tech, 16).phase, 'INHALE');
});

test('calm and sleep skip empty holds', () => {
  assert.equal(nextPhase(TECHNIQUES.relax, 'INHALE'), 'EXHALE');
  assert.equal(nextPhase(TECHNIQUES.relax, 'EXHALE'), 'INHALE');
  assert.equal(nextPhase(TECHNIQUES.sleep, 'INHALE'), 'HOLD');
  assert.equal(nextPhase(TECHNIQUES.sleep, 'EXHALE'), 'INHALE');
  assert.equal(durationOf(TECHNIQUES.sleep, 'HOLD'), 7);
  assert.equal(durationOf(TECHNIQUES.panic, 'HOLD'), 0);
});

test('a timed session completes on its length', () => {
  const early = advance(TECHNIQUES.box, 29.75, { length: 30 });
  assert.equal(early.completed, false);
  const done = advance(TECHNIQUES.box, 30, { length: 30 });
  assert.equal(done.completed, true);
  assert.equal(done.sessionElapsed, 30);
  const panic = advance(TECHNIQUES.panic, 90, { openEnded: true });
  assert.equal(panic.completed, false);
});

test('difficulty keeps box square and leaves reset alone', () => {
  const longer = withDifficulty(TECHNIQUES.box, 1, false);
  assert.deepEqual(longer, { inhale: 5, hold: 5, exhale: 5, holdPost: 5 });
  const shorter = withDifficulty(TECHNIQUES.box, -3, false);
  assert.deepEqual(shorter, { inhale: 1.5, hold: 1.5, exhale: 1.5, holdPost: 1.5 });
  const panic = withDifficulty(TECHNIQUES.panic, 4, true);
  assert.deepEqual(panic, TECHNIQUES.panic);
});

test('the orb grows on the inhale and shrinks on the exhale', () => {
  assert.equal(scaleFor('INHALE', 0), 1);
  assert.ok(scaleFor('INHALE', 1) > 1.5);
  assert.equal(scaleFor('HOLD', 0.2), scaleFor('INHALE', 1));
  assert.ok(scaleFor('EXHALE', 1) < 1.05);
});

test('shared links win over a saved language and mode', () => {
  const settings = resolveSettings({
    search: '?lang=es&mode=reset&dur=30s',
    stored: { lang: 'fr', mode: 'sleep', duration: '2m', muted: true, difficulty: 9, sessions: 4.8 },
    languages: ['fr-CA', 'en'],
  });
  assert.equal(settings.lang, 'es');
  assert.equal(settings.mode, 'panic');
  assert.equal(settings.duration, '30s');
  assert.equal(settings.muted, true);
  assert.equal(settings.difficulty, 6);
  assert.equal(settings.sessions, 4);
  assert.equal(publicMode('panic'), 'reset');
});

test('browser language is used only when nothing else is set', () => {
  const settings = resolveSettings({ search: '', stored: null, languages: ['fr-CA', 'en'] });
  assert.equal(settings.lang, 'fr');
  assert.equal(settings.mode, 'calm');
  assert.equal(settings.duration, '2m');
  const portuguese = resolveSettings({ search: '', stored: null, languages: ['pt-BR', 'en'] });
  assert.equal(portuguese.lang, 'pt');
  const linked = resolveSettings({
    search: '?lang=pt&mode=sleep&dur=1m',
    stored: { lang: 'en', mode: 'calm', duration: '2m' },
    languages: ['es'],
  });
  assert.equal(linked.lang, 'pt');
  assert.equal(linked.mode, 'sleep');
  assert.equal(linked.duration, '1m');
});

test('every language has the same strings', () => {
  function leaves(value, prefix = '') {
    if (Array.isArray(value)) return value.map((_, index) => `${prefix}[${index}]`);
    if (value && typeof value === 'object') {
      return Object.entries(value).flatMap(([key, child]) => leaves(child, prefix ? `${prefix}.${key}` : key));
    }
    return [prefix];
  }
  const english = leaves(TRANSLATIONS.en).sort();
  for (const lang of ['fr', 'es', 'pt']) {
    assert.deepEqual(leaves(TRANSLATIONS[lang]).sort(), english);
    for (const key of english) {
      const read = (obj) => key.split('.').reduce((acc, part) => {
        const match = part.match(/^(.+)\[(\d+)\]$/);
        if (match) return acc[match[1]][Number(match[2])];
        if (part.includes('[')) {
          const [name, index] = part.split('[');
          return acc[name][Number(index.replace(']', ''))];
        }
        return acc[part];
      }, obj);
      const value = read(TRANSLATIONS[lang]);
      assert.ok(value !== '' && value != null, `${lang} ${key}`);
    }
  }
  assert.notEqual(TRANSLATIONS.fr.modes.focus.name, TRANSLATIONS.en.modes.focus.name);
  assert.notEqual(TRANSLATIONS.fr.modes.panic.name, 'Reset');
  assert.notEqual(TRANSLATIONS.es.modes.focus.name, TRANSLATIONS.en.modes.focus.name);
  assert.notEqual(TRANSLATIONS.es.modes.panic.name, 'Reset');
  assert.notEqual(TRANSLATIONS.fr.doneShort, 'Done');
  assert.notEqual(TRANSLATIONS.es.doneShort, 'Done');
  assert.equal(TRANSLATIONS.pt.htmlLang, 'pt-BR');
  assert.notEqual(TRANSLATIONS.pt.modes.focus.name, TRANSLATIONS.en.modes.focus.name);
  assert.notEqual(TRANSLATIONS.pt.modes.panic.name, 'Reset');
  assert.notEqual(TRANSLATIONS.pt.doneShort, 'Done');
  assert.match(TRANSLATIONS.pt.howFeel, /você/);
  assert.equal(TRANSLATIONS.en.modes.calm.sub, 'Help you feel calmer');
  assert.equal(TRANSLATIONS.fr.modes.calm.sub, 'Vous sentir plus calme');
  assert.equal(TRANSLATIONS.es.modes.calm.sub, 'Sentirte más en calma');
  assert.equal(TRANSLATIONS.pt.modes.calm.sub, 'Sentir mais calma');
  assert.match(TRANSLATIONS.fr.liability, /vous/i);
  assert.match(TRANSLATIONS.es.liability, /estás/);
  assert.match(TRANSLATIONS.pt.liabilityStop, /você/);
});

test('the static site keeps its domain and does not lock zoom', () => {
  assert.equal(fs.readFileSync(path.join(root, 'CNAME'), 'utf8').trim(), 'www.panicpause.com');
  const htmlFiles = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) htmlFiles.push(full);
    }
  }
  walk(root);
  assert.ok(htmlFiles.length >= 22);
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    assert.match(html, /name="viewport" content="width=device-width, initial-scale=1"/);
    assert.doesNotMatch(html, /user-scalable|maximum-scale/);
  }
});

test('guides are linked, translated, and careful', () => {
  const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
  assert.match(robots, /Sitemap: https:\/\/www\.panicpause\.com\/sitemap\.xml/);
  assert.match(index, /rel="canonical" href="https:\/\/www\.panicpause\.com\/"/);
  assert.match(index, /og:image/);
  assert.match(index, /Quiet the noise/);
  assert.match(index, /breathing timer for general wellness/);
  assert.match(index, /Help you feel calmer/);
  assert.doesNotMatch(index, /Ease anxiety/);
  assert.match(index, /href="\/en\/terms\/"/);
  assert.match(index, /href="\/en\/privacy\/"/);
  assert.match(index, /href="\/fr\/conditions\/"/);
  assert.match(index, /href="\/fr\/confidentialite\/"/);
  assert.match(index, /href="\/es\/aviso\/"/);
  assert.match(index, /href="\/es\/privacidad\/"/);
  assert.match(index, /href="\/pt\/aviso\/"/);
  assert.match(index, /href="\/pt\/privacidade\/"/);
  const banned = /studies show|research shows|clinically proven|peer-reviewed|des études|cliniquement prouvé|los estudios demuestran|clínicamente probado|estudos mostram|clinicamente comprovado|guaranteed/i;
  for (const topic of TOPICS) {
    for (const lang of LANGS) {
      const rel = pagePath(topic, lang);
      const file = path.join(root, rel.slice(1), 'index.html');
      const html = fs.readFileSync(file, 'utf8');
      assert.match(index, new RegExp(rel.replaceAll('/', '\\/')));
      assert.match(sitemap, new RegExp(rel.replaceAll('/', '\\/')));
      assert.match(html, new RegExp(`rel="canonical" href="https://www\\.panicpause\\.com${rel.replaceAll('/', '\\/')}"`));
      assert.match(html, /hreflang="fr-CA"/);
      assert.match(html, /hreflang="pt-BR"/);
      assert.match(html, /hreflang="pt" href=/);
      assert.match(html, /hreflang="x-default"/);
      assert.match(html, /988/);
      assert.match(html, new RegExp(legalPath('terms', lang).replaceAll('/', '\\/')));
      assert.ok(html.includes(CHECKED[lang]), `${rel} missing ${CHECKED[lang]}`);
      assert.match(html, /class="checked"/);
      assert.match(html, /class="other-countries"/);
      assert.match(html, /class="liability"/);
      if (lang === 'en') assert.match(html, /breathing timer for general wellness/);
      if (lang === 'fr') assert.match(html, /minuteur de respiration/);
      if (lang === 'es') assert.match(html, /temporizador de respiración/);
      if (lang === 'pt') assert.match(html, /cronômetro de respiração/);
      assert.doesNotMatch(html, /not treatment for|Not a sleep treatment|pas un traitement|n’est pas un traitement|no es un tratamiento|não é tratamento/i);
      assert.match(html, /tel:988/);
      assert.match(html, /sms:988/);
      assert.match(html, /https:\/\/988\.ca\//);
      if (lang === 'en') {
        assert.match(html, /not a substitute for professional care/);
        assert.match(html, /Other countries/);
        assert.match(html, /tel:116123/);
        assert.match(html, /tel:131114/);
        assert.match(html, /tel:080017371737/);
        assert.match(html, /sms:1737/);
        assert.match(html, /https:\/\/findahelpline\.com\//);
        assert.ok(html.indexOf('https://988.ca/') < html.indexOf('Other countries'));
        assert.ok(html.indexOf('Other countries') < html.indexOf('findahelpline.com'));
      }
      if (lang === 'fr') {
        assert.match(html, /pas un substitut à des soins professionnels/);
        assert.match(html, /3114/);
        assert.match(html, /textez/);
        assert.match(html, /Autres pays/);
        assert.match(html, /tel:\+18662773553/);
        assert.match(html, /sms:535353/);
        assert.match(html, /tel:080032123/);
        assert.match(html, /1 866 APPELLE/);
        assert.ok(html.indexOf('1 866 APPELLE') < html.indexOf('tel:3114'));
      }
      if (lang === 'es') {
        assert.match(html, /no sustituye la atención profesional/);
        assert.match(html, /tel:024/);
        assert.match(html, /tel:8009112000/);
        assert.match(html, /https:\/\/www\.gob\.mx\/lineadelavida/);
        assert.match(html, /tel:106/);
        assert.match(html, /tel:113/);
        assert.match(html, /opción 5/);
        assert.match(html, /tel:135/);
        assert.match(html, /tel:\*4141/);
        assert.match(html, /Otros países/);
        assert.match(html, /presiona 2/);
        assert.match(html, /tel:08000767/);
        assert.match(html, /tel:\*0767/);
        assert.match(html, /opción 6/);
        assert.match(html, /tel:8002737869/);
        assert.match(html, /tel:711/);
        assert.ok(html.indexOf('tel:024') < html.indexOf('Otros países'));
        assert.doesNotMatch(html, /tel:1538/);
      }
      if (lang === 'pt') {
        assert.match(html, /não substitui o acompanhamento profissional/);
        assert.match(html, /tel:188/);
        assert.match(html, /https:\/\/www\.cvv\.org\.br\//);
        assert.match(html, /lang="pt-BR"/);
        assert.match(html, /\/pt\//);
        assert.match(html, /Outros países/);
        assert.match(html, /tel:808242424/);
        assert.match(html, /tel:\+351213544545/);
        assert.match(html, /tel:\+351912802669/);
        assert.match(html, /tel:\+351963524660/);
        assert.match(html, /tel:\+351930712500/);
        assert.match(html, /15h30/);
        assert.ok(html.indexOf('tel:188') < html.indexOf('tel:808242424'));
        assert.ok(html.indexOf('tel:188') < html.indexOf('Outros países'));
      }
      assert.match(html, new RegExp(`mode=${topic.mode}`));
      assert.doesNotMatch(html, banned);
      assert.doesNotMatch(html, /%/);
      const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
      assert.ok(text.length > 2200, `${rel} looks thin (${text.length})`);
    }
  }
});

test('terms and privacy pages describe the real storage and the crisis check date', () => {
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const laws = /\b(GDPR|CCPA|HIPAA|PIPEDA|LGPD|COPPA)\b/;
  const blanket = /does not collect personal data|ne collecte aucune donnée|no recopila datos personales|não coleta dados pessoais/i;
  const storage = {
    en: /local storage/i,
    fr: /stockage local/i,
    es: /almacenamiento local/i,
    pt: /armazenamento local/i,
  };
  for (const lang of LANGS) {
    for (const kind of ['terms', 'privacy']) {
      const rel = legalPath(kind, lang);
      const html = fs.readFileSync(path.join(root, rel.slice(1), 'index.html'), 'utf8');
      assert.match(sitemap, new RegExp(rel.replaceAll('/', '\\/')));
      assert.match(html, new RegExp(`rel="canonical" href="https://www\\.panicpause\\.com${rel.replaceAll('/', '\\/')}"`));
      assert.match(html, /hreflang="fr-CA"/);
      assert.match(html, /hreflang="pt-BR"/);
      assert.match(html, /hreflang="x-default"/);
      assert.doesNotMatch(html, laws);
      assert.doesNotMatch(html, blanket);
      assert.doesNotMatch(html, /Ease anxiety|clinically proven|cliniquement prouvé/i);
    }
    const terms = fs.readFileSync(path.join(root, legalPath('terms', lang).slice(1), 'index.html'), 'utf8');
    const privacy = fs.readFileSync(path.join(root, legalPath('privacy', lang).slice(1), 'index.html'), 'utf8');
    assert.ok(terms.includes(CHECKED[lang]), `${lang} terms missing ${CHECKED[lang]}`);
    assert.match(terms, /tel:988/);
    assert.match(terms, /class="checked"/);
    assert.match(privacy, storage[lang]);
    assert.match(privacy, /nervio/);
    assert.match(privacy, /lang/);
    assert.match(privacy, /mode/);
    assert.match(privacy, /dur/);
    assert.doesNotMatch(privacy, /gtag|analytics\.js|facebook|doubleclick/i);
  }
  const enPrivacy = fs.readFileSync(path.join(root, 'en/privacy/index.html'), 'utf8');
  assert.match(enPrivacy, /do not run analytics/);
  assert.match(enPrivacy, /do not set cookies/);
  assert.match(enPrivacy, /GitHub Pages/);
  assert.match(enPrivacy, /difficulty number/);
  const enTerms = fs.readFileSync(path.join(root, 'en/terms/index.html'), 'utf8');
  assert.match(enTerms, /free of charge/);
  assert.match(enTerms, /at your own risk/);
  assert.match(enTerms, /as it is/);
  assert.match(enTerms, /not responsible/);
  assert.match(enTerms, /not for emergencies/i);
});
