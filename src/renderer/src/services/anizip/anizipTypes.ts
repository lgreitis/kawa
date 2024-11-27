export interface IAniZipResponse {
  mappings: { kitsu_id?: number; imdb_id?: string; anidb_id?: number | null; anilist_id?: number };
  episodes: Record<number, IAniZipEpisode>;
}

export interface IAniZipEpisode {
  tvdbShowId?: number;
  tvdbId?: number;
  seasonNumber: number;
  episodeNumber: number;
  absoluteEpisodeNumber: number;
  title: {
    ja?: string;
    en?: string;
    "x-jat"?: string;
  };
  airDate?: string;
  airDateUtc?: string;
  runtime?: number;
  overview?: string;
  image?: string;
  episode: string;
  anidbEid?: number;
  length?: number;
  airdate?: string;
  rating?: string;
  summary?: string;
}
