import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from './src/screens/DashboardScreen';
import GuestsScreen from './src/screens/GuestsScreen';
import TasksScreen from './src/screens/TasksScreen';
import VendorsScreen from './src/screens/VendorsScreen';
import AuthScreen from './src/screens/AuthScreen';
import VerifyOTPScreen from './src/screens/VerifyOTPScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from './src/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { WeddingProvider, useWedding } from './src/lib/WeddingContext';
import CreateWeddingScreen from './src/screens/CreateWeddingScreen';
import WeddingsScreen from './src/screens/WeddingsScreen';
import EnterWeddingCodeScreen from './src/screens/EnterWeddingCodeScreen';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const AuthStackNav = createNativeStackNavigator();
const OnboardStackNav = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Guests" component={GuestsScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Vendors" component={VendorsScreen} />
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

  if (!ready) return null;

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
