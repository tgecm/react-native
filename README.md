# TeleShop Admin - React Native Android

Native Android admin panel for Telegram e-commerce bots. Offline-first, push-enabled, production-ready.

## Architecture

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.86 |
| Language | TypeScript (strict) |
| State | Zustand v5 + TanStack React Query v5 |
| Navigation | React Navigation 7 (tabs + stack) |
| HTTP | Axios (reuses existing backend) |
| KV Storage | MMKV |
| SQLite | react-native-sqlite-storage |
| Images | FastImage (disk cache) |
| Notifications | Firebase Cloud Messaging |
| Biometrics | react-native-biometrics |
| Charts | react-native-chart-kit |

## Project Structure

```
src/
├── api/                 # 18 API modules (matching backend endpoints)
├── components/shared/   # Reusable UI components
├── hooks/               # Custom hooks
├── navigation/          # React Navigation setup
├── screens/             # All screen components
│   ├── auth/            # Login
│   ├── dashboard/       # Stats dashboard
│   ├── orders/          # Order management
│   ├── products/        # Product CRUD
│   ├── customers/       # Customer list
│   ├── chats/           # Messaging
│   ├── broadcast/       # Broadcasts & giveaways
│   ├── payments/        # Payment methods
│   ├── settings/        # App settings
│   ├── subscription/    # Plan management
│   ├── customization/   # Theme customization
│   ├── commands/        # Custom commands
│   └── more/            # Menu hub
├── services/api/        # Axios client with auth interceptor
├── store/               # Zustand stores (auth, bot, toast)
├── types/               # TypeScript definitions
└── utils/               # Utilities (theme, date, format, plans)
```

## Backend

Reuses existing backend at `https://api.telegramecommerce.shop`. No new backend APIs required.

## CI/CD

GitHub Actions automatically:
1. Runs TypeScript type checking
2. Runs ESLint
3. Builds Debug APK
4. Builds Release APK + AAB
5. Uploads artifacts

## Build

```bash
# Install
npm install

# Debug APK
cd android && ./gradlew assembleDebug

# Release APK
cd android && ./gradlew assembleRelease

# Release AAB
cd android && ./gradlew bundleRelease
```

## Key Features

- **Offline-first**: SQLite cache, graceful offline mode, auto-sync on reconnect
- **Push notifications**: FCM foreground/background/click handling
- **Secure**: Encrypted storage, biometric auth, JWT refresh
- **Performant**: Virtualized lists, lazy loading, image caching, native animations
- **Android native**: All real native components, no WebViews
