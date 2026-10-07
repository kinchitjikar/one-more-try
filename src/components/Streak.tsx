import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/config';

interface StreakProps {
  streak: number;
}

export const Streak: React.FC<StreakProps> = React.memo(({ streak }) => {
  if (streak <= 1) return null;

  const isHot = streak >= 5;
  const isOnFire = streak >= 10;

  return (
    <View
      style={[
        styles.container,
        isHot && styles.hotContainer,
        isOnFire && styles.fireContainer,
      ]}
      accessibilityLabel={`Current streak: ${streak}`}
    >
      <Text style={[styles.multiplier, isOnFire && styles.fireText]}>
        {streak}x
      </Text>
      <Text style={[styles.label, isOnFire && styles.fireText]}>STREAK</Text>
    </View>
  );
});

Streak.displayName = 'Streak';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceBorder,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 8,
  },
  hotContainer: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  fireContainer: {
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    borderColor: COLORS.accent,
    borderWidth: 1.5,
  },
  multiplier: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primary,
  },
  fireText: {
    color: COLORS.gold,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.textSecondary,
  },
});
