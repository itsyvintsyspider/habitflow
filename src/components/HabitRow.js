import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSettings } from "../context/SettingsContext";
import { useHabits } from "../context/HabitsContext";
import { todayISO } from "../services/dateUtils";
import { getTheme } from "../theme";

export default function HabitRow({ habit, onPress }) {
  const { settings } = useSettings();
  const { toggleCompletion, getHabitStats } = useHabits();
  const theme = getTheme(settings.darkMode);

  const isDoneToday = habit.completions.includes(todayISO());
  const { currentStreak } = getHabitStats(habit);

  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: theme.card }]}
      onPress={() => onPress(habit)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, { backgroundColor: habit.color + "22" }]}>
        <Text style={styles.icon}>{habit.icon}</Text>
      </View>

      <View style={styles.middle}>
        <Text style={[styles.name, { color: theme.text }]}>{habit.name}</Text>
        <Text style={[styles.streak, { color: theme.subtext }]}>
          {currentStreak > 0
            ? `🔥 ${currentStreak} day${currentStreak === 1 ? "" : "s"} streak`
            : "No streak yet"}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.checkbox,
          {
            borderColor: isDoneToday ? theme.success : theme.checkboxEmpty,
            backgroundColor: isDoneToday ? theme.success : "transparent",
          },
        ]}
        onPress={() => toggleCompletion(habit.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {isDoneToday && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: { fontSize: 20 },
  middle: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600" },
  streak: { fontSize: 12, marginTop: 3 },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
