import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IVolumeState {
  volume: number;
  setVolume: (volume: number) => void;
}

export const useVolumeStore = create<IVolumeState>()(
  persist(
    (set) => ({
      volume: 0.5,
      setVolume: (volume) => set({ volume }),
    }),
    { name: "volume" },
  ),
);
