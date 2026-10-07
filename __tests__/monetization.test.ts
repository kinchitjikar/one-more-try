import { shouldShowInterstitial, canShowRewardedContinue } from '../src/services/ads';
import { ADS_CONFIG } from '../src/constants/ads';

describe('Monetization Eligibility Logic', () => {
  const minCooldownMs = ADS_CONFIG.INTERSTITIAL_COOLDOWN_SECONDS * 1000;
  const now = 10000000;

  it('never shows interstitial if adsRemoved is true', () => {
    const result = shouldShowInterstitial(10, 0, true, now);
    expect(result).toBe(false);
  });

  it('does not show interstitial on early games (before min threshold)', () => {
    expect(shouldShowInterstitial(0, 0, false, now)).toBe(false);
    expect(shouldShowInterstitial(1, 0, false, now)).toBe(false);
    expect(shouldShowInterstitial(2, 0, false, now)).toBe(false);
  });

  it('shows interstitial on eligible game counts when cooldown has passed', () => {
    const minGames = ADS_CONFIG.INTERSTITIAL_MIN_GAMES_BEFORE_FIRST; // 3
    // Game 3: First eligible game
    expect(shouldShowInterstitial(minGames, now - (minCooldownMs + 1000), false, now)).toBe(true);

    // Game 4: Off frequency
    expect(shouldShowInterstitial(minGames + 1, now - (minCooldownMs + 1000), false, now)).toBe(false);

    // Game 6: Eligible on frequency (3 + 3)
    expect(shouldShowInterstitial(minGames + 3, now - (minCooldownMs + 1000), false, now)).toBe(true);
  });

  it('blocks interstitial if cooldown period has not elapsed', () => {
    const minGames = ADS_CONFIG.INTERSTITIAL_MIN_GAMES_BEFORE_FIRST;
    // Just showed an ad 10 seconds ago
    const lastShown = now - 10000;
    expect(shouldShowInterstitial(minGames, lastShown, false, now)).toBe(false);
  });

  it('allows rewarded continue if not already used in current run', () => {
    expect(canShowRewardedContinue(false, 0)).toBe(true);
    expect(canShowRewardedContinue(false, 1)).toBe(true);
  });

  it('disallows rewarded continue if already continued in current run or exceeded session limit', () => {
    expect(canShowRewardedContinue(true, 0)).toBe(false);
    expect(canShowRewardedContinue(false, ADS_CONFIG.MAX_CONTINUES_PER_SESSION)).toBe(false);
  });
});
