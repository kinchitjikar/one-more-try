import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/config';
import { PlayButton } from '../components/PlayButton';
import { hapticsService } from '../services/haptics';

export default function GuideScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    hapticsService.triggerButtonPress();
    router.back();
  };

  const handlePlayNow = () => {
    hapticsService.triggerButtonPress();
    router.push('/game');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top Navigation */}
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
        <Text style={styles.headerTitle}>HOW TO PLAY</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTag}>CORE OBJECTIVE</Text>
          <Text style={styles.heroTitle}>Tap fast. Stay focused. Don't blink.</Text>
          <Text style={styles.heroText}>
            A reflex target appears on the screen. You have 3 seconds (decreasing as you level up)
            to tap it. One mistake or missed countdown, and the run ends!
          </Text>
        </View>

        {/* Rule 1: The Target */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.targetPreview}>
              <View style={styles.targetRing} />
              <View style={styles.targetCore}>
                <View style={styles.targetDot} />
              </View>
            </View>
            <View style={styles.cardHeaderTitles}>
              <Text style={styles.stepNumber}>RULE 01</Text>
              <Text style={styles.cardTitle}>Tap The Active Target</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>
            Tap inside the circular target. The outer ring shrinks continuously, showing how much
            time remains. Tapping the dark empty area outside the target counts as a missed tap and
            ends the game!
          </Text>
        </View>

        {/* Rule 2: The Countdown Timer */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.timerPreview}>
              <Text style={styles.timerPreviewText}>3.0s</Text>
            </View>
            <View style={styles.cardHeaderTitles}>
              <Text style={styles.stepNumber}>RULE 02</Text>
              <Text style={styles.cardTitle}>3-Second Countdown Meter</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>
            A digital counter and depleting progress bar at the top show exactly how many seconds
            you have left before timeout. The bar turns Amber when halfway down, and emergency Crimson
            when under 30% time!
          </Text>
        </View>

        {/* Rule 3: Speed & Streak Bonus */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.scorePreview}>
              <Text style={styles.scorePreviewText}>+300</Text>
            </View>
            <View style={styles.cardHeaderTitles}>
              <Text style={styles.stepNumber}>RULE 03</Text>
              <Text style={styles.cardTitle}>Earn Reaction Bonuses</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>
            Every tap gives 100 base points. The quicker your reflexes (tapping within milliseconds),
            the higher your Speed Bonus (up to +200 extra points). Hitting consecutive targets builds
            your Streak Multiplier for massive high scores!
          </Text>
        </View>

        {/* Rule 4: Hazards & Decoys */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.decoyPreview}>
              <Text style={styles.decoyIcon}>⚠️</Text>
            </View>
            <View style={styles.cardHeaderTitles}>
              <Text style={styles.stepNumber}>RULE 04</Text>
              <Text style={styles.cardTitle}>Beware of Decoys & Movement</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>
            Starting at Level 8, orange decoy obstacles appear alongside the real target.
            Never tap a decoy! Starting at Level 14, targets begin drifting across the playfield,
            demanding sharper hand-eye coordination.
          </Text>
        </View>

        {/* Rule 5: Continue with One More Try */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.continuePreview}>
              <Text style={styles.continueText}>1UP</Text>
            </View>
            <View style={styles.cardHeaderTitles}>
              <Text style={styles.stepNumber}>RULE 05</Text>
              <Text style={styles.cardTitle}>"One More Try" Revive</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>
            Made a slip-up? Choose "ONE MORE TRY" on the Game Over screen to watch a quick rewarded
            ad and resume right where you left off with your current score and level preserved!
          </Text>
        </View>

        {/* Play Action */}
        <View style={styles.bottomAction}>
          <PlayButton
            title="READY? PLAY NOW"
            onPress={handlePlayNow}
            variant="primary"
          />
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
    fontSize: 15,
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
    gap: 16,
  },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    borderColor: COLORS.primaryGlow,
  },
  heroTag: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    color: COLORS.primary,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  heroText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceBorder,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  cardHeaderTitles: {
    flex: 1,
  },
  stepNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  targetPreview: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  targetRing: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: COLORS.accent,
    opacity: 0.6,
  },
  targetCore: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  timerPreview: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.surfaceBorder,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  timerPreviewText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.primary,
  },
  scorePreview: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.success,
  },
  scorePreviewText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.success,
  },
  decoyPreview: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(251, 146, 60, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.accentSecondary,
  },
  decoyIcon: {
    fontSize: 18,
  },
  continuePreview: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
  },
  continueText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.gold,
  },
  bottomAction: {
    marginTop: 8,
    marginBottom: 20,
  },
});
