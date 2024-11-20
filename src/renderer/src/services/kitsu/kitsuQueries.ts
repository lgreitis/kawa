import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getKitsuAnimeEpisodes, getKitsuAnimeMapping } from "./kitsuServices";
import { queryClient } from "@renderer/queryClient";
import { ONE_DAY_IN_MS, ONE_HOUR_IN_MS } from "@renderer/constants";

export const useKitsuAnimeMappingQuery = () =>
  useQuery({
    queryKey: ["kitsu", "animeMapping"],
    queryFn: () => getKitsuAnimeMapping(),
    staleTime: ONE_DAY_IN_MS,
  });

export const kitsuAnimeMappingQueryFn = () =>
  queryClient.fetchQuery({
    queryKey: ["kitsu", "animeMapping"],
    queryFn: () => getKitsuAnimeMapping(),
    staleTime: ONE_DAY_IN_MS,
  });

export const useKitsuAnimeEpisodesInfiniteQuery = (kitsuId: number, limit: number) =>
  useInfiniteQuery({
    queryKey: ["kitsu", "anime", kitsuId, "episodes"],
    queryFn: ({ pageParam }) => getKitsuAnimeEpisodes(kitsuId, limit, pageParam),
    staleTime: ONE_HOUR_IN_MS,
    initialPageParam: 0,
    enabled: kitsuId !== 0,
    getPreviousPageParam: (firstPage) => firstPage.offset - limit,
    getNextPageParam: (lastPage) => {
      if (lastPage.offset + limit >= lastPage.meta.count) {
        return undefined;
      }

      return lastPage.offset + limit;
    },
  });
