import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useSettings } from "../context/SettingsContext";
import { getTheme } from "../theme";

/**
 * Shared component for "nothing here yet" and "still loading" states,
 * so every screen presents these consistently rather than each screen
 * inventing its own layout.
 */
export default function EmptyState({ loading, icon = "📋", title, subtitle }) {
  const { settings } = useSettings();
  const theme = getTheme(settings.darkMode);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.subtext }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  icon: { fontSize: 40, marginBottom: 12 },
  title: { fontSize: 17, fontWeight: "700", marginBottom: 6, textAlign: "center" },
  subtitle: { fontSize: 14, textAlign: "center" },
});
