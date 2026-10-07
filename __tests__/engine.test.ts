import {
  startGame,
  handleTargetHit,
  handleWrongTap,
  handleTimeout,
  resumeGameAfterContinue,
  resetGame,
} from '../src/game/engine';
import { BoardDimensions } from '../src/game/types';

describe('Game Engine Module', () => {
  const mockBoard: BoardDimensions = { width: 360, height: 640 };
  const mockTime = 1000000;

  it('starts game in PLAYING status with initial state and generated target', () => {
    const state = startGame(mockBoard, mockTime);
    expect(state.status).toBe('PLAYING');
    expect(state.score).toBe(0);
    expect(state.level).toBe(1);
    expect(state.streak).toBe(0);
    expect(state.targets.length).toBeGreaterThan(0);
    expect(state.hasContinued).toBe(false);
  });

  it('handles target hit: increases score, streak, level and spawns next target', () => {
    const initial = startGame(mockBoard, mockTime);
    const target = initial.targets.find((t) => !t.isDecoy)!;

    const hitTime = mockTime + 200; // tapped after 200ms
    const { nextState, breakdown, milestoneReached } = handleTargetHit(
      initial,
      target.id,
      hitTime,
      mockBoard
    );

    expect(nextState.status).toBe('PLAYING');
    expect(nextState.score).toBeGreaterThan(0);
    expect(nextState.streak).toBe(1);
    expect(nextState.level).toBe(2);
    expect(nextState.targets.length).toBeGreaterThan(0);
    expect(nextState.lastHitReactionTime).toBe(200);
    expect(breakdown.totalEarned).toBe(nextState.score);
    expect(milestoneReached).toBe(false);
  });

  it('triggers milestone when hitting streak milestone', () => {
    let state = startGame(mockBoard, mockTime);

    // Hit 5 targets consecutively
    let milestoneDetected = false;
    for (let i = 0; i < 5; i++) {
      const activeTarget = state.targets.find((t) => !t.isDecoy)!;
      const result = handleTargetHit(state, activeTarget.id, mockTime + (i + 1) * 100, mockBoard);
      state = result.nextState;
      if (result.milestoneReached) {
        milestoneDetected = true;
      }
    }

    expect(state.streak).toBe(5);
    expect(milestoneDetected).toBe(true);
  });

  it('ends game on wrong tap', () => {
    const playing = startGame(mockBoard, mockTime);
    const gameOverState = handleWrongTap(playing, mockTime + 500);

    expect(gameOverState.status).toBe('GAME_OVER');
    expect(gameOverState.gameOverReason).toBe('WRONG_TAP');
    expect(gameOverState.targets.length).toBe(0);
  });

  it('ends game on timeout', () => {
    const playing = startGame(mockBoard, mockTime);
    const gameOverState = handleTimeout(playing, mockTime + 2000);

    expect(gameOverState.status).toBe('GAME_OVER');
    expect(gameOverState.gameOverReason).toBe('TIMEOUT');
    expect(gameOverState.targets.length).toBe(0);
  });

  it('resumes game after rewarded ad continue with preserved score and level', () => {
    const playing = startGame(mockBoard, mockTime);
    const target = playing.targets.find((t) => !t.isDecoy)!;
    const { nextState } = handleTargetHit(playing, target.id, mockTime + 200, mockBoard);

    const gameOver = handleTimeout(nextState, mockTime + 1000);
    expect(gameOver.status).toBe('GAME_OVER');
    expect(gameOver.score).toBeGreaterThan(0);
    expect(gameOver.level).toBe(2);

    // Continue via rewarded ad
    const continued = resumeGameAfterContinue(gameOver, mockBoard, mockTime + 1500);
    expect(continued.status).toBe('PLAYING');
    expect(continued.score).toBe(gameOver.score);
    expect(continued.level).toBe(2);
    expect(continued.hasContinued).toBe(true);
    expect(continued.streak).toBe(0); // Reset streak for continue
    expect(continued.targets.length).toBeGreaterThan(0);

    // Should not allow multiple continues on the same run
    const doubleContinue = resumeGameAfterContinue(continued, mockBoard, mockTime + 2000);
    expect(doubleContinue).toEqual(continued);
  });

  it('resets game to initial idle state', () => {
    const reset = resetGame();
    expect(reset.status).toBe('IDLE');
    expect(reset.score).toBe(0);
    expect(reset.level).toBe(1);
    expect(reset.targets.length).toBe(0);
  });
});
