import { useKitsuAnimeMappingQuery } from "@renderer/services/kitsu/kitsuQueries";
import { useIdMappingsFromMalIdQuery } from "@renderer/services/mappings/mappingsQueries";
import { useMemo } from "react";

interface IUseIdFromMalData {
  imdbId?: string;
  kitsuId?: number;
  anidbId?: number;
  anilistId?: number;
}

export const useIdFromMal = (malId: number) => {
  const { data: idMappingsFromMal } = useIdMappingsFromMalIdQuery(malId);
  const { data: kitsuAnimeMapping } = useKitsuAnimeMappingQuery();

  return useMemo((): IUseIdFromMalData => {
    if (!idMappingsFromMal || !kitsuAnimeMapping) return {};

    const kitsuId = idMappingsFromMal.kitsu;
    const anidbId = idMappingsFromMal.anidb;
    const anilistId = idMappingsFromMal.anilist;

    if (!kitsuId) {
      return {
        imdbId: idMappingsFromMal.imdb,
        kitsuId: kitsuId,
        anidbId: anidbId,
        anilistId: anilistId,
      };
    }

    const mapInfo = kitsuAnimeMapping[kitsuId];
    if (!mapInfo) {
      return {
        imdbId: idMappingsFromMal.imdb,
        kitsuId: kitsuId,
        anidbId: anidbId,
        anilistId: anilistId,
      };
    }

    return {
      imdbId: mapInfo.imdb_id ?? idMappingsFromMal.imdb,
      kitsuId: kitsuId,
      anidbId: anidbId,
      anilistId: anilistId,
    };
  }, [idMappingsFromMal, kitsuAnimeMapping]);
};
