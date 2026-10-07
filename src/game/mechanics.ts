import { GAME_CONSTANTS } from '../constants/game';
import { randomFloat, generateId } from '../utils/random';
import { calculateDifficulty } from './difficulty';
import { BoardDimensions, TargetItem } from './types';

/**
 * Generates the primary active target and optional decoys safely placed inside the board bounds.
 */
export function generateTargetsForLevel(
  level: number,
  board: BoardDimensions,
  now: number = Date.now()
): TargetItem[] {
  const difficulty = calculateDifficulty(level);
  const targets: TargetItem[] = [];

  // Safe inner bounding box for target centers
  const radius = difficulty.targetSize / 2;
  const padding = GAME_CONSTANTS.BOARD_PADDING + radius + GAME_CONSTANTS.TARGET_EDGE_MARGIN;

  const minX = padding;
  const maxX = Math.max(minX, board.width - padding);
  const minY = padding;
  const maxY = Math.max(minY, board.height - padding);

  // 1. Primary Target
  const primaryX = randomFloat(minX, maxX);
  const primaryY = randomFloat(minY, maxY);

  // Movement velocity if difficulty has movement
  let vx: number | undefined;
  let vy: number | undefined;
  if (difficulty.movementSpeed > 0) {
    const angle = randomFloat(0, Math.PI * 2);
    vx = Math.cos(angle) * difficulty.movementSpeed;
    vy = Math.sin(angle) * difficulty.movementSpeed;
  }

  targets.push({
    id: generateId(),
    x: Math.round(primaryX),
    y: Math.round(primaryY),
    size: difficulty.targetSize,
    isDecoy: false,
    createdAt: now,
    lifetimeMs: difficulty.lifetimeMs,
    vx,
    vy,
  });

  // 2. Decoys (if any)
  // Ensure a strict minimum distance so decoys NEVER overlap the primary target or other decoys
  const minSeparation = difficulty.targetSize * 1.6 + 20;
  const minSeparationSq = minSeparation * minSeparation;

  for (let i = 0; i < difficulty.decoyCount; i++) {
    let decoyX = 0;
    let decoyY = 0;
    let foundSafeSpot = false;

    // Attempt up to 30 random positions with strict distance rejection
    for (let attempt = 0; attempt < 30; attempt++) {
      const candidateX = randomFloat(minX, maxX);
      const candidateY = randomFloat(minY, maxY);

      // Check distance to primary target
      const distToPrimarySq = (candidateX - primaryX) ** 2 + (candidateY - primaryY) ** 2;
      if (distToPrimarySq < minSeparationSq) {
        continue;
      }

      // Check distance to any already placed decoys
      const conflictsWithDecoy = targets.some((t) => {
        if (!t.isDecoy) return false;
        const dSq = (candidateX - t.x) ** 2 + (candidateY - t.y) ** 2;
        return dSq < minSeparationSq;
      });

      if (!conflictsWithDecoy) {
        decoyX = candidateX;
        decoyY = candidateY;
        foundSafeSpot = true;
        break;
      }
    }

    // Fallback: If screen is tight, place in the diagonally opposite quadrant
    if (!foundSafeSpot) {
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;
      decoyX = primaryX > midX ? minX + 20 : maxX - 20;
      decoyY = primaryY > midY ? minY + 20 : maxY - 20;
    }

    targets.push({
      id: generateId(),
      x: Math.round(decoyX),
      y: Math.round(decoyY),
      size: Math.round(difficulty.targetSize * 0.88), // Slightly distinct size
      isDecoy: true,
      createdAt: now,
      lifetimeMs: difficulty.lifetimeMs,
    });
  }

  return targets;
}

/**
 * Checks if a tap at (tapX, tapY) hits a given target using circular hit radius with touch margin.
 */
export function isTapOnTarget(
  tapX: number,
  tapY: number,
  target: TargetItem,
  touchMargin: number = 8
): boolean {
  const radius = target.size / 2 + touchMargin;
  const dx = tapX - target.x;
  const dy = tapY - target.y;
  return dx * dx + dy * dy <= radius * radius;
}
