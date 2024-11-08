import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IAnimeListEntry {
  malId: number;
  episodes: Record<
    number,
    {
      watchProgress?: number;
    }
  >;
}

interface IAnimeListStore {
  importData?: {
    importDate: string;
    importSource: string;
    importUsername: string;
  };
  animeList: IAnimeListEntry[];
  setProgress: (malId: number, episodeNumber: number, watchProgress: number) => void;
}

export const useAnimeListStore = create<IAnimeListStore>()(
  persist(
    (set, get) => ({
      importData: undefined,
      animeList: [],
      setProgress: (malId, episodeNumber, watchProgress) => {
        const currentEntry = get().animeList.find((entry) => entry.malId === malId);

        if (!currentEntry) {
          set((state) => ({
            animeList: [
              ...state.animeList,
              {
                malId,
                episodes: {
                  [episodeNumber]: {
                    watchProgress,
                  },
                },
              },
            ],
          }));
        } else {
          currentEntry.episodes[episodeNumber] = {
            watchProgress,
          };

          set((state) => ({
            animeList: state.animeList.map((entry) =>
              entry.malId === malId ? currentEntry : entry,
            ),
          }));
        }
      },
    }),
    { name: "animeList" },
  ),
);

// TODO: The object should be a map with malId as key
export const useAnimeListEntry = (malId: number) =>
  useAnimeListStore((state) => state.animeList.find((entry) => entry.malId === malId));
