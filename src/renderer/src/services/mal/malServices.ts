import { MAL_CLIENT_ID } from "@renderer/constants";
import axios from "axios";
import {
  type IMalAnimeDetailsResponse,
  type IMalAnimeDetailsRequest,
  type IMalRankingAnimeRequest,
  type IMalSeasonalAnimeResponse,
  type IMalAnimeSearchResponse,
  type IMalAnimeSearchRequest,
  type IMalUserResponse,
  type IUserMalAnimeListResponse,
  type IUserMalAnimeListRequest,
} from "./malTypes";
import { kitsuAnimeMappingQueryFn, kitsuIdFromMalIdQueryFn } from "../kitsu/kitsuQueries";
import { type IMalTokenResponse } from "@shared/types/mal";
import { malAuthenticatedApi } from "@renderer/api";

const checkImage = (url: string): Promise<boolean> => {
  return new Promise((resolve, _reject) => {
    const img = new Image();

    img.onload = () => {
      // Image loaded successfully, so it's a valid image URL
      resolve(true);
    };

    img.onerror = () => {
      // Image failed to load, so it's an invalid image URL
      resolve(false);
    };

    img.src = url;
  });
};

export const getMalRankingAnime = async (data: IMalRankingAnimeRequest) => {
  const response = await axios.get<IMalSeasonalAnimeResponse>(
    `https://api.myanimelist.net/v2/anime/ranking?ranking_type=${data.rankingType}&limit=50`,
    {
      headers: {
        "X-MAL-CLIENT-ID": MAL_CLIENT_ID,
      },
    },
  );

  const animeWithBackdrounds: Record<string, boolean> = {};

  const kitsuAnimeMapping = await kitsuAnimeMappingQueryFn();

  const promises = response.data.data.map(async (anime) => {
    const { kitsu } = await kitsuIdFromMalIdQueryFn(anime.node.id);

    if (!kitsu) {
      return;
    }

    const mapInfo = kitsuAnimeMapping[kitsu];
    const imdbId = mapInfo?.imdb_id;

    if (!imdbId) {
      return;
    }

    try {
      const url = `https://images.metahub.space/background/large/${imdbId}/img`;
      const isImage = await checkImage(url);
      animeWithBackdrounds[anime.node.id] = isImage;
    } catch {
      return;
    }
  });

  await Promise.all(promises);

  return {
    ...response.data,
    data: response.data.data.filter((anime) => animeWithBackdrounds[anime.node.id]),
  };
};

export const getMalAnimeDetails = async (data: IMalAnimeDetailsRequest) => {
  const response = await axios.get<IMalAnimeDetailsResponse>(
    `https://api.myanimelist.net/v2/anime/${data.animeId}?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics`,
    {
      headers: {
        "X-MAL-CLIENT-ID": MAL_CLIENT_ID,
      },
    },
  );

  return response.data;
};

export const malAnimeSearch = async (data: IMalAnimeSearchRequest) => {
  const response = await axios.get<IMalAnimeSearchResponse>(
    `https://api.myanimelist.net/v2/anime?q=${data.q}&limit=${data.limit}&fields=alternative_titles`,
    {
      headers: {
        "X-MAL-CLIENT-ID": MAL_CLIENT_ID,
      },
    },
  );

  return response.data;
};

export const getMalUser = async (token: string) => {
  const response = await axios.get<IMalUserResponse>("https://api.myanimelist.net/v2/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const refreshMalToken = async (refreshToken: string) => {
  const response = await axios.post<IMalTokenResponse>(
    "https://myanimelist.net/v1/oauth2/token",
    {
      client_id: MAL_CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data;
};

// TODO: load more than 1000
export const getUserMalAnimeList = async (data: IUserMalAnimeListRequest) => {
  const response = await malAuthenticatedApi.get<IUserMalAnimeListResponse>(
    "https://api.myanimelist.net/v2/users/@me/animelist",
    {
      params: {
        limit: 1000,
        status: data.status,
      },
    },
  );

  return response.data;
};
