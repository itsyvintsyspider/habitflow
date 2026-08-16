import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SettingsProvider, useSettings } from "./src/context/SettingsContext";
import { HabitsProvider } from "./src/context/HabitsContext";
import AppNavigator from "./src/navigation/AppNavigator";

function AppShell() {
  const { settings, isLoading } = useSettings();

  // Avoid a flash of the wrong theme while settings load from AsyncStorage.
  if (isLoading) return null;

  return (
    <>
      <StatusBar style={settings.darkMode ? "light" : "dark"} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <HabitsProvider>
          <AppShell />
        </HabitsProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
