export type AnalyticsEvent =
  | 'app_open'
  | 'game_started'
  | 'target_hit'
  | 'game_over'
  | 'retry_clicked'
  | 'high_score'
  | 'rewarded_ad_requested'
  | 'rewarded_ad_completed'
  | 'rewarded_ad_failed'
  | 'interstitial_shown'
  | 'settings_opened';

export interface AnalyticsPayload {
  [key: string]: string | number | boolean | undefined;
}

class AnalyticsService {
  private isEnabled: boolean = true;

  /**
   * Tracks an event locally without collecting PII or requiring accounts.
   */
  public logEvent(event: AnalyticsEvent, payload?: AnalyticsPayload): void {
    if (!this.isEnabled) return;

    if (__DEV__) {
      // Diagnostic logging in development
      // console.log(`[Analytics] ${event}`, payload ?? '');
    }

    // In production with a privacy-preserving provider (e.g. Telemetry),
    // dispatch here without ever transmitting personal identifiers.
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

export const analytics = new AnalyticsService();
