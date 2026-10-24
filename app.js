import { TECHNIQUES, DURATION_SECONDS, withDifficulty, stepSession, scaleFor } from './breathing.js';
import { TRANSLATIONS, MODE_ORDER, DUR_ORDER } from './i18n.js';
import { legalPath } from './scripts/legal.js';
import { resolveSettings, publicMode, homePath, homeLang, languageTarget, normalizeLang, LANG_META } from './settings.js';

const STORAGE_KEY = 'nervio';

const $ = (id) => document.getElementById(id);

const els = {
  app: $('app'),
  skip: $('skip'),
  brand: $('brand'),
  langs: $('langs'),
  cancel: $('cancel'),
  mute: $('mute'),
  progress: $('progress'),
  progressFill: $('progress-fill'),
  hero: $('hero'),
  heroTitle: $('hero-title'),
  heroSub: $('hero-sub'),
  stage: $('stage'),
  breath: $('breath'),
  glow: document.querySelector('.glow'),
  orb: $('orb'),
  phase: $('phase'),
  hint: $('hint'),
  controls: $('controls'),
  pattern: $('pattern'),
  checkin: $('checkin'),
  howFeel: $('how-feel'),
  modes: $('modes'),
  durations: $('durations'),
  go: $('go'),
  guidesJump: $('guides-jump'),
  liabilityLine: $('liability-line'),
  liabilityStop: $('liability-stop'),
  liabilityTerms: $('liability-terms'),
};

let settings = {
  lang: 'en',
  mode: 'calm',
  duration: '2m',
  muted: false,
  difficulty: 0,
  sessions: 0,
};
let idle = true;
let active = false;
let completed = false;
let feedbackGiven = false;
let phase = 'READY';
let phaseElapsed = 0;
let sessionElapsed = 0;
let lastReassureAt = 0;
let reassuranceIndex = 0;
let rafId = 0;
let lastTs = 0;
let heldByHide = false;
let audioCtx = null;

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduceMotion = motionQuery.matches;
motionQuery.addEventListener?.('change', (event) => {
  reduceMotion = event.matches;
  document.body.classList.toggle('reduced', reduceMotion);
  paintMotion();
});
document.body.classList.toggle('reduced', reduceMotion);

function peekStored() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return stored && typeof stored === 'object' ? stored : null;
  } catch {
    return null;
  }
}

function writeStoredLang(lang) {
  const stored = peekStored() || {};
  stored.v = 1;
  stored.lang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* private mode should not block a language redirect */
  }
}

function loadSettings() {
  return resolveSettings({
    search: location.search,
    pathname: location.pathname,
    stored: peekStored(),
    languages: navigator.languages || [navigator.language || ''],
  });
}

function tech() {
  const mode = MODE_ORDER.find((item) => item.id === settings.mode);
  return withDifficulty(TECHNIQUES[mode.tech], settings.difficulty, settings.mode === 'panic');
}

function t() {
  return TRANSLATIONS[settings.lang];
}

function persist() {
  const data = {
    v: 1,
    lang: settings.lang,
    mode: settings.mode,
    duration: settings.duration,
    muted: settings.muted,
    difficulty: settings.difficulty,
    sessions: settings.sessions,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* private mode and full storage should not break the exercise */
  }
  const params = new URLSearchParams(location.search);
  params.delete('lang');
  params.set('mode', publicMode(settings.mode));
  params.set('dur', settings.duration);
  const qs = params.toString();
  const next = `${homePath(settings.lang)}${qs ? `?${qs}` : ''}${location.hash}`;
  const current = `${location.pathname}${location.search}${location.hash}`;
  if (next !== current) history.replaceState({ nervio: 1 }, '', next);
}

function patternText() {
  const copy = t();
  const current = tech();
  const bits = [`${copy.phases.INHALE} ${copy.sec(current.inhale)}`];
  if (current.hold > 0) bits.push(`${copy.phases.HOLD} ${copy.sec(current.hold)}`);
  bits.push(`${copy.phases.EXHALE} ${copy.sec(current.exhale)}`);
  if (current.holdPost > 0) bits.push(`${copy.phases.HOLD} ${copy.sec(current.holdPost)}`);
  if (settings.mode === 'panic') bits.push(copy.noTimer);
  else bits.push(copy.durations[DUR_ORDER.find((item) => item.id === settings.duration).key]);
  return bits.join(' · ');
}

