import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/config';
import { PlayButton } from './PlayButton';
import { RewardedContinue } from './RewardedContinue';
import { GameOverReason } from '../game/types';

interface GameOverCardProps {
  score: number;
  highScore: number;
  streak: number;
  level: number;
  reason: GameOverReason | null;
  isNewHighScore: boolean;
  canContinue: boolean;
  isAdLoading: boolean;
  onPlayAgain: () => void;
  onContinue: () => void;
}

export const GameOverCard: React.FC<GameOverCardProps> = ({
  score,
  highScore,
  streak,
  level,
  reason,
  isNewHighScore,
  canContinue,
  isAdLoading,
  onPlayAgain,
  onContinue,
}) => {
  const reasonText = reason === 'TIMEOUT' ? 'TIME EXPIRED' : 'MISSED TAP';

  // 2-second delay for Play Again button when Rewarded Ad Continue option is available
  const [isPlayAgainReady, setIsPlayAgainReady] = useState(!canContinue);
  const fadeAnim = useRef(new Animated.Value(canContinue ? 0.4 : 1)).current;

  useEffect(() => {
    if (canContinue) {
      setIsPlayAgainReady(false);
      fadeAnim.setValue(0.4);
      const timer = setTimeout(() => {
        setIsPlayAgainReady(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setIsPlayAgainReady(true);
      fadeAnim.setValue(1);
    }
  }, [canContinue, fadeAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>GAME OVER</Text>
        <Text style={styles.reasonText}>{reasonText}</Text>

        {isNewHighScore && (
          <View style={styles.newBestBadge}>
            <Text style={styles.newBestText}>★ NEW BEST SCORE ★</Text>
          </View>
        )}

        {/* Primary Score Summary */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>FINAL SCORE</Text>
          <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>BEST</Text>
            <Text style={styles.statValue}>{highScore.toLocaleString()}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>LEVEL</Text>
            <Text style={styles.statValue}>{level}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>STREAK</Text>
            <Text style={styles.statValue}>{streak}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {canContinue && (
            <RewardedContinue
              onContinue={onContinue}
              isLoading={isAdLoading}
            />
          )}

          <Animated.View style={{ width: '100%', opacity: fadeAnim }}>
            <PlayButton
              title="PLAY AGAIN"
              onPress={onPlayAgain}
              variant="primary"
              disabled={!isPlayAgainReady}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 15, 25, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 100,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 28,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceBorder,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 2.5,
    color: COLORS.accent,
  },
  reasonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 16,
  },
  newBestBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    borderColor: COLORS.gold,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  newBestText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.textSecondary,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.textMuted,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
});
