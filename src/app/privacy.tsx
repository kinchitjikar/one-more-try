import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, APP_CONFIG } from "../constants/config";
import { hapticsService } from "../services/haptics";

export default function PrivacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    hapticsService.triggerButtonPress();
    router.back();
  };

  const handleOpenWebPolicy = async () => {
    hapticsService.triggerButtonPress();
    try {
      await Linking.openURL(APP_CONFIG.privacyPolicyUrl);
    } catch (error) {
      console.warn("Failed to open privacy policy URL:", error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
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
        <Text style={styles.headerTitle}>PRIVACY POLICY</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Web Action Banner */}
        <Pressable
          onPress={handleOpenWebPolicy}
          style={styles.webBanner}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Open Official Privacy Policy Document in Web Browser"
        >
          <View style={styles.webBannerContent}>
            <Text style={styles.webBannerBadge}>OFFICIAL DOCUMENT</Text>
            <Text style={styles.webBannerTitle}>Open in Web Browser ↗</Text>
            <Text style={styles.webBannerUrl} numberOfLines={1}>
              {APP_CONFIG.privacyPolicyUrl}
            </Text>
          </View>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.paragraphTitle}>
            1. Offline-First Architecture
          </Text>
          <Text style={styles.paragraph}>
            "{APP_CONFIG.appName}" is designed from the ground up to respect
            player privacy. The game functions completely offline. Your high
            scores, levels, streaks, and preferences are stored strictly on your
            local device and are never sent to external servers or user
            databases.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.paragraphTitle}>
            2. No User Accounts or Personal Data
          </Text>
          <Text style={styles.paragraph}>
            We do not require account creation, email addresses, passwords,
            phone numbers, or contact lists. We never collect or transmit
            personally identifiable information (PII).
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.paragraphTitle}>4. Contact & Inquiries</Text>
          <Text style={styles.paragraph}>
            For questions or feedback regarding this policy or the application,
            you can reach out to{" "}
            <Text style={styles.linkText}>{APP_CONFIG.feedbackEmail}</Text>.
          </Text>
        </View>

        {/* Bottom Web Button */}
        <Pressable
          onPress={handleOpenWebPolicy}
          style={styles.bottomButton}
          accessible={true}
          accessibilityRole="button"
        >
          <Text style={styles.bottomButtonText}>OPEN IN GOOGLE DOCS ↗</Text>
        </Pressable>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  backButtonText: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "800",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "900",
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
  webBanner: {
    backgroundColor: COLORS.surfaceHighlight,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  webBannerContent: {
    gap: 4,
  },
  webBannerBadge: {
    fontSize: 10,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  webBannerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
  webBannerUrl: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceBorder,
  },
  paragraphTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  bottomButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceBorder,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  bottomButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
});