function render() {
  const copy = t();
  const isPanic = settings.mode === 'panic';
  els.app.dataset.mode = settings.mode;
  els.app.classList.toggle('is-idle', idle && !completed);
  document.documentElement.lang = copy.htmlLang;
  syncDocumentMeta(copy);
  els.skip.textContent = copy.skip;
  els.langs.setAttribute('aria-label', copy.language);
  els.controls.setAttribute('aria-label', copy.sessionControls);
  els.modes.setAttribute('aria-label', copy.modesLabel);
  els.durations.setAttribute('aria-label', copy.durationLabel);
  els.progressFill.setAttribute('aria-label', copy.progress);
  els.cancel.setAttribute('aria-label', copy.cancel);
  els.guidesJump.textContent = copy.guides;
  els.liabilityLine.textContent = copy.liability;
  els.liabilityStop.textContent = copy.liabilityStop;
  els.liabilityTerms.textContent = copy.terms;
  els.liabilityTerms.href = legalPath('terms', settings.lang);
  els.howFeel.textContent = copy.howFeel;
  $('label-better').textContent = copy.better;
  $('label-same').textContent = copy.same;
  $('label-worse').textContent = copy.worse;

  for (const link of els.langs.querySelectorAll('[data-set-lang]')) {
    const on = link.dataset.setLang === settings.lang;
    if (on) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
    link.removeAttribute('aria-pressed');
    const params = new URLSearchParams();
    params.set('mode', publicMode(settings.mode));
    params.set('dur', settings.duration);
    link.href = `${homePath(link.dataset.setLang)}?${params.toString()}`;
  }

  const brandParams = new URLSearchParams();
  brandParams.set('mode', publicMode(settings.mode));
  brandParams.set('dur', settings.duration);
  els.brand.href = `${homePath(settings.lang)}?${brandParams.toString()}`;

  for (const button of els.modes.querySelectorAll('[data-mode]')) {
    const id = button.dataset.mode;
    const modeCopy = copy.modes[id];
    button.querySelector('.mode-name').textContent = modeCopy.name;
    button.querySelector('.mode-sub').textContent = modeCopy.sub;
    button.setAttribute('aria-pressed', id === settings.mode ? 'true' : 'false');
  }

  for (const button of els.durations.querySelectorAll('[data-dur]')) {
    const item = DUR_ORDER.find((entry) => entry.id === button.dataset.dur);
    button.textContent = copy.durations[item.key];
    button.setAttribute('aria-pressed', button.dataset.dur === settings.duration ? 'true' : 'false');
  }

  els.mute.setAttribute('aria-pressed', settings.muted ? 'true' : 'false');
  els.mute.setAttribute('aria-label', settings.muted ? copy.unmute : copy.mute);
  els.mute.querySelector('.icon-on').hidden = settings.muted;
  els.mute.querySelector('.icon-off').hidden = !settings.muted;

  const showSetup = idle && !completed;
  const showCheckin = completed && !feedbackGiven;
  els.hero.hidden = active;
  els.modes.hidden = !showSetup;
  els.durations.hidden = !showSetup || isPanic;
  els.pattern.hidden = !showSetup;
  els.checkin.hidden = !showCheckin;
  els.go.hidden = showCheckin;
  els.cancel.hidden = idle;
  els.guidesJump.hidden = !idle;
  els.progress.hidden = !active || isPanic;
  els.app.classList.toggle('is-running', active);
  els.app.classList.toggle('is-done', completed);

  if (completed) {
    els.heroTitle.textContent = copy.done;
    const sessionLine = `${copy.session} #${settings.sessions}`;
    els.heroSub.textContent = isPanic ? `${sessionLine} · ${copy.stayLong}` : sessionLine;
    els.phase.textContent = copy.doneShort;
    els.hint.textContent = '';
    document.title = `${copy.doneShort} — Nervio`;
  } else if (active) {
    els.phase.textContent = copy.phases[phase];
    els.hint.textContent = isPanic ? copy.panicMessage : copy.reassurances[reassuranceIndex];
    document.title = `${copy.phases[phase]} — Nervio`;
  } else if (!idle) {
    els.heroTitle.textContent = copy.welcome;
    els.heroSub.textContent = copy.subWelcome;
    els.phase.textContent = copy.phases[phase];
    els.hint.textContent = '';
    document.title = copy.title;
  } else {
    els.heroTitle.textContent = copy.welcome;
    els.heroSub.textContent = copy.subWelcome;
    els.phase.textContent = '';
    els.hint.textContent = '';
    document.title = copy.title;
  }

  if (showSetup) els.pattern.textContent = patternText();
  if (showSetup) els.go.setAttribute('aria-describedby', 'pattern');
  else els.go.removeAttribute('aria-describedby');

  if (completed) els.go.textContent = copy.startAgain;
  else if (idle) els.go.textContent = copy.breathe;
  else if (active) els.go.textContent = isPanic ? copy.finish : copy.pause;
  else els.go.textContent = copy.resume;

  paintMotion();
}

