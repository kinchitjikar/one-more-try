import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Pressable,
  Animated,
  View,
  GestureResponderEvent,
} from 'react-native';
import { TargetItem } from '../game/types';
import { COLORS } from '../constants/config';

interface TargetProps {
  target: TargetItem;
  onTap: (targetId: string) => void;
}

export const Target: React.FC<TargetProps> = React.memo(({ target, onTap }) => {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const ringScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance pop animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();

    // Shrinking lifetime indicator ring
    Animated.timing(ringScale, {
      toValue: 0.1,
      duration: target.lifetimeMs,
      useNativeDriver: true,
    }).start();
  }, [target.id, target.lifetimeMs, scaleAnim, ringScale]);

  const handlePress = (e: GestureResponderEvent) => {
    e.stopPropagation(); // Avoid triggering parent wrong-tap
    onTap(target.id);
  };

  const radius = target.size / 2;
  const left = target.x - radius;
  const top = target.y - radius;

  const isDecoy = target.isDecoy;
  const mainColor = isDecoy ? COLORS.accentSecondary : COLORS.accent;
  const glowColor = isDecoy ? 'rgba(251, 146, 60, 0.4)' : COLORS.accentGlow;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left,
          top,
          width: target.size,
          height: target.size,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Outer expiring timer ring */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            borderColor: mainColor,
            transform: [{ scale: ringScale }],
          },
        ]}
      />

      {/* Interactive Core */}
      <Pressable
        onPress={handlePress}
        style={[
          styles.core,
          {
            backgroundColor: mainColor,
            shadowColor: glowColor,
          },
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={isDecoy ? 'Decoy obstacle' : 'Reflex target'}
        accessibilityHint="Tap as quickly as possible before time runs out"
      >
        <View style={styles.innerDot} />
      </Pressable>
    </Animated.View>
  );
});

Target.displayName = 'Target';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    borderWidth: 2,
    opacity: 0.8,
  },
  core: {
    width: '82%',
    height: '82%',
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  innerDot: {
    width: '32%',
    height: '32%',
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    opacity: 0.95,
  },
});
