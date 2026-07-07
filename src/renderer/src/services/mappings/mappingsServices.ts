import axios from "axios";
import { anizipMappingsQueryFn } from "../anizip/anizipQueries";
import { type IAniZipResponse } from "../anizip/anizipTypes";

type ArmResponse = {
  kitsu?: number;
  imdb?: string;
  anidb?: number | null;
  anilist?: number;
} | null;

const emptyAniZipResponse: IAniZipResponse = {
  mappings: {},
  episodes: {},
};

export const getIdMappingsFromMalId = async (malId: number) => {
  const [armResult, anizipResult] = await Promise.allSettled([
    axios
      .get<ArmResponse>(`https://arm.haglund.dev/api/v2/ids?source=myanimelist&id=${malId}`)
      .then((response) => response.data),

    anizipMappingsQueryFn(malId),
  ]);

  const armData = armResult.status === "fulfilled" ? armResult.value : null;

  const anizipData = anizipResult.status === "fulfilled" ? anizipResult.value : emptyAniZipResponse;

  return {
    kitsu: armData?.kitsu ?? anizipData.mappings?.kitsu_id,
    imdb: armData?.imdb ?? anizipData.mappings?.imdb_id,
    anidb: armData?.anidb ?? anizipData.mappings?.anidb_id,
    anilist: armData?.anilist ?? anizipData.mappings?.anilist_id,
  };
};
