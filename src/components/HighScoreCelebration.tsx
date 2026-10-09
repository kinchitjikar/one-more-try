import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { COLORS } from '../constants/config';
import { hapticsService } from '../services/haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PARTICLE_COLORS = [
  '#FBBF24', // Gold
  '#F59E0B', // Amber
  '#38BDF8', // Neon Sky Blue
  '#C084FC', // Purple Glow
  '#F472B6', // Pink Star
  '#34D399', // Emerald
  '#FACC15', // Vivid Yellow
];

const PARTICLE_SHAPES = ['★', '✦', '▲', '■', '●', '✦'];

interface ParticleData {
  id: number;
  anim: Animated.Value;
  startX: number;
  targetX: number;
  targetY: number;
  targetRotation: number;
  color: string;
  shape: string;
  size: number;
  delay: number;
}

export const HighScoreCelebration: React.FC = () => {
  // Screen Flash animation
  const flashAnim = useRef(new Animated.Value(0.6)).current;

  // Trophy Bounce & Pulsing Glow animations
  const trophyScale = useRef(new Animated.Value(0)).current;
  const trophyRotate = useRef(new Animated.Value(0)).current;
  const auraScale = useRef(new Animated.Value(0.8)).current;
  const auraOpacity = useRef(new Animated.Value(0.7)).current;

  // Badge Pulse & Shimmer
  const badgeScale = useRef(new Animated.Value(0.7)).current;
  const badgeGlow = useRef(new Animated.Value(0.3)).current;

  // Confetti particles list
  const particlesRef = useRef<ParticleData[]>([]);

  if (particlesRef.current.length === 0) {
    const count = 45;
    const items: ParticleData[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = 140 + Math.random() * 220;
      const startX = (Math.random() - 0.5) * 40;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance + (Math.random() * 80); // gravity drop

      items.push({
        id: i,
        anim: new Animated.Value(0),
        startX,
        targetX,
        targetY,
        targetRotation: (Math.random() - 0.5) * 1080,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        shape: PARTICLE_SHAPES[Math.floor(Math.random() * PARTICLE_SHAPES.length)],
        size: 10 + Math.random() * 14,
        delay: Math.random() * 250,
      });
    }
    particlesRef.current = items;
  }

  useEffect(() => {
    // Trigger special Haptics pattern for High Score
    hapticsService.triggerHighScoreSuccess();

    // 1. Initial screen flash
    Animated.timing(flashAnim, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // 2. Trophy Bounce with spring physics
    Animated.sequence([
      Animated.spring(trophyScale, {
        toValue: 1.25,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.spring(trophyScale, {
        toValue: 1.0,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle continuous wobble on trophy
    Animated.loop(
      Animated.sequence([
        Animated.timing(trophyRotate, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(trophyRotate, {
          toValue: -1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Aura pulsing loop
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(auraScale, {
            toValue: 1.35,
            duration: 1500,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(auraScale, {
            toValue: 0.9,
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(auraOpacity, {
            toValue: 0.3,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(auraOpacity, {
            toValue: 0.8,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // 4. Badge Bounce & Glowing pulse
    Animated.spring(badgeScale, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(badgeGlow, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(badgeGlow, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 5. Fire Particle Animations
    const particleAnimations = particlesRef.current.map((p) => {
      p.anim.setValue(0);
      return Animated.sequence([
        Animated.delay(p.delay),
        Animated.timing(p.anim, {
          toValue: 1,
          duration: 1600 + Math.random() * 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(particleAnimations).start();
  }, [auraOpacity, auraScale, badgeGlow, badgeScale, flashAnim, trophyRotate, trophyScale]);

  const spinInterpolate = trophyRotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-8deg', '8deg'],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Screen Gold Flash Overlay */}
      <Animated.View
        style={[
          styles.flashOverlay,
          {
            opacity: flashAnim,
          },
        ]}
      />

      {/* Center Aura & Trophy Celebration Header */}
      <View style={styles.celebrationCenter}>
        {/* Radial Pulsing Aura Glow Rings */}
        <Animated.View
          style={[
            styles.auraRing,
            {
              transform: [{ scale: auraScale }],
              opacity: auraOpacity,
            },
          ]}
        />

        {/* Bouncing Glowing Trophy Icon */}
        <Animated.View
          style={[
            styles.trophyContainer,
            {
              transform: [{ scale: trophyScale }, { rotate: spinInterpolate }],
            },
          ]}
        >
          <Text style={styles.trophyEmoji}>🏆</Text>
        </Animated.View>
      </View>

      {/* Floating Particles Engine */}
      <View style={styles.particleContainer}>
        {particlesRef.current.map((p) => {
          const translateX = p.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [p.startX, p.targetX],
          });

          const translateY = p.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, p.targetY],
          });

          const rotate = p.anim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', `${p.targetRotation}deg`],
          });

          const scale = p.anim.interpolate({
            inputRange: [0, 0.2, 0.8, 1],
            outputRange: [0, 1.3, 1.0, 0],
          });

          const opacity = p.anim.interpolate({
            inputRange: [0, 0.1, 0.7, 1],
            outputRange: [0, 1, 0.9, 0],
          });

          return (
            <Animated.View
              key={p.id}
              style={[
                styles.particle,
                {
                  transform: [{ translateX }, { translateY }, { rotate }, { scale }],
                  opacity,
                },
              ]}
            >
              <Text style={{ fontSize: p.size, color: p.color, fontWeight: '900' }}>
                {p.shape}
              </Text>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(251, 191, 36, 0.35)',
    zIndex: 999,
  },
  celebrationCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  auraRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(251, 191, 36, 0.25)',
    borderWidth: 2,
    borderColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
  },
  trophyContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(251, 191, 36, 0.18)',
    borderWidth: 2,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 8,
  },
  trophyEmoji: {
    fontSize: 44,
  },
  particleContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.35,
    left: SCREEN_WIDTH * 0.5,
    width: 1,
    height: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
  },
});
