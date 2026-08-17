import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useSettings } from "../context/SettingsContext";
import { useHabits } from "../context/HabitsContext";
import { getTheme, HABIT_COLORS, HABIT_ICONS } from "../theme";

export default function AddHabitScreen({ navigation }) {
  const { settings } = useSettings();
  const { addHabit } = useHabits();
  const theme = getTheme(settings.darkMode);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState(HABIT_ICONS[0]);
  const [color, setColor] = useState(HABIT_COLORS[0]);

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Give your habit a name first.");
      return;
    }
    addHabit({ name, icon, color });
    navigation.goBack();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.label, { color: theme.text }]}>Habit Name</Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
        ]}
        placeholder="e.g. Drink water, Read, Exercise"
        placeholderTextColor={theme.subtext}
        value={name}
        onChangeText={setName}
        autoFocus
      />

      <Text style={[styles.label, { color: theme.text }]}>Icon</Text>
      <View style={styles.pickerRow}>
        {HABIT_ICONS.map((i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.iconOption,
              { backgroundColor: theme.card },
              icon === i && { borderColor: theme.accent, borderWidth: 2 },
            ]}
            onPress={() => setIcon(i)}
          >
            <Text style={styles.iconText}>{i}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: theme.text }]}>Color</Text>
      <View style={styles.pickerRow}>
        {HABIT_COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.colorOption,
              { backgroundColor: c },
              color === c && [styles.colorSelected, { borderColor: theme.text }],
            ]}
            onPress={() => setColor(c)}
          />
        ))}
      </View>

      <View style={[styles.previewCard, { backgroundColor: theme.card }]}>
        <View style={[styles.previewIcon, { backgroundColor: color + "22" }]}>
          <Text style={styles.previewIconText}>{icon}</Text>
        </View>
        <Text style={[styles.previewName, { color: theme.text }]}>
          {name.trim() || "Habit name preview"}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: theme.accent }]}
        onPress={handleCreate}
      >
        <Text style={styles.createButtonText}>Create Habit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: "700", marginTop: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  pickerRow: { flexDirection: "row", flexWrap: "wrap" },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginBottom: 10,
  },
  iconText: { fontSize: 22 },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    marginBottom: 10,
  },
  colorSelected: {
    borderWidth: 3,
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
  },
  previewIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  previewIconText: { fontSize: 20 },
  previewName: { fontSize: 16, fontWeight: "600" },
  createButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 30,
  },
  createButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
