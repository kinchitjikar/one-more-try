import { GAME_CONSTANTS } from '../constants/game';
import { clamp } from '../utils/random';
import { DifficultyParams } from './types';

/**
 * Calculates deterministic difficulty scaling parameters based on the current level.
 * Guarantees strict physiological minimums so the game always remains humanly playable.
 */
export function calculateDifficulty(level: number): DifficultyParams {
  // Ensure level is a positive integer >= 1
  const safeLevel = Math.max(1, Math.floor(Number.isFinite(level) ? level : 1));

  // 1. Target Size Scaling: Starts at 96px and gently decreases to safe minimum (56px)
  const calculatedSize =
    GAME_CONSTANTS.INITIAL_TARGET_SIZE - (safeLevel - 1) * GAME_CONSTANTS.SIZE_DECAY_RATE;
  const targetSize = Math.round(
    clamp(calculatedSize, GAME_CONSTANTS.MIN_TARGET_SIZE, GAME_CONSTANTS.INITIAL_TARGET_SIZE)
  );

  // 2. Lifetime Scaling: Exponential decay curve down to physiological reflex lower bound (480ms)
  // At level 1: 2000ms, Level 5: ~1550ms, Level 10: ~1180ms, Level 20: ~720ms, Level 30+: ~480ms
  const decayFactor = Math.pow(GAME_CONSTANTS.LIFETIME_DECAY_EXPONENT, (safeLevel - 1) * 0.4);
  const rawLifetime = GAME_CONSTANTS.INITIAL_LIFETIME_MS * decayFactor;
  const lifetimeMs = Math.round(
    clamp(rawLifetime, GAME_CONSTANTS.MIN_LIFETIME_MS, GAME_CONSTANTS.INITIAL_LIFETIME_MS)
  );

  // 3. Decoys: Introduces subtle distractors at higher levels
  let decoyCount = 0;
  if (safeLevel >= GAME_CONSTANTS.DECOY_START_LEVEL) {
    if (safeLevel >= GAME_CONSTANTS.DECOY_START_LEVEL + 8) {
      decoyCount = Math.min(2, GAME_CONSTANTS.MAX_DECOYS);
    } else {
      decoyCount = 1;
    }
  }

  // 4. Target Movement: Starts drifting at level 14+ to challenge spatial prediction
  let movementSpeed = 0;
  if (safeLevel >= GAME_CONSTANTS.MOVEMENT_START_LEVEL) {
    const speedRatio = Math.min(1, (safeLevel - GAME_CONSTANTS.MOVEMENT_START_LEVEL) / 15);
    movementSpeed = Math.round(speedRatio * GAME_CONSTANTS.MAX_MOVEMENT_SPEED);
  }

  return {
    level: safeLevel,
    targetSize,
    lifetimeMs,
    decoyCount,
    movementSpeed,
  };
}
