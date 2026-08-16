import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  HABITS: "@habitflow/habits",
  SETTINGS: "@habitflow/settings",
};

const DEFAULT_SETTINGS = {
  darkMode: false,
};

export async function loadHabits() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.HABITS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Failed to load habits:", err);
    return [];
  }
}

export async function persistHabits(habits) {
  try {
    await AsyncStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
  } catch (err) {
    console.warn("Failed to save habits:", err);
  }
}

export async function loadSettings() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch (err) {
    console.warn("Failed to load settings:", err);
    return DEFAULT_SETTINGS;
  }
}

export async function persistSettings(settings) {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.warn("Failed to save settings:", err);
  }
}

export async function clearAllData() {
  try {
    await AsyncStorage.multiRemove([KEYS.HABITS, KEYS.SETTINGS]);
  } catch (err) {
    console.warn("Failed to clear data:", err);
  }
}

export { DEFAULT_SETTINGS };
