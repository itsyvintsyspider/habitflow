import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useSettings } from "../context/SettingsContext";
import { useHabits } from "../context/HabitsContext";
import EmptyState from "../components/EmptyState";
import { getTheme } from "../theme";

export default function AllHabitsScreen({ navigation }) {
  const { settings } = useSettings();
  const { activeHabits, isLoading } = useHabits();
  const theme = getTheme(settings.darkMode);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.text }]}>Habits</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.accent }]}
          onPress={() => navigation.navigate("AddHabit")}
        >
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <EmptyState loading />
      ) : activeHabits.length === 0 ? (
        <EmptyState
          icon="🌱"
          title="No habits yet"
          subtitle='Tap "+ New" above to create your first habit.'
        />
      ) : (
        <FlatList
          data={activeHabits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.row, { backgroundColor: theme.card }]}
              onPress={() =>
                navigation.navigate("HabitDetail", { habitId: item.id })
              }
            >
              <View style={[styles.iconCircle, { backgroundColor: item.color + "22" }]}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <Text style={[styles.name, { color: theme.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.chevron, { color: theme.subtext }]}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 26, fontWeight: "800" },
  addButton: { borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16 },
  addButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  listContent: { paddingBottom: 30 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: { fontSize: 18 },
  name: { flex: 1, fontSize: 16, fontWeight: "600" },
  chevron: { fontSize: 22 },
});
