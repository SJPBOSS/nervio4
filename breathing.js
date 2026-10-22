/** Timing model for Nervio. Pure functions so the clock can be tested without a browser. */

export const TECHNIQUES = {
  relax: { inhale: 4, hold: 0, exhale: 6, holdPost: 0 },
  box: { inhale: 4, hold: 4, exhale: 4, holdPost: 4 },
  sleep: { inhale: 4, hold: 7, exhale: 8, holdPost: 0 },
  panic: { inhale: 3, hold: 0, exhale: 5, holdPost: 0 },
};

export const DURATION_SECONDS = {
  '30s': 30,
  '1m': 60,
  '2m': 120,
};

const PHASES = ['INHALE', 'HOLD', 'EXHALE', 'HOLD_POST'];

export function roundTenth(n) {
  return Math.round(n * 10) / 10;
}

export function clampDifficulty(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(6, Math.max(-3, roundTenth(n)));
}

/** Same offset on every part of the pattern so box stays square and 4-7-8 keeps its shape. */
export function withDifficulty(base, offset, isPanic) {
  if (isPanic) {
    return { inhale: base.inhale, hold: base.hold, exhale: base.exhale, holdPost: base.holdPost };
  }
  const shift = clampDifficulty(offset);
  const phase = (value) => (value > 0 ? Math.max(1.5, roundTenth(value + shift)) : 0);
  return {
    inhale: phase(base.inhale),
    hold: phase(base.hold),
    exhale: phase(base.exhale),
    holdPost: phase(base.holdPost),
  };
}

export function durationOf(tech, phase) {
  if (phase === 'INHALE') return tech.inhale;
  if (phase === 'HOLD') return tech.hold;
  if (phase === 'EXHALE') return tech.exhale;
  if (phase === 'HOLD_POST') return tech.holdPost;
  return 0;
}

export function nextPhase(tech, phase) {
  const start = Math.max(0, PHASES.indexOf(phase));
  for (let i = 1; i <= PHASES.length; i += 1) {
    const candidate = PHASES[(start + i) % PHASES.length];
    if (durationOf(tech, candidate) > 0) return candidate;
  }
  return 'INHALE';
}

export function scaleFor(phase, progress) {
  const p = Math.min(1, Math.max(0, Number(progress) || 0));
  const grow = 0.62;
  if (phase === 'INHALE') return 1 + p * grow;
  if (phase === 'HOLD') return 1 + grow;
  if (phase === 'EXHALE') return 1 + grow - p * grow;
  return 1;
}

/**
 * Advance the session clock by dt seconds.
 * openEnded sessions (Reset) never complete from the clock.
 * A frame that crosses the session length completes without starting another phase.
 */
export function stepSession(state, dt, tech, sessionLength, openEnded) {
  const safeDt = Math.min(Math.max(Number(dt) || 0, 0), 1);
  let phase = state.phase;
  let phaseElapsed = state.phaseElapsed + safeDt;
  let sessionElapsed = state.sessionElapsed + safeDt;

  if (!openEnded && sessionLength > 0 && sessionElapsed >= sessionLength) {
    return {
      phase,
      phaseElapsed,
      sessionElapsed: sessionLength,
      completed: true,
      phaseChanged: false,
    };
  }

  let phaseChanged = false;
  let guard = 0;
  while (guard < 8) {
    const dur = durationOf(tech, phase);
    if (!(dur > 0) || phaseElapsed < dur) break;
    phaseElapsed -= dur;
    phase = nextPhase(tech, phase);
    phaseChanged = true;
    guard += 1;
  }

  return { phase, phaseElapsed, sessionElapsed, completed: false, phaseChanged };
}
