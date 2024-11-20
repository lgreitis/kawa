import axios from "axios";
import { type IGetKitsuAnimeEpisodesResponse, type TKitsuAnimeMapping } from "./kitsuTypes";

export const getKitsuAnimeMapping = async () =>
  (
    await axios.get<TKitsuAnimeMapping>(
      "https://raw.githubusercontent.com/TheBeastLT/stremio-kitsu-anime/master/static/data/imdb_mapping.json",
    )
  ).data;

export const getKitsuAnimeEpisodes = async (kitsuId: number, limit: number, offset: number) => {
  // TODO: infinite query
  const response = await axios.get<IGetKitsuAnimeEpisodesResponse>(
    `https://kitsu.io/api/edge/anime/${kitsuId}/episodes?page[limit]=${limit}&page[offset]=${offset}`,
  );

  return { ...response.data, offset: offset };
};