/** Visual only. Endpoints stay 0 and 1, so the orb still finishes exactly when the phase does. */
function easeVisual(progress) {
  const p = Math.min(1, Math.max(0, Number(progress) || 0));
  return 0.5 - 0.5 * Math.cos(Math.PI * p);
}

function syncDocumentMeta(copy) {
  const origin = 'https://www.panicpause.com';
  const canonicalHref = `${origin}${homePath(settings.lang)}`;
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalHref);
  document.querySelector('meta[name="description"]')?.setAttribute('content', copy.description);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalHref);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', copy.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', copy.description);
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', LANG_META[settings.lang]?.og || 'en_US');
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', copy.title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', copy.description);
  const theme = { calm: '#0a0f0d', focus: '#100e0b', sleep: '#0b0c14', panic: '#120e0d' }[settings.mode];
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme);
}

function paintMotion() {
  const current = tech();
  const dur = phase === 'INHALE' || phase === 'HOLD' || phase === 'EXHALE' || phase === 'HOLD_POST'
    ? (phase === 'INHALE' ? current.inhale : phase === 'HOLD' ? current.hold : phase === 'EXHALE' ? current.exhale : current.holdPost)
    : 0;
  const progress = dur > 0 ? phaseElapsed / dur : 0;
  els.orb.dataset.phase = active ? phase : 'READY';
  const target = els.breath || els.orb;
  if (reduceMotion || !active) {
    target.style.transform = '';
    if (target !== els.orb) els.orb.style.transform = '';
    if (els.glow) {
      els.glow.style.transform = '';
      els.glow.style.opacity = '';
    }
  } else {
    const scale = scaleFor(phase, easeVisual(progress));
    target.style.transform = `translateZ(0) scale(${scale})`;
    if (!els.breath && els.glow) {
      els.glow.style.transform = `translateZ(0) scale(${scale})`;
      els.glow.style.opacity = String(0.45 + (scale - 1) * 0.62);
    }
  }
  if (active && settings.mode !== 'panic') {
    const total = DURATION_SECONDS[settings.duration];
    const pct = Math.max(0, Math.min(100, (sessionElapsed / total) * 100));
    els.progressFill.style.width = `${pct}%`;
    els.progressFill.setAttribute('aria-valuenow', String(Math.round(pct)));
  }
}

function unlockAudio() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playCue(kind) {
  if (settings.muted) return;
  const ctx = audioCtx;
  if (!ctx) return;
  const cues = {
    INHALE: { freq: 523.25, dur: 0.28, peak: 0.045 },
    HOLD: { freq: 392, dur: 0.14, peak: 0.028 },
    EXHALE: { freq: 261.63, dur: 0.42, peak: 0.04 },
    HOLD_POST: { freq: 329.63, dur: 0.14, peak: 0.028 },
    DONE: { freq: 349.23, dur: 0.7, peak: 0.05 },
  };
  const cue = cues[kind];
  if (!cue) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(cue.freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(cue.peak, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + cue.dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + cue.dur + 0.02);
    if (kind === 'DONE') {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440, now + 0.16);
      gain2.gain.setValueAtTime(0.0001, now + 0.16);
      gain2.gain.exponentialRampToValueAtTime(0.04, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.16);
      osc2.stop(now + 0.9);
    }
  } catch {
    /* audio is a cue, not a requirement */
  }
}

function stopClock() {
  active = false;
  heldByHide = false;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
  lastTs = 0;
}

function frame(ts) {
  if (!active || completed) return;
  if (document.hidden) {
    heldByHide = true;
    lastTs = 0;
    return;
  }
  if (!lastTs) {
    lastTs = ts;
    rafId = requestAnimationFrame(frame);
    return;
  }
  const dt = (ts - lastTs) / 1000;
  lastTs = ts;
  const before = phase;
  const next = stepSession(
    { phase, phaseElapsed, sessionElapsed },
    dt,
    tech(),
    DURATION_SECONDS[settings.duration],
    settings.mode === 'panic',
  );
  phase = next.phase;
  phaseElapsed = next.phaseElapsed;
  sessionElapsed = next.sessionElapsed;
  if (next.completed) {
    completeSession();
    return;
  }
  if (next.phaseChanged && phase !== before) {
    playCue(phase);
    els.phase.textContent = t().phases[phase];
    document.title = `${t().phases[phase]} — Nervio`;
  }
  if (settings.mode !== 'panic' && sessionElapsed - lastReassureAt >= 12) {
    lastReassureAt = sessionElapsed;
    reassuranceIndex = (reassuranceIndex + 1) % t().reassurances.length;
    els.hint.textContent = t().reassurances[reassuranceIndex];
  }
  paintMotion();
  rafId = requestAnimationFrame(frame);
}

