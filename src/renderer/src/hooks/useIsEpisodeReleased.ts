import { useAnidbAnimeInfoQuery } from "@renderer/services/anidb/anidbQueries";
import { isAfter, isBefore } from "date-fns";
import { useMemo } from "react";

export const useIsEpisodeReleased = (episodeNumber: number, anidbId?: number) => {
  const { data: anidbData } = useAnidbAnimeInfoQuery(anidbId ?? 0);

  const isEpisodeReleased = useMemo(() => {
    if (!anidbData) {
      return true;
    }

    if (Array.isArray(anidbData.anime.episodes.episode)) {
      const anidbEpisodeList = anidbData.anime.episodes.episode.filter(
        (episode) => episode.epno.type === 1,
      );

      const latestUnreleasedEpisodeIndex = anidbEpisodeList.findIndex((episode) =>
        episode.airdate ? isAfter(new Date(episode.airdate), new Date()) : false,
      );

      if (latestUnreleasedEpisodeIndex > episodeNumber - 1 || latestUnreleasedEpisodeIndex === -1) {
        return true;
      } else {
        return false;
      }
    } else {
      const anidbEpisode = anidbData.anime.episodes.episode;

      if (!anidbEpisode.airdate) {
        return true;
      }

      return isBefore(new Date(anidbEpisode.airdate), new Date());
    }
  }, [anidbData, episodeNumber]);

  return { isEpisodeReleased };
};
