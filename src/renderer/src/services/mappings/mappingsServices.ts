import axios from "axios";
import { anizipMappingsQueryFn } from "../anizip/anizipQueries";
import { type IAniZipResponse } from "../anizip/anizipTypes";

export const getIdMappingsFromMalId = async (malId: number) => {
  const firstResponseData = (
    await axios.get<{
      kitsu?: number;
      imdb?: string;
      anidb?: number | null;
      anilist?: number;
    } | null>(`https://arm.haglund.dev/api/v2/ids?source=myanimelist&id=${malId}`)
  ).data;

  const secondResponse = await anizipMappingsQueryFn(malId).catch(
    (): IAniZipResponse => ({ mappings: {}, episodes: {} }),
  );

  return {
    kitsu: firstResponseData?.kitsu ?? secondResponse.mappings?.kitsu_id,
    imdb: firstResponseData?.imdb ?? secondResponse.mappings?.imdb_id,
    anidb: firstResponseData?.anidb ?? secondResponse.mappings?.anidb_id,
    anilist: firstResponseData?.anilist ?? secondResponse.mappings?.anilist_id,
  };
};
