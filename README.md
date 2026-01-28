# FirstWedApp Mobile

![Expo](https://img.shields.io/badge/expo-54.0.31-000?logo=expo)
![Platforms](https://img.shields.io/badge/platform-android%20%7C%20ios-blue)

Mobile-first Expo app for wedding planning (EU-ready) with Supabase backend.

## Setup
1. Create a Supabase project in an EU region (e.g., Frankfurt).
2. In Project Settings -> API, copy the Project URL and anon key.
3. Enable Email auth with OTP (Authentication -> Providers -> Email).
4. In SQL editor, run `supabase.sql` from this repo.
5. Fill `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## Run (Windows)
- Install Expo Go on your phone.
- From this folder:
```
npx expo start
```
- Scan the QR with Expo Go. Use LAN or Tunnel if needed.

## Development build (recommended)
- Builds a custom dev client so native versions always match.
```
npx expo install expo-dev-client
npx eas-cli build --platform android --profile development
npx expo start --dev-client --clear
```

## Screens
- Auth (email OTP)
- Dashboard, Guests, Tasks, Vendors

## Notes
- Session is stored in SecureStore.
- To sign out later, call `supabase.auth.signOut()` (add a button in Dashboard).

## Onboarding (weddings)
- After sign-in, if you have no selected wedding, the app shows "Your weddings".
- Tap "Create new" to create one; it will auto-add you as owner and select it.
- You can select any existing wedding you are a member of.

## Guests
- On the Guests tab, add a guest with name (email/phone optional).
- Tap Edit to modify, Delete to remove.
- Data is scoped per current wedding and protected by RLS policies.
