import { calculateDifficulty } from '../src/game/difficulty';
import { GAME_CONSTANTS } from '../src/constants/game';

describe('Difficulty Module', () => {
  it('returns initial parameters at Level 1', () => {
    const diff = calculateDifficulty(1);
    expect(diff.level).toBe(1);
    expect(diff.targetSize).toBe(GAME_CONSTANTS.INITIAL_TARGET_SIZE);
    expect(diff.lifetimeMs).toBe(GAME_CONSTANTS.INITIAL_LIFETIME_MS);
    expect(diff.decoyCount).toBe(0);
    expect(diff.movementSpeed).toBe(0);
  });

  it('progressively decreases lifetime and size with level progression', () => {
    const level1 = calculateDifficulty(1);
    const level5 = calculateDifficulty(5);
    const level10 = calculateDifficulty(10);
    const level20 = calculateDifficulty(20);

    expect(level5.lifetimeMs).toBeLessThan(level1.lifetimeMs);
    expect(level10.lifetimeMs).toBeLessThan(level5.lifetimeMs);
    expect(level20.lifetimeMs).toBeLessThan(level10.lifetimeMs);

    expect(level5.targetSize).toBeLessThan(level1.targetSize);
    expect(level10.targetSize).toBeLessThan(level5.targetSize);
    expect(level20.targetSize).toBeLessThanOrEqual(level10.targetSize);
  });

  it('strictly respects safe physiological minimum values even at level 1000', () => {
    const extreme = calculateDifficulty(1000);
    expect(extreme.targetSize).toBeGreaterThanOrEqual(GAME_CONSTANTS.MIN_TARGET_SIZE);
    expect(extreme.lifetimeMs).toBeGreaterThanOrEqual(GAME_CONSTANTS.MIN_LIFETIME_MS);
    expect(extreme.decoyCount).toBeLessThanOrEqual(GAME_CONSTANTS.MAX_DECOYS);
    expect(extreme.movementSpeed).toBeLessThanOrEqual(GAME_CONSTANTS.MAX_MOVEMENT_SPEED);
  });

  it('introduces decoys only at or above DECOY_START_LEVEL', () => {
    expect(calculateDifficulty(GAME_CONSTANTS.DECOY_START_LEVEL - 1).decoyCount).toBe(0);
    expect(calculateDifficulty(GAME_CONSTANTS.DECOY_START_LEVEL).decoyCount).toBeGreaterThanOrEqual(1);
  });

  it('handles negative or invalid levels safely', () => {
    const safeDiff = calculateDifficulty(-50);
    expect(safeDiff.level).toBe(1);
    expect(safeDiff.targetSize).toBe(GAME_CONSTANTS.INITIAL_TARGET_SIZE);
  });
});