function startSession() {
  unlockAudio();
  idle = false;
  completed = false;
  feedbackGiven = false;
  active = true;
  phase = 'INHALE';
  phaseElapsed = 0;
  sessionElapsed = 0;
  lastReassureAt = 0;
  reassuranceIndex = 0;
  heldByHide = false;
  lastTs = 0;
  playCue('INHALE');
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(frame);
  render();
}

function pauseSession() {
  stopClock();
  render();
}

function resumeSession() {
  unlockAudio();
  active = true;
  lastTs = 0;
  rafId = requestAnimationFrame(frame);
  render();
}

function completeSession() {
  if (completed) return;
  stopClock();
  completed = true;
  idle = false;
  feedbackGiven = false;
  settings.sessions += 1;
  persist();
  playCue('DONE');
  render();
  els.howFeel.focus();
}

function resetToIdle() {
  stopClock();
  idle = true;
  completed = false;
  feedbackGiven = false;
  phase = 'READY';
  phaseElapsed = 0;
  sessionElapsed = 0;
  render();
}

function setLang(lang) {
  const next = normalizeLang(lang) || 'en';
  settings.lang = next;
  const stored = peekStored() || {};
  stored.v = 1;
  stored.lang = next;
  stored.mode = settings.mode;
  stored.duration = settings.duration;
  stored.muted = settings.muted;
  stored.difficulty = settings.difficulty;
  stored.sessions = settings.sessions;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* private mode should not block a language change */
  }
  const params = new URLSearchParams();
  params.set('mode', publicMode(settings.mode));
  params.set('dur', settings.duration);
  const dest = `${homePath(next)}?${params.toString()}`;
  if (homeLang(location.pathname) === next) {
    history.replaceState({ nervio: 1 }, '', dest);
    render();
    return;
  }
  location.assign(dest);
}

function setMode(mode) {
  settings.mode = mode;
  persist();
  render();
}

function setDuration(duration) {
  settings.duration = duration;
  persist();
  render();
}

function onFeedback(score) {
  if (score === 'worse') settings.difficulty = Math.max(-3, Math.round((settings.difficulty - 0.5) * 2) / 2);
  if (score === 'better') settings.difficulty = Math.min(6, Math.round((settings.difficulty + 0.5) * 2) / 2);
  feedbackGiven = true;
  persist();
  render();
  els.go.focus();
}

els.langs.addEventListener('click', (event) => {
  const link = event.target.closest('[data-set-lang]');
  if (!link) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  setLang(link.dataset.setLang);
});

els.modes.addEventListener('click', (event) => {
  const button = event.target.closest('[data-mode]');
  if (!button) return;
  setMode(button.dataset.mode);
});

els.durations.addEventListener('click', (event) => {
  const button = event.target.closest('[data-dur]');
  if (!button) return;
  setDuration(button.dataset.dur);
});

els.go.addEventListener('click', () => {
  unlockAudio();
  if (completed) {
    startSession();
    return;
  }
  if (idle) {
    startSession();
    return;
  }
  if (settings.mode === 'panic' && active) {
    completeSession();
    return;
  }
  if (active) pauseSession();
  else resumeSession();
});

els.cancel.addEventListener('click', () => resetToIdle());

els.mute.addEventListener('click', () => {
  unlockAudio();
  settings.muted = !settings.muted;
  persist();
  render();
});

document.querySelectorAll('[data-feedback]').forEach((button) => {
  button.addEventListener('click', () => onFeedback(button.dataset.feedback));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !idle) {
    event.preventDefault();
    resetToIdle();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (active) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      lastTs = 0;
      heldByHide = true;
    }
    return;
  }
  if (heldByHide && active && !completed) {
    heldByHide = false;
    lastTs = 0;
    rafId = requestAnimationFrame(frame);
  }
});

const bootTarget = languageTarget({
  pathname: location.pathname,
  search: location.search,
  hash: location.hash,
  stored: peekStored(),
  languages: navigator.languages || [navigator.language || ''],
});
if (bootTarget?.method === 'replace') {
  const queryLang = normalizeLang(new URLSearchParams(location.search).get('lang'));
  if (queryLang) writeStoredLang(queryLang);
  location.replace(bootTarget.url);
} else {
  if (bootTarget?.method === 'replaceState') {
    const queryLang = normalizeLang(new URLSearchParams(location.search).get('lang'));
    if (queryLang) writeStoredLang(queryLang);
    history.replaceState({ nervio: 1 }, '', bootTarget.url);
  }
  settings = loadSettings();
  persist();
  render();
}
