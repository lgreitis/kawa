import { useQuery } from "@tanstack/react-query";
import { getAnidbAnimeInfo } from "./anidbServices";
import { ONE_DAY_IN_MS } from "@renderer/constants";

export const useAnidbAnimeInfoQuery = (anidbId: number) =>
  useQuery({
    queryKey: ["anidb", "animeInfo", anidbId],
    queryFn: () => getAnidbAnimeInfo(anidbId),
    staleTime: ONE_DAY_IN_MS,
    enabled: !!anidbId,
  });
