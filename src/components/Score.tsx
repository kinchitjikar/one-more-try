import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../constants/config';

interface ScoreProps {
  score: number;
  level: number;
  lastReactionMs?: number | null;
  lastPointsEarned?: number | null;
  onExit?: () => void;
}

export const Score: React.FC<ScoreProps> = React.memo(({
  score,
  level,
  lastReactionMs,
  lastPointsEarned,
  onExit,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.scoreRow}>
        <View style={styles.item}>
          <Text style={styles.label}>SCORE</Text>
          <Text style={styles.value} accessibilityLabel={`Current score: ${score}`}>
            {score.toLocaleString()}
          </Text>
        </View>

        <View style={styles.headerRightControls}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelLabel}>LVL</Text>
            <Text style={styles.levelValue}>{level}</Text>
          </View>

          {onExit && (
            <Pressable
              onPress={onExit}
              style={({ pressed }) => [
                styles.exitButton,
                pressed && styles.exitButtonPressed,
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Exit game to home"
              hitSlop={8}
            >
              <Text style={styles.exitIcon}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      {lastPointsEarned !== null && lastPointsEarned !== undefined && (
        <View style={styles.feedbackRow}>
          <Text style={styles.feedbackPoints}>+{lastPointsEarned}</Text>
          {lastReactionMs !== null && lastReactionMs !== undefined && (
            <Text style={styles.feedbackSpeed}>{lastReactionMs}ms</Text>
          )}
        </View>
      )}
    </View>
  );
});

Score.displayName = 'Score';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.textMuted,
  },
  value: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  headerRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  levelBadge: {
    backgroundColor: COLORS.surfaceBorder,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.surfaceHighlight,
  },
  levelLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  levelValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  exitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceBorder,
    borderWidth: 1,
    borderColor: COLORS.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonPressed: {
    opacity: 0.8,
    backgroundColor: COLORS.surfaceHighlight,
    transform: [{ scale: 0.92 }],
  },
  exitIcon: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '800',
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  feedbackPoints: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.success,
  },
  feedbackSpeed: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
