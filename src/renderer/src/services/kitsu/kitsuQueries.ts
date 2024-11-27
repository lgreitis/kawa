import { useQuery } from "@tanstack/react-query";
import { getKitsuAnimeMapping } from "./kitsuServices";
import { queryClient } from "@renderer/queryClient";
import { ONE_DAY_IN_MS } from "@renderer/constants";

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
