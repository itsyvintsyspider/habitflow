import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useSettings } from "../context/SettingsContext";
import { useHabits } from "../context/HabitsContext";
import HabitRow from "../components/HabitRow";
import EmptyState from "../components/EmptyState";
import { todayISO } from "../services/dateUtils";
import { getTheme } from "../theme";

function formatTodayHeader() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function TodayScreen({ navigation }) {
  const { settings } = useSettings();
  const { activeHabits, isLoading } = useHabits();
  const theme = getTheme(settings.darkMode);

  const doneCount = activeHabits.filter((h) =>
    h.completions.includes(todayISO())
  ).length;

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <EmptyState loading />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.date, { color: theme.subtext }]}>
        {formatTodayHeader()}
      </Text>
      <Text style={[styles.title, { color: theme.text }]}>
        Today's Habits
      </Text>

      {activeHabits.length > 0 && (
        <Text style={[styles.progress, { color: theme.accent }]}>
          {doneCount} of {activeHabits.length} completed
        </Text>
      )}

      {activeHabits.length === 0 ? (
        <EmptyState
          icon="🌱"
          title="No habits yet"
          subtitle='Head to the Habits tab and tap "+" to create your first one.'
        />
      ) : (
        <FlatList
          data={activeHabits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <HabitRow
              habit={item}
              onPress={(habit) =>
                navigation.navigate("HabitDetail", { habitId: habit.id })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  date: { fontSize: 13, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  title: { fontSize: 26, fontWeight: "800", marginTop: 4, marginBottom: 6 },
  progress: { fontSize: 14, fontWeight: "600", marginBottom: 16 },
  listContent: { paddingBottom: 30 },
});
