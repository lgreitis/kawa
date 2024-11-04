import axios from "axios";
import { type IGetKitsuAnimeEpisodesResponse, type TKitsuAnimeMapping } from "./kitsuTypes";

export const getKitsuAnimeMapping = async () =>
  (
    await axios.get<TKitsuAnimeMapping>(
      "https://raw.githubusercontent.com/TheBeastLT/stremio-kitsu-anime/master/static/data/imdb_mapping.json",
    )
  ).data;

export const getKitsuIdFromMalId = async (malId: number) =>
  (
    await axios.get<{ kitsu?: number; imdb?: string; anidb?: number; anilist?: number }>(
      `https://relations.yuna.moe/api/v2/ids?source=myanimelist&id=${malId}&include=imdb,kitsu,anidb,anilist`,
    )
  ).data;

export const getKitsuAnimeEpisodes = async (kitsuId: number, limit: number, offset: number) => {
  // TODO: infinite query
  const response = await axios.get<IGetKitsuAnimeEpisodesResponse>(
    `https://kitsu.io/api/edge/anime/${kitsuId}/episodes?page[limit]=${limit}&page[offset]=${offset}`,
  );

  return { ...response.data, offset: offset };
};
