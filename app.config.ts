import 'dotenv/config';
import { ExpoConfig } from 'expo/config';

export default ({ config }: { config: ExpoConfig }) => ({
  ...config,
  name: 'FirstWedAppMobile',
  slug: 'first-wed-app-mobile',
  owner: 'mimmisaarijarvi',
  plugins: ['expo-font'],
  android: {
    package: 'com.mimmisaarijarvi.firstwedapp',
  },
  ios: {
    bundleIdentifier: 'com.mimmisaarijarvi.firstwedapp',
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    eas: {
      projectId: '90ee8870-eec4-4e8c-9f5e-b6a8a70048ad',
    },
  },
});
