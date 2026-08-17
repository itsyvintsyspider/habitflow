import React from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSettings } from "../context/SettingsContext";
import { useHabits } from "../context/HabitsContext";
import { getTheme } from "../theme";

export default function SettingsScreen() {
  const { settings, toggleDarkMode, resetAllData } = useSettings();
  const { resetHabits } = useHabits();
  const theme = getTheme(settings.darkMode);

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all habits and their history. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            resetAllData();
            resetHabits();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Settings</Text>

      <View style={[styles.row, { backgroundColor: theme.card }]}>
        <View style={styles.rowText}>
          <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
          <Text style={[styles.sublabel, { color: theme.subtext }]}>
            {settings.darkMode ? "On" : "Off"}
          </Text>
        </View>
        <Switch
          value={settings.darkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ true: theme.accent }}
        />
      </View>

      <TouchableOpacity
        style={[styles.clearButton, { borderColor: theme.danger }]}
        onPress={handleClearData}
      >
        <Text style={[styles.clearButtonText, { color: theme.danger }]}>
          Clear All Habits & Data
        </Text>
      </TouchableOpacity>

      <Text style={[styles.footer, { color: theme.subtext }]}>
        HabitFlow v1.0.0
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 26, fontWeight: "800", marginBottom: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  rowText: { flex: 1 },
  label: { fontSize: 16, fontWeight: "600" },
  sublabel: { fontSize: 13, marginTop: 2 },
  clearButton: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  clearButtonText: { fontWeight: "600", fontSize: 14 },
  footer: { marginTop: "auto", textAlign: "center", fontSize: 12, paddingTop: 30 },
});
