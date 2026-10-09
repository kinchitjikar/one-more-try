import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS } from '../constants/config';
import { PlayButton } from './PlayButton';
import { RewardedContinue } from './RewardedContinue';
import { GameOverReason } from '../game/types';
import { HighScoreCelebration } from './HighScoreCelebration';

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

  // Animated Card Entrance
  const cardScale = useRef(new Animated.Value(0.85)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  // Score Ticker Animation
  const [displayScore, setDisplayScore] = useState<number>(isNewHighScore ? 0 : score);

  // New Best Badge Pulse
  const badgePulse = useRef(new Animated.Value(1)).current;
  const badgeGlowOpacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Card Entrance Spring Animation
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    // Score ticker animation for High Score
    if (isNewHighScore && score > 0) {
      let startTimestamp: number | null = null;
      const duration = 1200; // 1.2s count up
      let frameId: number;

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Easing out cubic for satisfying slowdown at end
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setDisplayScore(Math.floor(easedProgress * score));

        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        } else {
          setDisplayScore(score);
        }
      };

      frameId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(frameId);
    } else {
      setDisplayScore(score);
    }
  }, [cardOpacity, cardScale, isNewHighScore, score]);

  useEffect(() => {
    if (isNewHighScore) {
      // Continuous badge pulse & glowing aura loop
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(badgePulse, {
              toValue: 1.08,
              duration: 700,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(badgePulse, {
              toValue: 1.0,
              duration: 700,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(badgeGlowOpacity, {
              toValue: 1.0,
              duration: 700,
              useNativeDriver: true,
            }),
            Animated.timing(badgeGlowOpacity, {
              toValue: 0.4,
              duration: 700,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    }
  }, [badgeGlowOpacity, badgePulse, isNewHighScore]);

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
      {/* High Score Explosion & Particle Celebration Overlay */}
      {isNewHighScore && <HighScoreCelebration />}

      <Animated.View
        style={[
          styles.card,
          isNewHighScore && styles.cardHighScore,
          {
            transform: [{ scale: cardScale }],
            opacity: cardOpacity,
          },
        ]}
      >
        <Text style={[styles.title, isNewHighScore && styles.titleHighScore]}>
          {isNewHighScore ? 'NEW RECORD!' : 'GAME OVER'}
        </Text>
        <Text style={styles.reasonText}>{reasonText}</Text>

        {isNewHighScore && (
          <Animated.View
            style={[
              styles.newBestBadge,
              {
                transform: [{ scale: badgePulse }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.badgeGlow,
                {
                  opacity: badgeGlowOpacity,
                },
              ]}
            />
            <Text style={styles.newBestText}>★ NEW BEST SCORE ★</Text>
          </Animated.View>
        )}

        {/* Primary Score Summary */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>FINAL SCORE</Text>
          <Text style={[styles.scoreValue, isNewHighScore && styles.scoreValueHighScore]}>
            {displayScore.toLocaleString()}
          </Text>
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
      </Animated.View>
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
  cardHighScore: {
    borderColor: COLORS.gold,
    borderWidth: 2,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 2.5,
    color: COLORS.accent,
  },
  titleHighScore: {
    color: COLORS.gold,
    textShadowColor: 'rgba(251, 191, 36, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
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
    position: 'relative',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    borderColor: COLORS.gold,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
  },
  badgeGlow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.gold,
  },
  newBestText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
    zIndex: 2,
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
  scoreValueHighScore: {
    color: '#FACC15',
    textShadowColor: 'rgba(250, 204, 21, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
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
