import { type IMyAnimeList } from "@renderer/utils/malImporter";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum AnimeStatus {
  Watching = "Watching",
  Completed = "Completed",
  OnHold = "On-Hold",
  Dropped = "Dropped",
  PlanToWatch = "Plan to Watch",
}

export interface IAnimeListEntry {
  malId: number;
  status: AnimeStatus;
  watchedEpisodes: number;
  watchProgress?: number;
}

interface IAnimeListStore {
  importData?: {
    importDate: string;
    importSource: string;
    importUsername: string;
  };
  animeList: IAnimeListEntry[];
  importMalData: (data: IMyAnimeList) => void;
}

export const useAnimeListStore = create<IAnimeListStore>()(
  persist(
    (set) => ({
      importData: undefined,
      animeList: [],
      importMalData: (data) => {
        const animeList = data.myanimelist.anime.map((anime) => ({
          malId: anime.series_animedb_id,
          status: AnimeStatus[anime.my_status as keyof typeof AnimeStatus],
          watchedEpisodes: anime.my_watched_episodes,
        }));

        set({
          animeList,
          importData: {
            importDate: new Date().toUTCString(),
            importSource: "MyAnimeList",
            importUsername: data.myanimelist.myinfo.user_name,
          },
        });
      },
    }),
    { name: "animeList" },
  ),
);

// TODO: The object should be a map with malId as key
export const useAnimeListEntry = (malId: number) =>
  useAnimeListStore((state) => state.animeList.find((entry) => entry.malId === malId));
