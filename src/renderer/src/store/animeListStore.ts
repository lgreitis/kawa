import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IEpisodeData {
  watchProgress?: number;
  currentTime?: number;
}

export interface IAnimeListEntry {
  malId: number;
  episodes: Record<number, IEpisodeData>;
}

interface IAnimeListStore {
  importData?: {
    importDate: string;
    importSource: string;
    importUsername: string;
  };
  animeList: IAnimeListEntry[];
  getEpisodeData: (malId: number, episodeNumber: number) => IEpisodeData | undefined;
  setProgress: (
    malId: number,
    episodeNumber: number,
    watchProgress: number,
    currentTime: number,
  ) => void;
}

export const useAnimeListStore = create<IAnimeListStore>()(
  persist(
    (set, get) => ({
      importData: undefined,
      animeList: [],
      getEpisodeData: (malId, episodeNumber) =>
        get().animeList.find((entry) => entry.malId === malId)?.episodes[episodeNumber],
      setProgress: (malId, episodeNumber, watchProgress, currentTime) => {
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
                    currentTime,
                  },
                },
              },
            ],
          }));
        } else {
          currentEntry.episodes[episodeNumber] = {
            watchProgress,
            currentTime,
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
