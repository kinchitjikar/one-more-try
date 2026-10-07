import { useEffect, useState, useCallback } from 'react';
import { adService, canShowRewardedContinue } from '../services/ads';
import { analytics } from '../services/analytics';

export function useAds() {
  const [isRewardedReady, setIsRewardedReady] = useState<boolean>(false);
  const [isAdLoading, setIsAdLoading] = useState<boolean>(false);

  useEffect(() => {
    adService.initializeAds();
    setIsRewardedReady(adService.isRewardedAvailable());
  }, []);

  const triggerInterstitialOnGameOver = useCallback(async () => {
    adService.recordGameCompleted();
    const shown = await adService.showInterstitialIfEligible();
    if (shown) {
      analytics.logEvent('interstitial_shown');
    }
  }, []);

  const watchRewardedContinue = useCallback(async (
    hasContinuedInCurrentRun: boolean
  ): Promise<boolean> => {
    if (!canShowRewardedContinue(hasContinuedInCurrentRun)) {
      return false;
    }

    analytics.logEvent('rewarded_ad_requested');
    setIsAdLoading(true);

    try {
      const rewarded = await adService.showRewardedContinue();
      setIsAdLoading(false);

      if (rewarded) {
        analytics.logEvent('rewarded_ad_completed');
        return true;
      } else {
        analytics.logEvent('rewarded_ad_failed');
        return false;
      }
    } catch {
      setIsAdLoading(false);
      analytics.logEvent('rewarded_ad_failed');
      return false;
    }
  }, []);

  return {
    isRewardedReady,
    isAdLoading,
    triggerInterstitialOnGameOver,
    watchRewardedContinue,
  };
}
