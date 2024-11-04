import { create } from "zustand";

interface HomePageState {
  currentSlide: number;
  setSlide: (slide: number) => void;
}

export const useHomePageStore = create<HomePageState>((set) => ({
  currentSlide: 0,
  setSlide: (slide) => set({ currentSlide: slide }),
}));
