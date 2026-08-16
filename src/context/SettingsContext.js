import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  loadSettings,
  persistSettings,
  clearAllData,
  DEFAULT_SETTINGS,
} from "../services/storage";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await loadSettings();
      setSettings(stored);
      setIsLoading(false);
    })();
  }, []);

  const toggleDarkMode = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, darkMode: !prev.darkMode };
      persistSettings(next);
      return next;
    });
  }, []);

  const resetAllData = useCallback(async () => {
    await clearAllData();
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, isLoading, toggleDarkMode, resetAllData }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return ctx;
}
