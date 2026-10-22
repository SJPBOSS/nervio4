import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { DURATION_SECONDS, TECHNIQUES, durationOf, nextPhase, scaleFor, stepSession, withDifficulty } from '../breathing.js';
import { TRANSLATIONS } from '../i18n.js';
import { publicMode, resolveSettings } from '../settings.js';
import { LANGS, TOPICS, pagePath } from '../scripts/content.js';

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
      assert.match(html, /tel:988/);
      assert.match(html, /sms:988/);
      assert.match(html, /https:\/\/988\.ca\//);
      if (lang === 'en') assert.match(html, /not a substitute for professional care/);
      if (lang === 'fr') {
        assert.match(html, /pas un substitut à des soins professionnels/);
        assert.match(html, /3114/);
        assert.match(html, /textez/);
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
      }
      if (lang === 'pt') {
        assert.match(html, /não substitui o acompanhamento profissional/);
        assert.match(html, /tel:188/);
        assert.match(html, /https:\/\/www\.cvv\.org\.br\//);
        assert.match(html, /lang="pt-BR"/);
        assert.match(html, /\/pt\//);
      }
      assert.match(html, new RegExp(`mode=${topic.mode}`));
      assert.doesNotMatch(html, banned);
      assert.doesNotMatch(html, /%/);
      const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
      assert.ok(text.length > 2200, `${rel} looks thin (${text.length})`);
    }
  }
});
