import React, { useState, useEffect, Component, ReactNode, ErrorInfo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ADS_CONFIG } from '../constants/ads';
import { COLORS } from '../constants/config';
import { adService, isAdMobNativeLinked } from '../services/ads';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class BannerErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Silently capture ad rendering errors so the game never crashes
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

interface AdBannerProps {
  adsRemoved?: boolean;
}

interface BannerAdPropsInternal {
  unitId: string;
  size: string;
  requestOptions?: {
    requestNonPersonalizedAdsOnly?: boolean;
  };
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error?: unknown) => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ adsRemoved = false }) => {
  const [adFailed, setAdFailed] = useState<boolean>(false);
  const [readyToMount, setReadyToMount] = useState<boolean>(false);

  useEffect(() => {
    // Delay mounting banner by 800ms to guarantee root layout and window are fully painted
    const timer = setTimeout(() => {
      setReadyToMount(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (adsRemoved || adFailed || !readyToMount || !isAdMobNativeLinked()) {
    return null;
  }

  let BannerAdComponent: React.ComponentType<BannerAdPropsInternal> | null = null;
  let BannerAdSize: Record<string, string> | null = null;

  try {
    const googleAds = require('react-native-google-mobile-ads');
    BannerAdComponent = googleAds.BannerAd;
    BannerAdSize = googleAds.BannerAdSize;
  } catch {
    return null;
  }

  if (!BannerAdComponent || !BannerAdSize) {
    return null;
  }

  return (
    <BannerErrorBoundary>
      <View style={styles.container}>
        <BannerAdComponent
          unitId={ADS_CONFIG.BANNER_ID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={() => {
            console.log('[AdMob] ✅ Banner Ad LOADED successfully on Home Screen');
          }}
          onAdFailedToLoad={(error: unknown) => {
            console.warn('[AdMob] ❌ Banner Ad FAILED to load:', JSON.stringify(error));
            setAdFailed(true);
          }}
        />
      </View>
    </BannerErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    minHeight: 50,
  },
});
