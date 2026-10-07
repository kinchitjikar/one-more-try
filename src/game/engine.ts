import { GAME_CONSTANTS } from '../constants/game';
import { generateTargetsForLevel } from './mechanics';
import { calculateHitScore, addScore } from './scoring';
import { BoardDimensions, GameOverReason, GameState, ScoreBreakdown } from './types';

/**
 * Creates a clean idle game state.
 */
export function createInitialGameState(): GameState {
  return {
    status: 'IDLE',
    score: 0,
    level: 1,
    streak: 0,
    bestStreak: 0,
    targets: [],
    hasContinued: false,
    lastHitReactionTime: null,
    lastPointsEarned: null,
    gameOverReason: null,
    startTime: null,
    endTime: null,
  };
}

/**
 * Starts a new game session.
 */
export function startGame(board: BoardDimensions, now: number = Date.now()): GameState {
  const targets = generateTargetsForLevel(1, board, now);
  return {
    status: 'PLAYING',
    score: 0,
    level: 1,
    streak: 0,
    bestStreak: 0,
    targets,
    hasContinued: false,
    lastHitReactionTime: null,
    lastPointsEarned: null,
    gameOverReason: null,
    startTime: now,
    endTime: null,
  };
}

export interface TargetHitResult {
  nextState: GameState;
  breakdown: ScoreBreakdown;
  milestoneReached: boolean;
}

/**
 * Processes a player tap on the active target.
 * Updates score, streak, level, and spawns the next target.
 */
export function handleTargetHit(
  state: GameState,
  targetId: string,
  tapTime: number,
  board: BoardDimensions
): TargetHitResult {
  if (state.status !== 'PLAYING') {
    return {
      nextState: state,
      breakdown: { basePoints: 0, reactionBonus: 0, streakBonus: 0, levelBonus: 0, totalEarned: 0 },
      milestoneReached: false,
    };
  }

  const hitTarget = state.targets.find((t) => t.id === targetId);

  // If hit a decoy or nonexistent target, treat as wrong tap
  if (!hitTarget || hitTarget.isDecoy) {
    const wrongState = endGame(state, 'WRONG_TAP', tapTime);
    return {
      nextState: wrongState,
      breakdown: { basePoints: 0, reactionBonus: 0, streakBonus: 0, levelBonus: 0, totalEarned: 0 },
      milestoneReached: false,
    };
  }

  // Calculate reaction time
  const reactionTimeMs = Math.max(0, tapTime - hitTarget.createdAt);

  // Calculate score breakdown
  const breakdown = calculateHitScore({
    reactionTimeMs,
    lifetimeMs: hitTarget.lifetimeMs,
    streak: state.streak,
    level: state.level,
  });

  const nextScore = addScore(state.score, breakdown.totalEarned);
  const nextStreak = state.streak + 1;
  const nextBestStreak = Math.max(state.bestStreak, nextStreak);
  const nextLevel = state.level + 1;

  // Check milestone
  const milestoneReached = GAME_CONSTANTS.STREAK_MILESTONES.includes(nextStreak);

  // Spawn next target for the next level
  const nextTargets = generateTargetsForLevel(nextLevel, board, tapTime);

  const nextState: GameState = {
    ...state,
    score: nextScore,
    level: nextLevel,
    streak: nextStreak,
    bestStreak: nextBestStreak,
    targets: nextTargets,
    lastHitReactionTime: reactionTimeMs,
    lastPointsEarned: breakdown.totalEarned,
  };

  return {
    nextState,
    breakdown,
    milestoneReached,
  };
}

/**
 * Handles wrong tap (tapped empty space or decoy).
 */
export function handleWrongTap(state: GameState, now: number = Date.now()): GameState {
  if (state.status !== 'PLAYING') return state;
  return endGame(state, 'WRONG_TAP', now);
}

/**
 * Handles target expiration (timeout).
 */
export function handleTimeout(state: GameState, now: number = Date.now()): GameState {
  if (state.status !== 'PLAYING') return state;
  return endGame(state, 'TIMEOUT', now);
}

/**
 * Ends the active game with the specified failure reason.
 */
export function endGame(
  state: GameState,
  reason: GameOverReason,
  now: number = Date.now()
): GameState {
  if (state.status !== 'PLAYING') return state;

  return {
    ...state,
    status: 'GAME_OVER',
    gameOverReason: reason,
    endTime: now,
    targets: [], // Clear active targets
  };
}

/**
 * Resumes game after watching a rewarded ad ("One More Try").
 * Restores score and level, resets streak to 0, grants fresh target.
 */
export function resumeGameAfterContinue(
  state: GameState,
  board: BoardDimensions,
  now: number = Date.now()
): GameState {
  if (state.status !== 'GAME_OVER' || state.hasContinued) {
    return state;
  }

  const targets = generateTargetsForLevel(state.level, board, now);

  // Grant a generous 3.0-second grace reaction window on continue
  // so the player is not penalized by high-level speed immediately after ad dismissal
  const graceTargets = targets.map((t) => ({
    ...t,
    lifetimeMs: Math.max(3000, t.lifetimeMs),
  }));

  return {
    ...state,
    status: 'PLAYING',
    hasContinued: true,
    gameOverReason: null,
    endTime: null,
    streak: 0, // Reset current streak on continue
    targets: graceTargets,
  };
}

/**
 * Resets back to idle state.
 */
export function resetGame(): GameState {
  return createInitialGameState();
}
