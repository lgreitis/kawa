import axios from "axios";
import { type TKitsuAnimeMapping } from "./kitsuTypes";

export const getKitsuAnimeMapping = async () =>
  (
    await axios.get<TKitsuAnimeMapping>(
      "https://raw.githubusercontent.com/TheBeastLT/stremio-kitsu-anime/master/static/data/imdb_mapping.json",
    )
  ).data;
