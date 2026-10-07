import { GAME_CONSTANTS } from '../constants/game';
import { clamp } from '../utils/random';
import { ScoreBreakdown } from './types';

export interface ScoreCalculationInput {
  reactionTimeMs: number;
  lifetimeMs: number;
  streak: number;
  level: number;
}

/**
 * Deterministically calculates the score for a successful target hit.
 * Combines base points, reaction speed bonus, streak multiplier, and level bonus.
 * Strictly guarantees non-negative, finite integer values (no NaN, Infinity, or overflow).
 */
export function calculateHitScore(input: ScoreCalculationInput): ScoreBreakdown {
  const safeReaction = Number.isFinite(input.reactionTimeMs) ? Math.max(0, input.reactionTimeMs) : 0;
  const safeLifetime = Number.isFinite(input.lifetimeMs) && input.lifetimeMs > 0
    ? input.lifetimeMs
    : GAME_CONSTANTS.INITIAL_LIFETIME_MS;
  const safeStreak = Number.isFinite(input.streak) ? Math.max(0, Math.floor(input.streak)) : 0;
  const safeLevel = Number.isFinite(input.level) ? Math.max(1, Math.floor(input.level)) : 1;

  // 1. Base Points
  const basePoints = GAME_CONSTANTS.BASE_POINTS;

  // 2. Reaction Speed Bonus (rewarding fast reflexes)
  // Ratio is between 0 (close to timeout) and 1 (instant tap)
  const speedRatio = clamp(1 - safeReaction / safeLifetime, 0, 1);
  const reactionBonus = Math.round(speedRatio * GAME_CONSTANTS.MAX_REACTION_BONUS);

  // 3. Streak Multiplier Bonus
  const streakBonus = safeStreak * GAME_CONSTANTS.STREAK_BONUS_MULTIPLIER;

  // 4. Level Multiplier Bonus
  const levelBonus = (safeLevel - 1) * GAME_CONSTANTS.LEVEL_MULTIPLIER;

  // Total
  const totalEarned = Math.max(0, basePoints + reactionBonus + streakBonus + levelBonus);

  // Safeguard against overflow or non-finite numbers
  const safeTotal = Number.isFinite(totalEarned) ? Math.floor(totalEarned) : basePoints;

  return {
    basePoints,
    reactionBonus,
    streakBonus,
    levelBonus,
    totalEarned: safeTotal,
  };
}

/**
 * Computes updated total score safely preventing overflow and NaN.
 */
export function addScore(currentScore: number, earned: number): number {
  const safeCurrent = Number.isFinite(currentScore) && currentScore >= 0 ? currentScore : 0;
  const safeEarned = Number.isFinite(earned) && earned >= 0 ? earned : 0;
  const sum = safeCurrent + safeEarned;
  return Number.isSafeInteger(sum) ? sum : Number.MAX_SAFE_INTEGER;
}
