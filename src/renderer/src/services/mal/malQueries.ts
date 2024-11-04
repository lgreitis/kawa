import { useQuery } from "@tanstack/react-query";
import {
  getMalAnimeDetails,
  getMalRankingAnime,
  getUserMalAnimeList,
  malAnimeSearch,
} from "./malServices";
import {
  type IMalAnimeSearchRequest,
  type IMalAnimeDetailsRequest,
  type IMalRankingAnimeRequest,
  type IUserMalAnimeListRequest,
} from "./malTypes";
import { useUserStore } from "@renderer/store/userStore";
import { ONE_DAY_IN_MS, ONE_HOUR_IN_MS } from "@renderer/constants";

export const useMalRankingAnimeQuery = (data: IMalRankingAnimeRequest) =>
  useQuery({
    queryKey: ["mal", "rankingAnime", data.rankingType],
    queryFn: () => getMalRankingAnime(data),
    staleTime: ONE_DAY_IN_MS,
  });

export const useMalAnimeDetailsQuery = (data: IMalAnimeDetailsRequest) =>
  useQuery({
    queryKey: ["mal", "animeDetails", data.animeId],
    queryFn: () => getMalAnimeDetails(data),
    staleTime: ONE_DAY_IN_MS,
  });

export const useMalAnimeSearchQuery = (data: IMalAnimeSearchRequest) =>
  useQuery({
    queryKey: ["mal", "animeSearch", data.q, data.limit],
    queryFn: () => malAnimeSearch(data),
    staleTime: ONE_HOUR_IN_MS,
    enabled: data.q.length > 3,
  });

export const useUserMalAnimeList = (data: IUserMalAnimeListRequest) => {
  const { currentUserId } = useUserStore();

  return useQuery({
    queryKey: ["mal", "user", "@me", "animeList"],
    queryFn: () => getUserMalAnimeList(data),
    enabled: !!currentUserId,
  });
};
