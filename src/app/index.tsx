import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, APP_CONFIG } from '../constants/config';
import { useSettings } from '../hooks/useSettings';
import { PlayButton } from '../components/PlayButton';
import { AdBanner } from '../components/AdBanner';
import { analytics } from '../services/analytics';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stats, refreshStats } = useSettings();

  useEffect(() => {
    analytics.logEvent('app_open');
    refreshStats();
  }, [refreshStats]);

  const handlePlay = () => {
    router.push('/game');
  };

  const handleGuide = () => {
    router.push('/guide');
  };

  const handleSettings = () => {
    analytics.logEvent('settings_opened');
    router.push('/settings');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        {/* Header / Brand */}
        <View style={styles.header}>
          <Text style={styles.titlePrefix}>REFLEX ARCADE</Text>
          <Text style={styles.title}>PULSETAP</Text>
          <Text style={styles.tagline}>One more try. Stay focused. Don't blink.</Text>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.primaryStat}>
            <Text style={styles.primaryStatLabel}>BEST SCORE</Text>
            <Text style={styles.primaryStatValue}>{stats.highScore.toLocaleString()}</Text>
          </View>

          <View style={styles.statsDivider} />

          <View style={styles.secondaryStatsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>BEST STREAK</Text>
              <Text style={styles.statValue}>{stats.bestStreak}x</Text>
            </View>

            <View style={styles.statCol}>
              <Text style={styles.statLabel}>MAX LEVEL</Text>
              <Text style={styles.statValue}>{stats.highestLevel}</Text>
            </View>

            <View style={styles.statCol}>
              <Text style={styles.statLabel}>PLAYED</Text>
              <Text style={styles.statValue}>{stats.gamesPlayed}</Text>
            </View>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.actions}>
          <PlayButton
            title="PLAY"
            onPress={handlePlay}
            variant="primary"
          />

          <PlayButton
            title="HOW TO PLAY"
            onPress={handleGuide}
            variant="secondary"
          />

          <PlayButton
            title="SETTINGS"
            onPress={handleSettings}
            variant="secondary"
          />
        </View>
      </View>

      {/* Bottom Banner Ad */}
      <AdBanner adsRemoved={stats.adsRemoved} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titlePrefix: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
    color: COLORS.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 2,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceBorder,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryStat: {
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryStatLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    color: COLORS.textMuted,
  },
  primaryStatValue: {
    fontSize: 44,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  statsDivider: {
    height: 1,
    backgroundColor: COLORS.surfaceBorder,
    marginVertical: 12,
  },
  secondaryStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 4,
  },
  statCol: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  actions: {
    gap: 14,
  },
  secondaryButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
