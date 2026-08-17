import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useSettings } from "../context/SettingsContext";
import { useHabits } from "../context/HabitsContext";
import { lastNDays, isToday } from "../services/dateUtils";
import { getTheme } from "../theme";

const HISTORY_DAYS = 35; // 5 weeks strip
const CELLS_PER_ROW = 7;
const CELL_MARGIN = 4;

export default function HabitDetailScreen({ route, navigation }) {
  const { habitId } = route.params;
  const { settings } = useSettings();
  const { habits, toggleCompletion, deleteHabit, getHabitStats } = useHabits();
  const theme = getTheme(settings.darkMode);
  const [gridWidth, setGridWidth] = useState(0);

  // aspectRatio + percentage width doesn't reliably resolve cell height on
  // native Yoga inside a flexWrap row (it renders fine on react-native-web,
  // which uses the browser's CSS aspect-ratio, but collapses every row to
  // near-zero height on Android/iOS). Measure the grid's actual width and
  // compute square cells in points instead.
  const cellSize =
    gridWidth > 0 ? (gridWidth - CELL_MARGIN * 2 * CELLS_PER_ROW) / CELLS_PER_ROW : 0;

  const habit = habits.find((h) => h.id === habitId);

  if (!habit) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>This habit no longer exists.</Text>
      </View>
    );
  }

  const { currentStreak, longestStreak, totalCompletions } =
    getHabitStats(habit);
  const days = lastNDays(HISTORY_DAYS);
  const completedSet = new Set(habit.completions);

  const handleDelete = () => {
    Alert.alert(
      "Delete Habit",
      `Delete "${habit.name}" and all its history? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteHabit(habit.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: habit.color + "22" }]}>
          <Text style={styles.iconLarge}>{habit.icon}</Text>
        </View>
        <Text style={[styles.name, { color: theme.text }]}>{habit.name}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.statValue, { color: theme.text }]}>
            🔥 {currentStreak}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            Current Streak
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.statValue, { color: theme.text }]}>
            🏆 {longestStreak}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            Longest Streak
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.statValue, { color: theme.text }]}>
            ✓ {totalCompletions}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext }]}>
            Total Days
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Last {HISTORY_DAYS} Days
      </Text>
      <View
        style={styles.grid}
        onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}
      >
        {days.map((day) => {
          const done = completedSet.has(day);
          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayCell,
                {
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: done ? habit.color : theme.checkboxEmpty,
                  borderWidth: isToday(day) ? 2 : 0,
                  borderColor: theme.accent,
                },
              ]}
              onPress={() => toggleCompletion(habit.id, day)}
            />
          );
        })}
      </View>
      <Text style={[styles.gridHint, { color: theme.subtext }]}>
        Tap any day to toggle it. Today is outlined.
      </Text>

      <TouchableOpacity
        style={[styles.deleteButton, { borderColor: theme.danger }]}
        onPress={handleDelete}
      >
        <Text style={[styles.deleteButtonText, { color: theme.danger }]}>
          Delete Habit
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconLarge: { fontSize: 28 },
  name: { fontSize: 24, fontWeight: "800", flexShrink: 1 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  statCard: {
    flex: 1,
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 4,
  },
  statValue: { fontSize: 18, fontWeight: "700" },
  statLabel: { fontSize: 11, marginTop: 4, textAlign: "center" },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: {
    borderRadius: 4,
    margin: CELL_MARGIN,
  },
  gridHint: { fontSize: 12, marginTop: 10 },
  deleteButton: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 30,
  },
  deleteButtonText: { fontWeight: "600", fontSize: 14 },
});
