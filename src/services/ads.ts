import { ADS_CONFIG } from '../constants/ads';

export interface AdServiceState {
  isInitialized: boolean;
  interstitialLoaded: boolean;
  rewardedLoaded: boolean;
  lastInterstitialTime: number;
  sessionGamesCount: number;
  sessionContinuesCount: number;
  adsRemoved: boolean;
}

/**
 * Safely probes whether RNGoogleMobileAdsModule is registered in the native binary
 * without calling getEnforcing(), preventing TurboModule Invariant Violation crashes
 * in Expo Go and non-native environments.
 */
export function isAdMobNativeLinked(): boolean {
  try {
    const rn = typeof require !== 'undefined' ? require('react-native') : null;
    const os = rn?.Platform?.OS;
    if (os !== 'android' && os !== 'ios') return false;

    const turbo = rn?.TurboModuleRegistry ? rn.TurboModuleRegistry.get('RNGoogleMobileAdsModule') : null;
    if (turbo) return true;

    const classic = rn?.NativeModules ? rn.NativeModules.RNGoogleMobileAdsModule : null;
    if (classic) return true;

    return false;
  } catch {
    return false;
  }
}

/**
 * Pure deterministic rule: Checks whether an interstitial ad should be shown.
 */
export function shouldShowInterstitial(
  sessionGamesCount: number,
  lastInterstitialTime: number,
  adsRemoved: boolean,
  now: number = Date.now()
): boolean {
  if (adsRemoved) return false;
  if (sessionGamesCount < ADS_CONFIG.INTERSTITIAL_MIN_GAMES_BEFORE_FIRST) return false;

  const gamesSinceFirst = sessionGamesCount - ADS_CONFIG.INTERSTITIAL_MIN_GAMES_BEFORE_FIRST;
  if (gamesSinceFirst % ADS_CONFIG.INTERSTITIAL_FREQUENCY_GAMES !== 0) return false;

  const cooldownElapsedMs = now - lastInterstitialTime;
  const minCooldownMs = ADS_CONFIG.INTERSTITIAL_COOLDOWN_SECONDS * 1000;
  if (cooldownElapsedMs < minCooldownMs) return false;

  return true;
}

/**
 * Pure deterministic rule: Checks whether the player is eligible for a rewarded continue.
 */
export function canShowRewardedContinue(
  hasContinuedInCurrentRun: boolean,
  sessionContinuesCount: number = 0
): boolean {
  if (hasContinuedInCurrentRun) return false;
  if (sessionContinuesCount >= ADS_CONFIG.MAX_CONTINUES_PER_SESSION) return false;
  return true;
}

class AdService {
  private state: AdServiceState = {
    isInitialized: false,
    interstitialLoaded: false,
    rewardedLoaded: false,
    lastInterstitialTime: 0,
    sessionGamesCount: 0,
    sessionContinuesCount: 0,
    adsRemoved: false,
  };

  private interstitialAd: unknown = null;
  private rewardedAd: unknown = null;
  private nativeModuleAvailable: boolean = false;

  constructor() {
    this.nativeModuleAvailable = isAdMobNativeLinked();
  }

  /**
   * Initializes Google Mobile Ads SDK safely if native binary is present.
   */
  public async initializeAds(): Promise<void> {
    if (this.state.isInitialized) return;

    if (!this.nativeModuleAvailable) {
      console.log('[AdMob] Native module not detected (Expo Go / Web). Using mock ad mode.');
      this.state.isInitialized = true;
      return;
    }

    try {
      const mobileAds = require('react-native-google-mobile-ads').default;
      console.log('[AdMob] Initializing Google Mobile Ads SDK...');
      const adapterStatuses = await mobileAds().initialize();
      console.log('[AdMob] SDK Initialized successfully. Statuses:', JSON.stringify(adapterStatuses));
      this.state.isInitialized = true;
      this.loadInterstitial();
      this.loadRewarded();
    } catch (error) {
      console.warn('[AdMob] SDK initialization warning:', error);
      this.state.isInitialized = true;
    }
  }

  public setAdsRemoved(removed: boolean): void {
    this.state.adsRemoved = removed;
  }

  public recordGameCompleted(): void {
    this.state.sessionGamesCount += 1;
  }

  public getSessionGamesCount(): number {
    return this.state.sessionGamesCount;
  }

  /**
   * Preloads interstitial ad if native module exists
   */
  public loadInterstitial(): void {
    if (this.state.adsRemoved || !this.nativeModuleAvailable) return;

    try {
      const { InterstitialAd, AdEventType } = require('react-native-google-mobile-ads');
      console.log('[AdMob] Requesting Interstitial Ad (ID:', ADS_CONFIG.INTERSTITIAL_ID, ')...');
      const ad = InterstitialAd.createForAdRequest(ADS_CONFIG.INTERSTITIAL_ID);

      ad.addAdEventListener(AdEventType.LOADED, () => {
        console.log('[AdMob] ✅ Interstitial Ad LOADED and ready to display');
        this.state.interstitialLoaded = true;
      });

      ad.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('[AdMob] ℹ️ Interstitial Ad CLOSED. Preloading next one...');
        this.state.interstitialLoaded = false;
        this.loadInterstitial();
      });

