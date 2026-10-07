import { UserStats } from '../game/types';

export const DEFAULT_USER_STATS: UserStats = {
  highScore: 0,
  highestLevel: 1,
  bestStreak: 0,
  gamesPlayed: 0,
  totalScore: 0,
  soundEnabled: true,
  hapticsEnabled: true,
  adsRemoved: false,
};

/**
 * Validates and normalizes persisted stats, falling back to safe defaults
 * if data is corrupted, malformed, or out of reasonable bounds.
 */
export function validateUserStats(raw: unknown): UserStats {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_USER_STATS };
  }

  const data = raw as Record<string, unknown>;

  const toSafeNonNegativeInt = (val: unknown, fallback: number): number => {
    if (typeof val === 'number' && Number.isFinite(val) && val >= 0) {
      return Math.floor(val);
    }
    return fallback;
  };

  const toBoolean = (val: unknown, fallback: boolean): boolean => {
    if (typeof val === 'boolean') {
      return val;
    }
    return fallback;
  };

  return {
    highScore: toSafeNonNegativeInt(data.highScore, DEFAULT_USER_STATS.highScore),
    highestLevel: Math.max(1, toSafeNonNegativeInt(data.highestLevel, DEFAULT_USER_STATS.highestLevel)),
    bestStreak: toSafeNonNegativeInt(data.bestStreak, DEFAULT_USER_STATS.bestStreak),
    gamesPlayed: toSafeNonNegativeInt(data.gamesPlayed, DEFAULT_USER_STATS.gamesPlayed),
    totalScore: toSafeNonNegativeInt(data.totalScore, DEFAULT_USER_STATS.totalScore),
    soundEnabled: toBoolean(data.soundEnabled, DEFAULT_USER_STATS.soundEnabled),
    hapticsEnabled: toBoolean(data.hapticsEnabled, DEFAULT_USER_STATS.hapticsEnabled),
    adsRemoved: toBoolean(data.adsRemoved, DEFAULT_USER_STATS.adsRemoved),
  };
}
