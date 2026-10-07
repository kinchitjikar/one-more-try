import { Platform } from 'react-native';

const SOUND_ASSETS = {
  hit: require('../../assets/sounds/hit.wav'),
  milestone: require('../../assets/sounds/milestone.wav'),
  gameover: require('../../assets/sounds/gameover.wav'),
  button: require('../../assets/sounds/button.wav'),
};

type SoundType = keyof typeof SOUND_ASSETS;

interface MinimalPlayer {
  play: () => void;
  seekTo?: (seconds: number) => void;
}

class AudioService {
  private enabled: boolean = true;
  private expoAudioPlayers: Map<SoundType, MinimalPlayer> = new Map();
  private isExpoAudioSupported: boolean = false;

  constructor() {
    this.initAudio();
  }

  private async initAudio(): Promise<void> {
    try {
      const expoAudio = require('expo-audio');
      if (expoAudio && typeof expoAudio.createAudioPlayer === 'function') {
        // Configure global audio session
        if (typeof expoAudio.setAudioModeAsync === 'function') {
          await expoAudio.setAudioModeAsync({
            playsInSilentMode: true,
            shouldPlayInBackground: false,
          });
        }

        // Preload sound players for instant zero-latency playback
        for (const [key, asset] of Object.entries(SOUND_ASSETS)) {
          const player = expoAudio.createAudioPlayer(asset);
          this.expoAudioPlayers.set(key as SoundType, player);
        }
        this.isExpoAudioSupported = true;
      }
    } catch {
      this.isExpoAudioSupported = false;
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private playSound(type: SoundType): void {
    if (!this.enabled) return;

    // 1. Primary: Use Expo Audio (Official SDK 57 audio engine)
    if (this.isExpoAudioSupported) {
      const player = this.expoAudioPlayers.get(type);
      if (player) {
        try {
          if (typeof player.seekTo === 'function') {
            player.seekTo(0);
          }
          player.play();
          return;
        } catch {
          // Fall through
        }
      }
    }

    // 2. Secondary: Expo AV fallback
    try {
      const expoAv = require('expo-av');
      if (expoAv && expoAv.Audio && expoAv.Audio.Sound) {
        expoAv.Audio.Sound.createAsync(SOUND_ASSETS[type], { shouldPlay: true }).catch(() => {});
        return;
      }
    } catch {
      // Fall through
    }

    // 3. Web / Browser fallback
    if (typeof window !== 'undefined' && typeof window.Audio !== 'undefined') {
      try {
        const audio = new window.Audio(SOUND_ASSETS[type]);
        audio.play().catch(() => {});
      } catch {
        // Ignored
      }
    }
  }

  /**
   * Crisp high-frequency chime on target tap
   */
  public playHitSound(): void {
    this.playSound('hit');
  }

  /**
   * Rising harmony chime on streak milestones
   */
  public playMilestoneSound(): void {
    this.playSound('milestone');
  }

  /**
   * Descending tone on game over
   */
  public playGameOverSound(): void {
    this.playSound('gameover');
  }

  /**
   * Subtle click on button press
   */
  public playButtonSound(): void {
    this.playSound('button');
  }
}

export const audioService = new AudioService();
