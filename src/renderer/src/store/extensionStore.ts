import { type AbstractSource } from "@lgreitis/kawa-sdk";
import { create } from "zustand";

interface IExtensionStore {
  sources: { importedModule: AbstractSource; name: string }[];
  addSource: (sources: { name: string; code: string }) => Promise<void>;
  removeSource: (name: string) => void;
  reset: () => void;
}

export const useExtensionStore = create<IExtensionStore>((set, get) => ({
  sources: [],
  addSource: async (source) => {
    if (get().sources.some((s) => s.name === source.name)) {
      get().removeSource(source.name);
    }

    const blob = new Blob([source.code], { type: "text/javascript" });
    const moduleUrl = URL.createObjectURL(blob);
    const module = (await import(/* @vite-ignore */ moduleUrl)) as { default: AbstractSource };
    set((state) => ({
      sources: [...state.sources, { importedModule: module.default, name: source.name }],
    }));
  },
  removeSource: (name) => {
    set((state) => ({
      sources: state.sources.filter((source) => source.name !== name),
    }));
  },
  reset: () => set({ sources: [] }),
}));
