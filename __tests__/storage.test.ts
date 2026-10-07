import { validateUserStats, DEFAULT_USER_STATS } from '../src/utils/validation';

describe('Storage & Validation Module', () => {
  it('returns default stats for null, undefined, or invalid objects', () => {
    expect(validateUserStats(null)).toEqual(DEFAULT_USER_STATS);
    expect(validateUserStats(undefined)).toEqual(DEFAULT_USER_STATS);
    expect(validateUserStats('corrupt string')).toEqual(DEFAULT_USER_STATS);
    expect(validateUserStats([])).toEqual(DEFAULT_USER_STATS);
  });

  it('correctly parses and keeps valid stats', () => {
    const valid = {
      highScore: 1250,
      highestLevel: 15,
      bestStreak: 12,
      gamesPlayed: 45,
      totalScore: 50400,
      soundEnabled: false,
      hapticsEnabled: true,
      adsRemoved: true,
    };

    expect(validateUserStats(valid)).toEqual(valid);
  });

  it('sanitizes negative, NaN, and corrupted fields with safe defaults', () => {
    const corrupt = {
      highScore: -500,
      highestLevel: 'not a number',
      bestStreak: NaN,
      gamesPlayed: Infinity,
      totalScore: -999,
      soundEnabled: 'yes', // should fall back to default boolean
      hapticsEnabled: null,
      adsRemoved: 123,
    };

    const sanitized = validateUserStats(corrupt);
    expect(sanitized.highScore).toBe(0);
    expect(sanitized.highestLevel).toBe(1);
    expect(sanitized.bestStreak).toBe(0);
    expect(sanitized.gamesPlayed).toBe(0);
    expect(sanitized.totalScore).toBe(0);
    expect(sanitized.soundEnabled).toBe(DEFAULT_USER_STATS.soundEnabled);
    expect(sanitized.hapticsEnabled).toBe(DEFAULT_USER_STATS.hapticsEnabled);
    expect(sanitized.adsRemoved).toBe(DEFAULT_USER_STATS.adsRemoved);
  });
});
