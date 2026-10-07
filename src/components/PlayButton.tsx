import React from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { COLORS } from '../constants/config';
import { hapticsService } from '../services/haptics';
import { audioService } from '../services/audio';

interface PlayButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary' | 'accent';
  disabled?: boolean;
}

export const PlayButton: React.FC<PlayButtonProps> = ({
  title,
  onPress,
  style,
  variant = 'primary',
  disabled = false,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
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
    if (disabled) return;
    hapticsService.triggerButtonPress();
    audioService.playButtonSound();
    onPress();
  };

  const isPrimary = variant === 'primary';
  const isAccent = variant === 'accent';

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        style={[
          styles.button,
          isPrimary && styles.primaryButton,
          isAccent && styles.accentButton,
          variant === 'secondary' && styles.secondaryButton,
          disabled && styles.disabledButton,
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled }}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          style={[
            styles.text,
            isPrimary && styles.primaryText,
            isAccent && styles.accentText,
            variant === 'secondary' && styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primaryGlow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  accentButton: {
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accentGlow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: COLORS.surfaceBorder,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceHighlight,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  primaryText: {
    color: '#070C16',
  },
  accentText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: COLORS.textPrimary,
  },
});
