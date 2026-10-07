import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, APP_CONFIG } from '../constants/config';
import { useSettings } from '../hooks/useSettings';
import { hapticsService } from '../services/haptics';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stats, toggleSound, toggleHaptics, resetStats } = useSettings();

  const handleBack = () => {
    hapticsService.triggerButtonPress();
    router.back();
  };

  const handleResetConfirmation = () => {
    hapticsService.triggerButtonPress();
    Alert.alert(
      'Reset Statistics',
      'Are you sure you want to reset your high score, streaks, and game history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: () => {
            resetStats();
            hapticsService.triggerGameOver();
          },
        },
      ]
    );
  };

  const handleGuide = () => {
    hapticsService.triggerButtonPress();
    router.push('/guide');
  };

  const handlePrivacy = async () => {
    hapticsService.triggerButtonPress();
    try {
      await Linking.openURL(APP_CONFIG.privacyPolicyUrl);
    } catch {
      router.push('/privacy');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Audio & Feedback Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>AUDIO & FEEDBACK</Text>

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Sound Effects</Text>
              <Text style={styles.rowSublabel}>Chimes on hits and game over</Text>
            </View>
            <Switch
              value={stats.soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: COLORS.surfaceBorder, true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Haptic Feedback</Text>
              <Text style={styles.rowSublabel}>Tactile vibrations on reflex actions</Text>
            </View>
            <Switch
              value={stats.hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ false: COLORS.surfaceBorder, true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Data & Reset Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>DATA MANAGEMENT</Text>

          <Pressable
            onPress={handleResetConfirmation}
            style={styles.actionRow}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Reset Statistics"
          >
            <Text style={styles.dangerLabel}>Reset Statistics</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>

        {/* Legal & About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ABOUT</Text>

          <Pressable
            onPress={handleGuide}
            style={styles.actionRow}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="How to Play"
          >
            <Text style={styles.rowLabel}>How to Play & Rules</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <View style={styles.rowDivider} />

          <Pressable
            onPress={handlePrivacy}
            style={styles.actionRow}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Privacy Policy"
          >
            <Text style={styles.rowLabel}>Privacy Policy</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <View style={styles.rowDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.rowLabel}>App Version</Text>
            <Text style={styles.infoValue}>v{APP_CONFIG.version} ({APP_CONFIG.buildNumber})</Text>
          </View>
        </View>

        {/* Footer Credit */}
        <View style={styles.footer}>
          <Text style={styles.appName}>{APP_CONFIG.appName}</Text>
          <Text style={styles.copyright}>Offline Reflex Arcade • Zero Accounts Required</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  backButtonText: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceBorder,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: COLORS.primary,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rowDivider: {
    height: 1,
    backgroundColor: COLORS.surfaceBorder,
    marginVertical: 14,
  },
  rowText: {
    flex: 1,
    marginRight: 16,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  rowSublabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  dangerLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.accent,
  },
  chevron: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  footer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  appName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  copyright: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
