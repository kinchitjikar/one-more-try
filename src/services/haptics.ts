import * as Haptics from 'expo-haptics';

class HapticsService {
  private enabled: boolean = true;

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Subtle crisp impact for target hits
   */
  public triggerTargetHit(): void {
    if (!this.enabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics unavailable on device, safely ignored
    }
  }

  /**
   * Medium impact for streak milestones (e.g. 5, 10, 20 hits)
   */
  public triggerStreakMilestone(): void {
    if (!this.enabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Safely ignored
    }
  }

  /**
   * Notification error pattern on game over
   */
  public triggerGameOver(): void {
    if (!this.enabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      // Safely ignored
    }
  }

  /**
   * Success notification feedback pattern on setting a new High Score record
   */
  public triggerHighScoreSuccess(): void {
    if (!this.enabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Safely ignored
    }
  }

  /**
   * Light selection tap for UI buttons
   */
  public triggerButtonPress(): void {
    if (!this.enabled) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // Safely ignored
    }
  }
}

export const hapticsService = new HapticsService();
