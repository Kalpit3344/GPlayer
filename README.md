# GPlayer 🎵

A minimalist, cloud-native music player for Android that streams your music library directly from your own Dropbox — no uploads to a third-party server, no local storage bloat, no ads.

## Why GPlayer?

Most music apps either lock you into their catalog or eat up your phone's storage with downloaded files. GPlayer flips that: you keep your own music files in your own Dropbox, and the app streams them on demand. Your library, your storage, your rules.

- **No local storage required** — songs stream directly from Dropbox
- **No ads, ever**
- **You own your files** — nothing is copied to a third-party server; GPlayer only reads what you already have in Dropbox
- **Free to start** — works within Dropbox's free tier; pay Dropbox directly if you need more storage

## Features

- 🔐 Secure OAuth 2.0 sign-in via Dropbox (with PKCE)
- ☁️ Automatic sync of audio files from your Dropbox
- ▶️ Background playback with lock-screen and notification controls
- 📱 Clean, dark-themed mobile UI
- 💾 Fast local caching of metadata (not audio) for instant library loads

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (CLI, bare workflow) |
| Language | TypeScript |
| Auth | [react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth) (OAuth 2.0 + PKCE against Dropbox) |
| Audio playback | [@rntp/player](https://github.com/doublesymmetry/react-native-track-player) (React Native Track Player) |
| Local storage | [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) (built on Nitro Modules) |
| Navigation | [@react-navigation/native](https://reactnavigation.org/) |
| Cloud storage | Dropbox API |

## Getting Started

### Prerequisites

- Node.js and npm
- A configured Android development environment (Android Studio, SDK, NDK) — see the [React Native environment setup guide](https://reactnative.dev/docs/set-up-your-environment)
- A Dropbox account and a registered [Dropbox App](https://www.dropbox.com/developers/apps) with an OAuth 2.0 client

### Installation

```bash
git clone https://github.com/Kalpit3344/GPlayer.git
cd GPlayer
npm install
```

### Configuration

GPlayer authenticates against Dropbox's OAuth API. Update the config in `src/auth/dropboxAuth.ts` with your own Dropbox App's client ID and redirect scheme:

```typescript
const config: AuthConfiguration = {
  clientId: 'YOUR_DROPBOX_APP_CLIENT_ID',
  redirectUrl: 'com.yourapp://oauthredirect',
  scopes: [],
  serviceConfiguration: {
    authorizationEndpoint: 'https://www.dropbox.com/oauth2/authorize',
    tokenEndpoint: 'https://api.dropboxapi.com/oauth2/token',
  },
  usePKCE: true,
};
```

You'll also need to register the matching `appAuthRedirectScheme` manifest placeholder in `android/app/build.gradle`:

```gradle
manifestPlaceholders = [
    appAuthRedirectScheme: 'com.yourapp'
]
```

### Running the app

```bash
npx react-native run-android
```

Make sure an emulator is running or a device is connected first.

### Building a release APK

```bash
cd android
./gradlew assembleRelease
```

The signed APK will be at `android/app/build/outputs/apk/release/app-release.apk`.

## Project Structure

```
GPlayer/
├── android/              # Native Android project
├── src/
│   ├── auth/              # Dropbox OAuth logic
│   ├── player/             # Track Player background service
│   ├── screens/           # App screens (Login, Library, Now Playing, etc.)
│   └── types/               # Shared TypeScript types
├── App.tsx
├── index.js
└── app.json
```

## Roadmap

- [ ] Playlist creation and management
- [ ] Search and filter within library
- [ ] Delta sync via Dropbox's changes API for faster refresh
- [ ] Offline caching option for selected tracks
- [ ] iOS support

## Contributing

This is currently a personal/learning project. Issues and suggestions are welcome via GitHub Issues.

## License

MIT
