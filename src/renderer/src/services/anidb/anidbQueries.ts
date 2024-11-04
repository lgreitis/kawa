import { useQuery } from "@tanstack/react-query";
import { getAnidbAnimeInfo } from "./anidbServices";
import { ONE_DAY_IN_MS } from "@renderer/constants";

export const useAnidbAnimeInfoQuery = (anidbId: number) =>
  useQuery({
    queryKey: ["anidb", "animeInfo", anidbId],
    queryFn: () => getAnidbAnimeInfo(anidbId),
    staleTime: ONE_DAY_IN_MS, // Caching may be too aggressive, but the rate limit of anidb is fucking stupid
    enabled: !!anidbId,
    retry: false, // Don't retry because anidb will ban us if we spam them too much
  });
