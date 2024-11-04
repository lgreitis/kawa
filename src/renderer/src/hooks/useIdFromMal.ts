import {
  useKitsuAnimeMappingQuery,
  useKitsuIdFromMalIdQuery,
} from "@renderer/services/kitsu/kitsuQueries";
import { useMemo } from "react";

interface IUseIdFromMalData {
  imdbId?: string;
  kitsuId?: number;
  anidbId?: number;
  anilistId?: number;
}

export const useIdFromMal = (malId: number) => {
  const { data: kitsuIdFromMal } = useKitsuIdFromMalIdQuery(malId);
  const { data: kitsuAnimeMapping } = useKitsuAnimeMappingQuery();

  return useMemo((): IUseIdFromMalData => {
    if (!kitsuIdFromMal || !kitsuAnimeMapping) return {};

    const kitsuId = kitsuIdFromMal.kitsu;
    const anidbId = kitsuIdFromMal.anidb;
    const anilistId = kitsuIdFromMal.anilist;

    if (!kitsuId) return {};

    const mapInfo = kitsuAnimeMapping[kitsuId];
    if (!mapInfo) return { kitsuId: kitsuId, anidbId: anidbId, anilistId: anilistId };

    return {
      imdbId: mapInfo.imdb_id ?? kitsuIdFromMal.imdb,
      kitsuId: kitsuIdFromMal.kitsu,
      anidbId: anidbId,
      anilistId: anilistId,
    };
  }, [kitsuIdFromMal, kitsuAnimeMapping]);
};
