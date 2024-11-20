import axios from "axios";

interface IAniZipResponse {
  mappings: { kitsu_id?: number; imdb_id?: string; anidb_id?: number; anilist_id?: number };
}

export const getIdMappingsFromMalId = async (malId: number) => {
  const firstResponseData = (
    await axios.get<{ kitsu?: number; imdb?: string; anidb?: number; anilist?: number }>(
      `https://arm.haglund.dev/api/v2/ids?source=myanimelist&id=${malId}`,
    )
  ).data;

  const secondResponse = await axios
    .get<IAniZipResponse>(`https://api.ani.zip/mappings?mal_id=${malId}`)
    .catch((): { data: IAniZipResponse } => ({ data: { mappings: {} } }));

  const secondResponseData = secondResponse.data;

  return {
    kitsu: firstResponseData.kitsu ?? secondResponseData.mappings?.kitsu_id,
    imdb: firstResponseData.imdb ?? secondResponseData.mappings?.imdb_id,
    anidb: firstResponseData.anidb ?? secondResponseData.mappings?.anidb_id,
    anilist: firstResponseData.anilist ?? secondResponseData.mappings?.anilist_id,
  };
};
