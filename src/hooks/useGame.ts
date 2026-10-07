import { useState, useRef, useEffect, useCallback } from 'react';
import {
  createInitialGameState,
  startGame as engineStartGame,
  handleTargetHit as engineTargetHit,
  handleWrongTap as engineWrongTap,
  handleTimeout as engineTimeout,
  resumeGameAfterContinue as engineResumeGame,
  resetGame as engineResetGame,
} from '../game/engine';
import { BoardDimensions, GameState } from '../game/types';
import { storageService } from '../services/storage';
import { hapticsService } from '../services/haptics';
import { audioService } from '../services/audio';
import { analytics } from '../services/analytics';
import { useAds } from './useAds';

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [boardDimensions, setBoardDimensions] = useState<BoardDimensions>({
    width: 360,
    height: 600,
  });
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  const timeoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef<GameState>(gameState);
  stateRef.current = gameState;

  const boardRef = useRef<BoardDimensions>(boardDimensions);
  boardRef.current = boardDimensions;

  const { triggerInterstitialOnGameOver, watchRewardedContinue, isAdLoading } = useAds();

  // Clear timer safely
  const clearTargetTimer = useCallback(() => {
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }
  }, []);

  // Cleanup timers unconditionally on unmount
  useEffect(() => {
    return () => {
      clearTargetTimer();
    };
  }, [clearTargetTimer]);

  // Handle Game Over Side Effects (Storage, Haptics, Audio, Analytics, Ads)
  const processGameOver = useCallback(
    async (finalState: GameState) => {
      clearTargetTimer();
      hapticsService.triggerGameOver();
      audioService.playGameOverSound();
      analytics.logEvent('game_over', {
        score: finalState.score,
        level: finalState.level,
        streak: finalState.streak,
        reason: finalState.gameOverReason ?? 'unknown',
      });

      const { isNewHighScore: highScoreBeaten } = await storageService.recordGameResult(
        finalState.score,
        finalState.level,
        finalState.bestStreak
      );

      if (highScoreBeaten) {
        setIsNewHighScore(true);
        analytics.logEvent('high_score', { score: finalState.score });
      }

      await triggerInterstitialOnGameOver();
    },
    [clearTargetTimer, triggerInterstitialOnGameOver]
  );

  // Setup timeout timer for the current primary target
  const armTargetTimer = useCallback(
    (targetLifetimeMs: number) => {
      clearTargetTimer();
      timeoutTimerRef.current = setTimeout(() => {
        if (stateRef.current.status !== 'PLAYING') return;
        const next = engineTimeout(stateRef.current);
        setGameState(next);
        processGameOver(next);
      }, targetLifetimeMs);
    },
    [clearTargetTimer, processGameOver]
  );

  // Start new game
  const start = useCallback(() => {
    clearTargetTimer();
    setIsNewHighScore(false);
    analytics.logEvent('game_started');
    const newState = engineStartGame(boardRef.current);
    setGameState(newState);

    const primaryTarget = newState.targets.find((t) => !t.isDecoy);
    if (primaryTarget) {
      armTargetTimer(primaryTarget.lifetimeMs);
    }
  }, [clearTargetTimer, armTargetTimer]);

  // Handle tap on a target
  const onTargetTap = useCallback(
    (targetId: string) => {
      if (stateRef.current.status !== 'PLAYING') return;

      const now = Date.now();
      const result = engineTargetHit(stateRef.current, targetId, now, boardRef.current);

      if (result.nextState.status === 'GAME_OVER') {
        // Hit decoy or invalid
        setGameState(result.nextState);
        processGameOver(result.nextState);
        return;
      }

      // Successful hit
      setGameState(result.nextState);

      if (result.milestoneReached) {
        hapticsService.triggerStreakMilestone();
        audioService.playMilestoneSound();
      } else {
        hapticsService.triggerTargetHit();
        audioService.playHitSound();
      }

      analytics.logEvent('target_hit', {
        level: result.nextState.level,
        streak: result.nextState.streak,
        reactionTimeMs: result.nextState.lastHitReactionTime ?? 0,
      });

      // Arm timer for the newly spawned target
      const nextPrimary = result.nextState.targets.find((t) => !t.isDecoy);
      if (nextPrimary) {
        armTargetTimer(nextPrimary.lifetimeMs);
      }
    },
    [armTargetTimer, processGameOver]
  );

  // Handle wrong tap on empty board surface
  const onWrongTap = useCallback(() => {
    if (stateRef.current.status !== 'PLAYING') return;
    const next = engineWrongTap(stateRef.current);
    setGameState(next);
    processGameOver(next);
  }, [processGameOver]);

  // Rewarded Continue
  const continueWithReward = useCallback(async (): Promise<boolean> => {
    if (stateRef.current.status !== 'GAME_OVER' || stateRef.current.hasContinued) {
      return false;
    }

    const success = await watchRewardedContinue(stateRef.current.hasContinued);
    if (!success) return false;

    const resumed = engineResumeGame(stateRef.current, boardRef.current);
    setGameState(resumed);

    const primaryTarget = resumed.targets.find((t) => !t.isDecoy);
    if (primaryTarget) {
      armTargetTimer(primaryTarget.lifetimeMs);
    }
    return true;
  }, [watchRewardedContinue, armTargetTimer]);

  // Reset back to idle
  const reset = useCallback(() => {
    clearTargetTimer();
    setGameState(engineResetGame());
    setIsNewHighScore(false);
  }, [clearTargetTimer]);

  const updateBoardDimensions = useCallback((width: number, height: number) => {
    if (width > 0 && height > 0) {
      setBoardDimensions({ width, height });
    }
  }, []);

  return {
    gameState,
    boardDimensions,
    isNewHighScore,
    isAdLoading,
    start,
    onTargetTap,
    onWrongTap,
    continueWithReward,
    reset,
    updateBoardDimensions,
  };
}
