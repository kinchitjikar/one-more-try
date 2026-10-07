export type GameStatus = 'IDLE' | 'PLAYING' | 'GAME_OVER';

export type GameOverReason = 'TIMEOUT' | 'WRONG_TAP';

export interface TargetItem {
  id: string;
  x: number; // Center X
  y: number; // Center Y
  size: number; // Diameter in pixels
  isDecoy: boolean;
  createdAt: number;
  lifetimeMs: number;
  vx?: number; // Optional velocity X
  vy?: number; // Optional velocity Y
}

export interface DifficultyParams {
  level: number;
  targetSize: number;
  lifetimeMs: number;
  decoyCount: number;
  movementSpeed: number;
}

export interface ScoreBreakdown {
  basePoints: number;
  reactionBonus: number;
  streakBonus: number;
  levelBonus: number;
  totalEarned: number;
}

export interface GameState {
  status: GameStatus;
  score: number;
  level: number;
  streak: number;
  bestStreak: number;
  targets: TargetItem[];
  hasContinued: boolean;
  lastHitReactionTime: number | null;
  lastPointsEarned: number | null;
  gameOverReason: GameOverReason | null;
  startTime: number | null;
  endTime: number | null;
}

export interface UserStats {
  highScore: number;
  highestLevel: number;
  bestStreak: number;
  gamesPlayed: number;
  totalScore: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  adsRemoved: boolean;
}

export interface BoardDimensions {
  width: number;
  height: number;
}
