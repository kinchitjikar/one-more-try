import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/config';
import { useGame } from '../hooks/useGame';
import { useSettings } from '../hooks/useSettings';
import { Score } from '../components/Score';
import { Streak } from '../components/Streak';
import { CountdownTimer } from '../components/CountdownTimer';
import { GameBoard } from '../components/GameBoard';
import { GameOverCard } from '../components/GameOverCard';
import { canShowRewardedContinue } from '../services/ads';

export default function GameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stats } = useSettings();
  const {
    gameState,
    isNewHighScore,
    isAdLoading,
    start,
    onTargetTap,
    onWrongTap,
    continueWithReward,
    updateBoardDimensions,
  } = useGame();

  // Start gameplay immediately on mount
  useEffect(() => {
    start();
  }, [start]);

  const isGameOver = gameState.status === 'GAME_OVER';
  const canContinue = canShowRewardedContinue(gameState.hasContinued);
  const primaryTarget = gameState.targets.find((t) => !t.isDecoy) ?? null;

  const handlePlayAgain = () => {
    start();
  };

  const handleExit = () => {
    router.replace('/');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top HUD */}
      <View style={styles.hudHeader}>
        <Score
          score={gameState.score}
          level={gameState.level}
          lastReactionMs={gameState.lastHitReactionTime}
          lastPointsEarned={gameState.lastPointsEarned}
          onExit={handleExit}
        />
      </View>

      {/* Real-time Countdown Timer (Seconds remaining + Depleting Bar) */}
      <CountdownTimer
        targetId={primaryTarget?.id ?? null}
        lifetimeMs={primaryTarget?.lifetimeMs ?? 0}
        createdAt={primaryTarget?.createdAt ?? 0}
        isActive={gameState.status === 'PLAYING'}
      />

      {/* Streak Badge */}
      <Streak streak={gameState.streak} />

      {/* Interactive Reflex Board */}
      <GameBoard
        targets={gameState.targets}
        onTargetTap={onTargetTap}
        onWrongTap={onWrongTap}
        onLayoutDimensions={updateBoardDimensions}
      />

      {/* Game Over Card Modal */}
      {isGameOver && (
        <GameOverCard
          score={gameState.score}
          highScore={Math.max(stats.highScore, gameState.score)}
          streak={gameState.bestStreak}
          level={gameState.level}
          reason={gameState.gameOverReason}
          isNewHighScore={isNewHighScore}
          canContinue={canContinue}
          isAdLoading={isAdLoading}
          onPlayAgain={handlePlayAgain}
          onContinue={continueWithReward}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
  },
  hudHeader: {
    paddingTop: 4,
  },
});
