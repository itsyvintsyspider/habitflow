import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { loadHabits, persistHabits } from "../services/storage";
import { todayISO, calculateStreak, calculateLongestStreak } from "../services/dateUtils";

const HabitsContext = createContext(null);

function generateId() {
  return `habit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await loadHabits();
      setHabits(stored);
      setIsLoading(false);
    })();
  }, []);

  const addHabit = useCallback(({ name, icon, color }) => {
    const newHabit = {
      id: generateId(),
      name: name.trim(),
      icon: icon || "🎯",
      color: color || "#3b82f6",
      createdAt: todayISO(),
      completions: [],
      archived: false,
    };
    setHabits((prev) => {
      const next = [...prev, newHabit];
      persistHabits(next);
      return next;
    });
    return newHabit.id;
  }, []);

  const updateHabit = useCallback((id, updates) => {
    setHabits((prev) => {
      const next = prev.map((h) => (h.id === id ? { ...h, ...updates } : h));
      persistHabits(next);
      return next;
    });
  }, []);

  const deleteHabit = useCallback((id) => {
    setHabits((prev) => {
      const next = prev.filter((h) => h.id !== id);
      persistHabits(next);
      return next;
    });
  }, []);

  const toggleCompletion = useCallback((id, isoDate = todayISO()) => {
    setHabits((prev) => {
      const next = prev.map((h) => {
        if (h.id !== id) return h;
        const alreadyDone = h.completions.includes(isoDate);
        const completions = alreadyDone
          ? h.completions.filter((d) => d !== isoDate)
          : [...h.completions, isoDate];
        return { ...h, completions };
      });
      persistHabits(next);
      return next;
    });
  }, []);

  const getHabitStats = useCallback((habit) => {
    return {
      currentStreak: calculateStreak(habit.completions),
      longestStreak: calculateLongestStreak(habit.completions),
      totalCompletions: habit.completions.length,
    };
  }, []);

  const resetHabits = useCallback(() => {
    setHabits([]);
  }, []);

  const activeHabits = habits.filter((h) => !h.archived);

  return (
    <HabitsContext.Provider
      value={{
        habits,
        activeHabits,
        isLoading,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleCompletion,
        getHabitStats,
        resetHabits,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) {
    throw new Error("useHabits must be used within a HabitsProvider");
  }
  return ctx;
}
