import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";

import TodayScreen from "../screens/TodayScreen";
import HabitDetailScreen from "../screens/HabitDetailScreen";
import AllHabitsScreen from "../screens/AllHabitsScreen";
import AddHabitScreen from "../screens/AddHabitScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { useSettings } from "../context/SettingsContext";
import { getTheme } from "../theme";

const Tab = createBottomTabNavigator();
const TodayStack = createNativeStackNavigator();
const HabitsStack = createNativeStackNavigator();

function stackScreenOptions(theme) {
  return {
    headerStyle: { backgroundColor: theme.card },
    headerTintColor: theme.text,
  };
}

function TodayStackNavigator() {
  const { settings } = useSettings();
  const theme = getTheme(settings.darkMode);

  return (
    <TodayStack.Navigator screenOptions={stackScreenOptions(theme)}>
      <TodayStack.Screen
        name="TodayMain"
        component={TodayScreen}
        options={{ headerShown: false }}
      />
      <TodayStack.Screen
        name="HabitDetail"
        component={HabitDetailScreen}
        options={{ title: "Habit Details" }}
      />
    </TodayStack.Navigator>
  );
}

function HabitsStackNavigator() {
  const { settings } = useSettings();
  const theme = getTheme(settings.darkMode);

  return (
    <HabitsStack.Navigator screenOptions={stackScreenOptions(theme)}>
      <HabitsStack.Screen
        name="AllHabitsMain"
        component={AllHabitsScreen}
        options={{ headerShown: false }}
      />
      <HabitsStack.Screen
        name="AddHabit"
        component={AddHabitScreen}
        options={{ title: "New Habit" }}
      />
      <HabitsStack.Screen
        name="HabitDetail"
        component={HabitDetailScreen}
        options={{ title: "Habit Details" }}
      />
    </HabitsStack.Navigator>
  );
}

function TabIcon({ label, focused }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>{label}</Text>
  );
}

export default function AppNavigator() {
  const { settings } = useSettings();
  const theme = getTheme(settings.darkMode);

  const navTheme = {
    ...(settings.darkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(settings.darkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.background,
      card: theme.tabBackground,
      text: theme.text,
      border: theme.border,
      primary: theme.accent,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.tabInactive,
          tabBarStyle: { backgroundColor: theme.tabBackground },
        }}
      >
        <Tab.Screen
          name="Today"
          component={TodayStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="✅" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Habits"
          component={HabitsStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="📋" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="⚙️" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
