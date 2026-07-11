import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AnimeTitleLanguage = "english" | "romaji";

interface IPreferencesStore {
  animeTitleLanguage: AnimeTitleLanguage;
  setAnimeTitleLanguage: (animeTitleLanguage: AnimeTitleLanguage) => void;
}

export const usePreferencesStore = create<IPreferencesStore>()(
  persist(
    (set) => ({
      animeTitleLanguage: "english",
      setAnimeTitleLanguage: (animeTitleLanguage) => set({ animeTitleLanguage }),
    }),
    { name: "preferences" },
  ),
);
