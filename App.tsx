import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from './src/theme/theme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from './src/screens/DashboardScreen';
import GuestsScreen from './src/screens/GuestsScreen';
import TasksScreen from './src/screens/TasksScreen';
import VendorsScreen from './src/screens/VendorsScreen';
import DesignSystemScreen from './src/screens/DesignSystemScreen';
import AuthScreen from './src/screens/AuthScreen';
import VerifyOTPScreen from './src/screens/VerifyOTPScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from './src/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { WeddingProvider, useWedding } from './src/lib/WeddingContext';
import CreateWeddingScreen from './src/screens/CreateWeddingScreen';
import WeddingsScreen from './src/screens/WeddingsScreen';
import EnterWeddingCodeScreen from './src/screens/EnterWeddingCodeScreen';
import { useFonts } from '@expo-google-fonts/playfair-display';
import { PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const AuthStackNav = createNativeStackNavigator();
const OnboardStackNav = createNativeStackNavigator();

function Tabs() {
  const { colors, spacing, typography, isDark } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
        },
        tabBarBackground: () => (
          <BlurView tint={isDark ? 'dark' : 'light'} intensity={30} style={{ flex: 1 }} />
        ),
        tabBarLabelStyle: {
          fontFamily: typography.bodyMedium,
          fontSize: 11,
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Guests"
        component={GuestsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="users" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="check-square" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Vendors"
        component={VendorsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="briefcase" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Design"
        component={DesignSystemScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="layers" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <AuthStackNav.Navigator>
      <AuthStackNav.Screen name="Auth" component={AuthScreen} options={{ title: 'Sign in' }} />
      <AuthStackNav.Screen name="Verify" component={VerifyOTPScreen} options={{ title: 'Verify' }} />
    </AuthStackNav.Navigator>
  );
}

function OnboardStack() {
  return (
    <OnboardStackNav.Navigator>
      <OnboardStackNav.Screen name="Weddings" component={WeddingsScreen} options={{ title: 'Your weddings' }} />
      <OnboardStackNav.Screen name="CreateWedding" component={CreateWeddingScreen} options={{ title: 'Create wedding' }} />
      <OnboardStackNav.Screen name="EnterWeddingCode" component={EnterWeddingCodeScreen} options={{ title: 'Enter password' }} />
    </OnboardStackNav.Navigator>
  );
}

function AppInner() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const { weddingId, ready: weddingReady } = useWedding();
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  if (!ready || !fontsLoaded) return null;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          weddingReady && weddingId ? (
            <RootStack.Screen name="Root" component={Tabs} />
          ) : (
            <RootStack.Screen name="OnboardRoot" component={OnboardStack} />
          )
        ) : (
          <RootStack.Screen name="AuthRoot" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WeddingProvider>
        <AppInner />
      </WeddingProvider>
    </GestureHandlerRootView>
  );
}
