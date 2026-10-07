// Google Mobile Ads Configuration
export const ADS_CONFIG = {
  BANNER_ID: 'ca-app-pub-8540104953749120/7729253067',
  INTERSTITIAL_ID: 'ca-app-pub-8540104953749120/3382813944',
  REWARDED_ID: 'ca-app-pub-8540104953749120/9354074350',

  // Frequency Capping Rules
  INTERSTITIAL_MIN_GAMES_BEFORE_FIRST: 3, // Never show immediately
  INTERSTITIAL_FREQUENCY_GAMES: 3, // Show every 3rd game over thereafter
  INTERSTITIAL_COOLDOWN_SECONDS: 60, // Minimum time between interstitials

  // Rewarded Continue
  REWARDED_CONTINUE_LIVES: 1, // Grants 1 extra continue per run
  MAX_CONTINUES_PER_SESSION: 2, // Limit continues to maintain arcade stakes
};
