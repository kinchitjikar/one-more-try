# PulseTap: One More Try ⚡

> **Fast-paced neon reflex arcade game. Tap quick, avoid decoys, don't blink!**

[![Expo SDK](https://img.shields.io/badge/Expo-v57.0.0-blue.svg?logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-v0.86.3-61dafb.svg?logo=react&logoColor=white)](https://reactnative.dev/)
[![React](https://img.shields.io/badge/React-v19.2.3-61dafb.svg?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v6.0-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Jest Tests](https://img.shields.io/badge/Tests-26%20Passed-brightgreen.svg?logo=jest&logoColor=white)](https://jestjs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🎮 Overview

**PulseTap: One More Try** is an adrenaline-fueled, minimalist reflex arcade game built with **React Native** and **Expo SDK 57**. Engineered to challenge reaction speed, hand-eye coordination, and tactical focus under pressure, every millisecond counts.

The gameplay is elegantly simple yet brutally challenging:
1. **Pulsing Crimson Target**: Tap the glowing neon target before its lifetime expires.
2. **Dynamic Decay**: Targets shrink in size and countdowns accelerate as levels scale.
3. **Amber Decoys**: Avoid treacherous decoys that spawn at higher levels—one mis-tap ends the run!
4. **Moving Targets**: Higher levels introduce velocity vectors, requiring spatial prediction.
5. **Score & Streaks**: Earn instant reaction-speed bonuses (<300ms) and compound your score with uninterrupted streak multipliers.
6. **One More Try**: Zero-delay instant retry, or watch an optional rewarded continue to save a high-stakes run.

---

## 🌟 Key Features

- **⚡ Instant Arcade Gameplay**: Zero cutscenes, zero delays. Tap play and react immediately.
- **📈 Deterministic Adaptive Difficulty**:
  - Exponential timer decay down to physiological reflex lower bounds (~480ms).
  - Target scaling safely clamped to accessible touch targets (≥56px).
  - Decoy distraction patterns starting at level 8.
  - Target drift movement starting at level 14.
- **🎯 Precision Scoring Engine**:
  - Base hit score + speed reaction bonus (up to +200 pts) + streak bonus + level multipliers.
- **📳 Tactile Haptic Feedback**: Tailored vibration pulses for taps, near-misses, streak milestones, and game over via `expo-haptics`.
- **🔊 16-Bit Audio Soundscape**: Crisp, low-latency audio effects synchronized with actions via `expo-audio`.
- **📊 Offline-First Local Stats**: Persistent tracking of high score, best streak, highest level, and total games played using `@react-native-async-storage/async-storage`.
- **💰 Fair Ad Monetization**: Google Mobile Ads (`react-native-google-mobile-ads`) with smart frequency caps, cooldowns, and non-intrusive rewarded revives.
- **🎨 Cyberpunk Neon Aesthetic**: High-contrast dark mode (`#0B0F19`), edge-to-edge support, fluid animations, and high score celebrations.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Expo SDK 57](https://expo.dev/) (Managed Workflow) | Native runtime & tools |
| **Mobile Engine** | [React Native 0.86.3](https://reactnative.dev/) | Cross-platform core |
| **UI Library** | [React 19.2.3](https://react.dev/) | Reactive UI components |
| **Routing** | [Expo Router 57](https://docs.expo.dev/router/introduction/) | File-based navigation |
| **Language** | [TypeScript 6.0](https://www.typescriptlang.org/) | Type-safe codebase |
| **State & Logic** | Pure functional game engine (`src/game/`) | Deterministic state transitions |
| **Audio & Haptics** | `expo-audio` & `expo-haptics` | Low-latency sensory feedback |
| **Storage** | `@react-native-async-storage/async-storage` | Local statistics & settings persistence |
| **Monetization** | `react-native-google-mobile-ads` | AdMob Banner, Interstitial, & Rewarded Ads |
| **Testing** | [Jest](https://jestjs.io/) & [ts-jest](https://kulshekhar.github.io/ts-jest/) | Unit test suite for engine & scoring |
| **Build System** | [EAS (Expo Application Services)](https://docs.expo.dev/eas/) | Cloud builds for iOS & Android |

---

## 📂 Project Structure

```
one-more-try/
├── __tests__/                  # Unit test suites (engine, scoring, storage, difficulty, ads)
│   ├── difficulty.test.ts
│   ├── engine.test.ts
│   ├── monetization.test.ts
│   ├── scoring.test.ts
│   └── storage.test.ts
├── assets/                     # App icons, splash screens, and audio sound effects
├── patches/                    # Custom patch-package fixes for dependencies
│   └── react-native-google-mobile-ads+17.1.0.patch
├── play_store_assets/          # Store listings, feature graphics, screenshots, privacy policy
├── src/
│   ├── app/                    # Expo Router file-based screens
│   │   ├── _layout.tsx         # Root layout with Error Boundary & Splash handling
│   │   ├── index.tsx           # Home menu & player stats dashboard
│   │   ├── game.tsx            # Main reflex game screen & HUD
│   │   ├── guide.tsx           # How to play & strategy guide
│   │   ├── settings.tsx        # Audio/haptics toggles & data reset
│   │   └── privacy.tsx         # Privacy policy viewer
│   ├── components/             # Reusable UI components
│   │   ├── AdBanner.tsx        # Mobile ad banner with fallback
│   │   ├── CountdownTimer.tsx  # Dynamic circular/linear pulse countdown
│   │   ├── GameBoard.tsx       # Touch area handling target & decoy taps
│   │   ├── GameOverCard.tsx    # Run summary, stats, and retry/continue options
│   │   ├── HighScoreCelebration.tsx # Celebration animation for record breaks
│   │   ├── PlayButton.tsx      # Neon-styled animated CTA button
│   │   ├── RewardedContinue.tsx# Rewarded video revive prompt
│   │   ├── Score.tsx           # Real-time score & reaction speed HUD
│   │   ├── Streak.tsx          # Multiplier bar with milestone indicators
│   │   └── Target.tsx          # Animated pulsing target & decoy circles
│   ├── constants/              # Game tuning, palette, and ad configuration
│   │   ├── ads.ts              # Ad IDs, frequency caps, cooldowns
│   │   ├── config.ts           # App metadata, contact, and colors
│   │   └── game.ts             # Spawning margins, lifetime, sizes, scoring
│   ├── game/                   # Pure functional game engine logic
│   │   ├── difficulty.ts       # Deterministic difficulty scaling curves
│   │   ├── engine.ts           # Game state transitions & event handlers
│   │   ├── mechanics.ts        # Target & decoy placement & collision avoidance
│   │   ├── scoring.ts          # Score calculations & reaction speed bonuses
│   │   └── types.ts            # Core TypeScript interfaces & types
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAds.ts           # AdMob lifecycle and state management
│   │   ├── useGame.ts          # Main game loop, timers, and interaction hook
│   │   └── useSettings.ts      # Audio, haptics, and stats state hook
│   ├── services/               # Device & cloud services
│   │   ├── ads.ts              # AdMob SDK wrapper with safety timeouts
│   │   ├── analytics.ts        # Event logging interface
│   │   ├── audio.ts            # Sound effect loading & playback
│   │   ├── haptics.ts          # Tactile feedback triggers
│   │   └── storage.ts          # Async storage read/write operations
│   └── utils/                  # Helper utilities
│       ├── random.ts           # Bounded random coordinates & helpers
│       └── validation.ts       # Data validation helpers
├── app.json                    # Expo project configuration & plugins
├── eas.json                    # Expo Application Services build configurations
├── jest.config.js              # Jest test runner setup
├── package.json                # Project dependencies and npm scripts
└── tsconfig.json               # TypeScript compiler options
```

---

## ⚡ Game Mechanics & Math

### 1. Difficulty Scaling Algorithm
The difficulty curve dynamically adapts based on the active level:
- **Target Size**: Begins at `96px` and shrinks by `1.8px` per level down to an accessible `56px` floor:
  $$\text{size} = \text{clamp}(96 - (\text{level} - 1) \times 1.8, 56, 96)$$
- **Target Lifetime**: Decays exponentially from `3000ms` down to the physiological human reflex boundary of `480ms`:
  $$\text{lifetime} = \text{clamp}(3000 \times 0.88^{(\text{level} - 1) \times 0.4}, 480, 3000)$$
- **Decoys**: 
  - Level 1–7: No decoys
  - Level 8–15: 1 decoy
  - Level 16+: Up to 2 decoys
- **Movement Velocity**: Targets begin drifting at Level 14+, scaling up to `120 px/sec`.

### 2. Scoring System
Every successful tap awards points calculated deterministically:
$$\text{Hit Score} = \text{Base Points} + \text{Reaction Bonus} + \text{Streak Bonus} + \text{Level Bonus}$$
- **Base Points**: `100`
- **Reaction Speed Bonus**: Up to `+200` points based on how quickly the target is tapped relative to its lifetime:
  $$\text{Speed Ratio} = 1 - \frac{\text{Reaction Time}}{\text{Lifetime}}$$
- **Streak Bonus**: $\text{Streak} \times 15$
- **Level Bonus**: $(\text{Level} - 1) \times 10$

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- [Expo Go](https://expo.dev/go) on your mobile device (for quick testing) or Android Studio / Xcode (for development builds)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/one-more-try.git
   cd one-more-try
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   *(The `postinstall` script automatically applies patches in `/patches` via `patch-package`.)*

### Running the App

Start the Expo development server:
```bash
npm start
# or: npx expo start
```

- **Scan the QR code** using the Expo Go app (Android) or Camera app (iOS).
- Press `a` in the terminal to launch the Android emulator.
- Press `i` to launch the iOS simulator.

> **Note on Native Ads:** Because this app uses native modules (`react-native-google-mobile-ads`), full ad functionality requires a development build:
> ```bash
> npm run android
> # or
> npm run ios
> ```

---

## 🧪 Testing & Code Quality

The repository features comprehensive test coverage verifying the game engine, scoring rules, storage, monetization frequency caps, and difficulty curves.

Run the test suite:
```bash
npm test
# In environments without Watchman:
npx jest --no-watchman
```

Run TypeScript typecheck:
```bash
npx tsc --noEmit
```

Run Expo Doctor to check dependency compatibility:
```bash
npx expo-doctor
```

---

## 📱 Building & Deployment (EAS)

The project is configured for **EAS Build** with `eas.json`.

### Development Build
```bash
npx eas-cli@latest build --profile development --platform android
```

## 🛡️ Monetization & Privacy

- **AdMob Integration**: Banner ads are shown at the bottom of menus, with interstitial frequency capping (never immediately, minimum 3 games played, 60s cooldown).
- **Rewarded Revive**: Players can choose to watch an optional rewarded ad once per run to keep their streak alive.
- **Privacy Policy**: Compliant with Google Play Store requirements. Accessible within the app under Settings/Privacy.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

<p align="center">
  <b>Can your reflexes survive the pulse? Play PulseTap: One More Try!</b>
</p>