      ad.addAdEventListener(AdEventType.ERROR, (error: unknown) => {
        console.warn('[AdMob] ❌ Interstitial Ad FAILED to load:', JSON.stringify(error));
        this.state.interstitialLoaded = false;
      });

      ad.load();
      this.interstitialAd = ad;
    } catch (e) {
      console.warn('[AdMob] Interstitial creation exception:', e);
      this.state.interstitialLoaded = false;
    }
  }

  /**
   * Preloads rewarded ad if native module exists
   */
  public loadRewarded(): void {
    if (!this.nativeModuleAvailable) return;

    try {
      const { RewardedAd, RewardedAdEventType, AdEventType } = require('react-native-google-mobile-ads');
      console.log('[AdMob] Requesting Rewarded Video Ad (ID:', ADS_CONFIG.REWARDED_ID, ')...');
      const ad = RewardedAd.createForAdRequest(ADS_CONFIG.REWARDED_ID);

      ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
        console.log('[AdMob] ✅ Rewarded Video Ad LOADED and ready for continue (+1 life)');
        this.state.rewardedLoaded = true;
      });

      ad.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('[AdMob] ℹ️ Rewarded Video CLOSED. Preloading next one...');
        this.state.rewardedLoaded = false;
        this.loadRewarded();
      });

      ad.addAdEventListener(AdEventType.ERROR, (error: unknown) => {
        console.warn('[AdMob] ❌ Rewarded Video FAILED to load:', JSON.stringify(error));
        this.state.rewardedLoaded = false;
      });

      ad.load();
      this.rewardedAd = ad;
    } catch (e) {
      console.warn('[AdMob] Rewarded creation exception:', e);
      this.state.rewardedLoaded = false;
    }
  }

  public isInterstitialAvailable(): boolean {
    if (this.state.adsRemoved) return false;
    return this.state.interstitialLoaded;
  }

  public async showInterstitialIfEligible(): Promise<boolean> {
    const eligible = shouldShowInterstitial(
      this.state.sessionGamesCount,
      this.state.lastInterstitialTime,
      this.state.adsRemoved
    );

    if (!eligible) return false;

    if (this.nativeModuleAvailable && this.interstitialAd && this.state.interstitialLoaded) {
      try {
        console.log('[AdMob] 🎬 Showing Interstitial Ad on screen...');
        const ad = this.interstitialAd as { show: () => Promise<void> };
        await ad.show();
        console.log('[AdMob] 🎬 Interstitial Ad displayed successfully');
        this.state.lastInterstitialTime = Date.now();
        this.state.interstitialLoaded = false;
        return true;
      } catch (err) {
        console.warn('[AdMob] ❌ Failed to show Interstitial Ad:', err);
        return false;
      }
    }
    return false;
  }

  public isRewardedAvailable(): boolean {
    return this.nativeModuleAvailable ? this.state.rewardedLoaded : true;
  }

  /**
   * Shows a rewarded ad. Returns true ONLY if reward was successfully earned.
   * If in mock/dev environment without native binary, simulates reward completion.
   */
  public async showRewardedContinue(): Promise<boolean> {
    if (!this.nativeModuleAvailable || !this.rewardedAd || !this.state.rewardedLoaded) {
      console.log('[AdMob] Mock / dev environment: simulating rewarded continue (+1 life)');
      await new Promise((resolve) => setTimeout(resolve, 600));
      this.state.sessionContinuesCount += 1;
      return true;
    }

    return new Promise((resolve) => {
      try {
        console.log('[AdMob] 🎬 Showing Rewarded Video Ad for continue (+1 life)...');
        const { RewardedAdEventType, AdEventType } = require('react-native-google-mobile-ads');
        const ad = this.rewardedAd as {
          show: () => Promise<void>;
          addAdEventListener: (type: string, listener: (arg?: unknown) => void) => () => void;
        };

        let rewardEarned = false;

        const unsubscribeEarned = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward: unknown) => {
          console.log('[AdMob] 🎁 REWARD EARNED by user:', JSON.stringify(reward));
          rewardEarned = true;
        });

        const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
          console.log('[AdMob] ℹ️ Rewarded Video closed. User earned reward:', rewardEarned);
          unsubscribeEarned();
          unsubscribeClosed();
          this.state.rewardedLoaded = false;
          this.loadRewarded();
          if (rewardEarned) {
            this.state.sessionContinuesCount += 1;
          }
          resolve(rewardEarned);
        });

        const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (error: unknown) => {
          console.warn('[AdMob] ❌ Rewarded Video playback error:', JSON.stringify(error));
          unsubscribeEarned();
          unsubscribeClosed();
          unsubscribeError();
          resolve(false);
        });

        ad.show().catch((err) => {
          console.warn('[AdMob] ❌ ad.show() rejected:', err);
          resolve(false);
        });
      } catch (err) {
        console.warn('[AdMob] ❌ showRewardedContinue exception:', err);
        resolve(false);
      }
    });
  }
}

export const adService = new AdService();
