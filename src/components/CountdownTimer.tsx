import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/config';

interface CountdownTimerProps {
  targetId: string | null;
  lifetimeMs: number;
  createdAt: number;
  isActive: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = React.memo(({
  targetId,
  lifetimeMs,
  createdAt,
  isActive,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(lifetimeMs / 1000);
  const barAnim = useRef(new Animated.Value(1)).current;
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive || !targetId || lifetimeMs <= 0) {
      setSecondsRemaining(0);
      barAnim.setValue(0);
      return;
    }

    // Reset progress bar to full and animate to empty
    barAnim.setValue(1);
    const animation = Animated.timing(barAnim, {
      toValue: 0,
      duration: lifetimeMs,
      useNativeDriver: false,
    });
    animation.start();

    // High-resolution ticker for numeric seconds display
    const updateCountdown = () => {
      const now = Date.now();
      const elapsed = now - createdAt;
      const remainingMs = Math.max(0, lifetimeMs - elapsed);
      const remainingSec = remainingMs / 1000;

      setSecondsRemaining(remainingSec);

      if (remainingMs > 0 && isActive) {
        rafRef.current = requestAnimationFrame(updateCountdown);
      }
    };

    rafRef.current = requestAnimationFrame(updateCountdown);

    return () => {
      animation.stop();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [targetId, lifetimeMs, createdAt, isActive, barAnim]);

  if (!isActive || !targetId) {
    return null;
  }

  const ratio = secondsRemaining / (lifetimeMs / 1000);
  const isCritical = ratio <= 0.3;
  const isWarning = ratio <= 0.6 && ratio > 0.3;

  const barColor = isCritical
    ? COLORS.accent
    : isWarning
    ? COLORS.warning
    : COLORS.primary;

  const widthInterpolation = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.label}>TIME LEFT</Text>
        <View style={styles.badge}>
          <Text
            style={[
              styles.counterText,
              isCritical && styles.criticalText,
              isWarning && styles.warningText,
            ]}
            accessibilityLabel={`${secondsRemaining.toFixed(1)} seconds left`}
          >
            {secondsRemaining.toFixed(1)}s
          </Text>
        </View>
      </View>

      {/* Depleting Progress Bar */}
      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: widthInterpolation,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
    </View>
  );
});

CountdownTimer.displayName = 'CountdownTimer';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: COLORS.textMuted,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
    fontVariant: ['tabular-nums'],
  },
  warningText: {
    color: COLORS.warning,
  },
  criticalText: {
    color: COLORS.accent,
  },
  barTrack: {
    height: 5,
    backgroundColor: COLORS.surfaceBorder,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});
