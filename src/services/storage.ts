import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStats } from '../game/types';
import { DEFAULT_USER_STATS, validateUserStats } from '../utils/validation';

const STORAGE_KEY = '@one_more_try_user_stats_v1';

export class StorageService {
  private cachedStats: UserStats = { ...DEFAULT_USER_STATS };
  private isLoaded: boolean = false;

  /**
   * Loads persisted stats from local storage, falling back to defaults gracefully.
   */
  public async loadStats(): Promise<UserStats> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.cachedStats = validateUserStats(parsed);
      } else {
        this.cachedStats = { ...DEFAULT_USER_STATS };
      }
    } catch {
      this.cachedStats = { ...DEFAULT_USER_STATS };
    } finally {
      this.isLoaded = true;
    }
    return this.cachedStats;
  }

  public getStats(): UserStats {
    return this.cachedStats;
  }

  /**
   * Saves updated stats to local storage.
   */
  public async saveStats(stats: Partial<UserStats>): Promise<UserStats> {
    const updated: UserStats = validateUserStats({
      ...this.cachedStats,
      ...stats,
    });
    this.cachedStats = updated;

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage write error handled gracefully; cached stats remain active in memory
    }

    return updated;
  }

  /**
   * Records a completed game run and updates lifetime statistics & high score.
   */
  public async recordGameResult(
    finalScore: number,
    finalLevel: number,
    finalStreak: number
  ): Promise<{ isNewHighScore: boolean; updatedStats: UserStats }> {
    const prev = this.cachedStats;
    const isNewHighScore = finalScore > prev.highScore;

    const updated = await this.saveStats({
      highScore: Math.max(prev.highScore, finalScore),
      highestLevel: Math.max(prev.highestLevel, finalLevel),
      bestStreak: Math.max(prev.bestStreak, finalStreak),
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + finalScore,
    });

    return { isNewHighScore, updatedStats: updated };
  }

  /**
   * Resets all game statistics while preserving settings preferences.
   */
  public async resetStats(): Promise<UserStats> {
    const preservedPreferences = {
      soundEnabled: this.cachedStats.soundEnabled,
      hapticsEnabled: this.cachedStats.hapticsEnabled,
      adsRemoved: this.cachedStats.adsRemoved,
    };

    const reset: UserStats = {
      ...DEFAULT_USER_STATS,
      ...preservedPreferences,
    };

    return this.saveStats(reset);
  }
}

export const storageService = new StorageService();
