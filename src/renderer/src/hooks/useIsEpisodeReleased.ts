import { useAnidbAnimeInfoQuery } from "@renderer/services/anidb/anidbQueries";
import { isAfter, isBefore } from "date-fns";
import { useMemo } from "react";

interface IIsEpisodeReleasedReturn {
  isEpisodeReleased: boolean;
  airdate?: Date;
}

export const useIsEpisodeReleased = (episodeNumber: number, anidbId?: number) => {
  const { data: anidbData } = useAnidbAnimeInfoQuery(anidbId ?? 0);

  const isEpisodeReleased = useMemo((): IIsEpisodeReleasedReturn => {
    if (!anidbData) {
      return { isEpisodeReleased: true };
    }

    if (!anidbData.anime.episodes) {
      return { isEpisodeReleased: false };
    }

    if (Array.isArray(anidbData.anime.episodes.episode)) {
      const anidbEpisodeList = anidbData.anime.episodes.episode.filter(
        (episode) => episode.epno.type === 1,
      );

      // We do this, because some future episodes don't have release date in anidb
      const latestUnreleasedEpisodeIndex = anidbEpisodeList.findIndex((episode) =>
        episode.airdate ? isAfter(new Date(episode.airdate), new Date()) : false,
      );

      const thisEpisode = anidbEpisodeList[episodeNumber - 1];
      const airdate = thisEpisode?.airdate ? new Date(thisEpisode.airdate) : undefined;

      if (latestUnreleasedEpisodeIndex > episodeNumber - 1) {
        return { isEpisodeReleased: true, airdate: airdate };
      }

      if (latestUnreleasedEpisodeIndex === -1) {
        return { isEpisodeReleased: true };
      }

      return { isEpisodeReleased: false, airdate: airdate };
    } else {
      const anidbEpisode = anidbData.anime.episodes.episode;

      if (!anidbEpisode.airdate) {
        return { isEpisodeReleased: true };
      }

      const airdate = new Date(anidbEpisode.airdate);

      return { isEpisodeReleased: isBefore(airdate, new Date()), airdate: airdate };
    }
  }, [anidbData, episodeNumber]);

  return { ...isEpisodeReleased };
};
