export const GAME_CONSTANTS = {
  // Target dimensions
  INITIAL_TARGET_SIZE: 96,
  MIN_TARGET_SIZE: 56, // Must be accessible (>=48dp standard)
  SIZE_DECAY_RATE: 1.8, // Size reduction per level

  // Timings (in milliseconds)
  INITIAL_LIFETIME_MS: 3000,
  MIN_LIFETIME_MS: 480, // Human reflex physiological lower bound for mobile touch
  LIFETIME_DECAY_EXPONENT: 0.88,

  // Spawning & Margins
  BOARD_PADDING: 16,
  TARGET_EDGE_MARGIN: 12,

  // Streak Milestones
  STREAK_MILESTONES: [5, 10, 20, 35, 50, 75, 100],

  // Scoring
  BASE_POINTS: 100,
  MAX_REACTION_BONUS: 200,
  LEVEL_MULTIPLIER: 10,
  STREAK_BONUS_MULTIPLIER: 15,

  // Difficulty tiers
  DECOY_START_LEVEL: 8,
  MAX_DECOYS: 2,
  MOVEMENT_START_LEVEL: 14,
  MAX_MOVEMENT_SPEED: 120, // px per second
};
