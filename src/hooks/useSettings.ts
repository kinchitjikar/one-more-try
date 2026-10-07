import { useState, useEffect, useCallback } from 'react';
import { UserStats } from '../game/types';
import { storageService } from '../services/storage';
import { audioService } from '../services/audio';
import { hapticsService } from '../services/haptics';
import { adService } from '../services/ads';
import { DEFAULT_USER_STATS } from '../utils/validation';

export function useSettings() {
  const [stats, setStats] = useState<UserStats>(DEFAULT_USER_STATS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load stats on mount
  useEffect(() => {
    let isMounted = true;
    storageService.loadStats().then((loaded) => {
      if (!isMounted) return;
      setStats(loaded);
      audioService.setEnabled(loaded.soundEnabled);
      hapticsService.setEnabled(loaded.hapticsEnabled);
      adService.setAdsRemoved(loaded.adsRemoved);
      setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleSound = useCallback(async () => {
    const next = !stats.soundEnabled;
    audioService.setEnabled(next);
    const updated = await storageService.saveStats({ soundEnabled: next });
    setStats(updated);
  }, [stats.soundEnabled]);

  const toggleHaptics = useCallback(async () => {
    const next = !stats.hapticsEnabled;
    hapticsService.setEnabled(next);
    const updated = await storageService.saveStats({ hapticsEnabled: next });
    setStats(updated);
  }, [stats.hapticsEnabled]);

  const resetStats = useCallback(async () => {
    const updated = await storageService.resetStats();
    setStats(updated);
  }, []);

  const refreshStats = useCallback(async () => {
    const loaded = await storageService.loadStats();
    setStats(loaded);
  }, []);

  return {
    stats,
    isLoading,
    toggleSound,
    toggleHaptics,
    resetStats,
    refreshStats,
  };
}
