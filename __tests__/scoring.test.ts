import { calculateHitScore, addScore } from '../src/game/scoring';
import { GAME_CONSTANTS } from '../src/constants/game';

describe('Scoring Module', () => {
  it('calculates score correctly for a perfect instant reaction at level 1', () => {
    const result = calculateHitScore({
      reactionTimeMs: 0,
      lifetimeMs: 2000,
      streak: 0,
      level: 1,
    });

    expect(result.basePoints).toBe(GAME_CONSTANTS.BASE_POINTS);
    expect(result.reactionBonus).toBe(GAME_CONSTANTS.MAX_REACTION_BONUS); // 200
    expect(result.streakBonus).toBe(0);
    expect(result.levelBonus).toBe(0);
    expect(result.totalEarned).toBe(300);
  });

  it('calculates score correctly for last-millisecond tap', () => {
    const result = calculateHitScore({
      reactionTimeMs: 1999,
      lifetimeMs: 2000,
      streak: 0,
      level: 1,
    });

    expect(result.basePoints).toBe(GAME_CONSTANTS.BASE_POINTS);
    expect(result.reactionBonus).toBe(0);
    expect(result.streakBonus).toBe(0);
    expect(result.levelBonus).toBe(0);
    expect(result.totalEarned).toBe(100);
  });

  it('rewards streak multipliers and higher levels', () => {
    const result = calculateHitScore({
      reactionTimeMs: 500,
      lifetimeMs: 1000,
      streak: 5,
      level: 10,
    });

    expect(result.basePoints).toBe(100);
    expect(result.reactionBonus).toBe(100); // 50% reaction speed = 100 bonus
    expect(result.streakBonus).toBe(5 * GAME_CONSTANTS.STREAK_BONUS_MULTIPLIER); // 75
    expect(result.levelBonus).toBe(9 * GAME_CONSTANTS.LEVEL_MULTIPLIER); // 90
    expect(result.totalEarned).toBe(365);
  });

  it('never returns NaN, Infinity, or negative score on malformed input', () => {
    const tests = [
      { reactionTimeMs: NaN, lifetimeMs: NaN, streak: NaN, level: NaN },
      { reactionTimeMs: -500, lifetimeMs: -100, streak: -10, level: -5 },
      { reactionTimeMs: Infinity, lifetimeMs: Infinity, streak: Infinity, level: Infinity },
    ];

    for (const input of tests) {
      const result = calculateHitScore(input);
      expect(Number.isFinite(result.totalEarned)).toBe(true);
      expect(Number.isNaN(result.totalEarned)).toBe(false);
      expect(result.totalEarned).toBeGreaterThanOrEqual(0);
    }
  });

  it('addScore prevents overflow and safely adds non-negative integers', () => {
    expect(addScore(100, 200)).toBe(300);
    expect(addScore(-10, 50)).toBe(50);
    expect(addScore(NaN, 100)).toBe(100);
    expect(addScore(100, NaN)).toBe(100);
    expect(addScore(Number.MAX_SAFE_INTEGER, 1000)).toBe(Number.MAX_SAFE_INTEGER);
  });
});
