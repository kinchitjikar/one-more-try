import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Animated,
} from "react-native";
import { COLORS } from "../constants/config";
import { hapticsService } from "../services/haptics";
import { audioService } from "../services/audio";

interface RewardedContinueProps {
  onContinue: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const RewardedContinue: React.FC<RewardedContinueProps> = ({
  onContinue,
  isLoading,
  disabled = false,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || isLoading) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (disabled || isLoading) return;
    hapticsService.triggerButtonPress();
    audioService.playButtonSound();
    onContinue();
  };

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        disabled && styles.disabledContainer,
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || isLoading}
        style={styles.button}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="One More Try: Watch ad to continue"
        accessibilityState={{ disabled: disabled || isLoading }}
      >
        <View style={styles.contentRow}>
          {/* Main Title - Single Line */}
          <Text style={styles.title} numberOfLines={1}>
            WATCH AD TO CONTINUE
          </Text>

          {/* Action Icon or Loading Spinner */}
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={COLORS.gold}
              style={styles.loader}
            />
          ) : (
            <View style={styles.playBadge}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(251, 191, 36, 0.12)",
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  disabledContainer: {
    opacity: 0.4,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  adBadge: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    position: "absolute",
    left: 0,
    // bottom: 0,
    top: 20,
    // right: 0,
  },
  adBadgeText: {
    color: "#0B0F19",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  title: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
  playBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    color: COLORS.gold,
    fontSize: 10,
    marginLeft: 2,
  },
  loader: {
    width: 24,
  },
});
