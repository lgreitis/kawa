export interface IMalSeasonalAnimeResponse {
  data: IMalSeasonalAnime[];
  paging: {
    next: string;
  };
  season: {
    year: number;
    season: string;
  };
}

export interface IMalSeasonalAnime {
  node: {
    id: number;
    title: string;
    main_picture: {
      medium: string;
      large: string;
    };
    rank: number;
  };
}

export interface IMalRankingAnimeRequest {
  rankingType:
    | "all"
    | "airing"
    | "upcoming"
    | "tv"
    | "ova"
    | "movie"
    | "special"
    | "bypopularity"
    | "favorite";
}

export interface IMalAnimeDetailsRequest {
  animeId: number;
}

export interface IMalAnimeDetailsResponse {
  id: number;
  title: string;
  main_picture: {
    medium: string;
    large: string;
  };
  alternative_titles: {
    synonyms: string[];
    en: string;
    ja: string;
  };
  start_date?: string;
  synopsis: string;
  mean?: number;
  rank: number;
  popularity: number;
  num_list_users: number;
  num_scoring_users: number;
  nsfw: string;
  created_at: string;
  updated_at: string;
  media_type: string;
  status: string;
  genres: {
    id: number;
    name: string;
  }[];
  num_episodes: number;
  start_season: {
    year: number;
    season: string;
  };
  broadcast: {
    day_of_the_week: string;
    start_time: string;
  };
  source: string;
  average_episode_duration: number;
  rating: string;
  pictures: {
    medium: string;
    large: string;
  }[];
  background: string;
  related_anime: {
    node: {
      id: number;
      title: string;
      main_picture: {
        medium: string;
        large: string;
      };
    };
    relation_type: string;
    relation_type_formatted: string;
  }[];
  related_manga: never[];
  recommendations: {
    node: {
      id: number;
      title: string;
      main_picture: {
        medium: string;
        large: string;
      };
    };
    num_recommendations: number;
  }[];
  studios: {
    id: number;
    name: string;
  }[];
  statistics: {
    status: {
      watching: string;
      completed: string;
      on_hold: string;
      dropped: string;
      plan_to_watch: string;
    };
    num_list_users: number;
  };
}

export interface IMalAnimeSearchRequest {
  q: string;
  limit: number;
}

export interface IMalAnimeSearchResponse {
  data: {
    node: {
      id: number;
      title: string;
      main_picture: {
        medium: string;
        large: string;
      };
      alternative_titles: {
        en?: string;
      };
    };
  }[];
  paging: {
    next: string;
  };
}

export interface IMalUserResponse {
  id: number;
  name: string;
  picture?: string;
}

export enum MalAnimeStatus {
  Watching = "watching",
  Completed = "completed",
  OnHold = "on_hold",
  Dropped = "dropped",
  PlanToWatch = "plan_to_watch",
}

export interface IUserMalAnimeListRequest {
  status?: MalAnimeStatus;
}

export interface IUserMalAnimeListResponse {
  data: IUserMalAnimeList[];
  paging: {
    next?: string;
  };
}

export interface IUserMalAnimeList {
  node: {
    id: number;
    title: string;
    main_picture: {
      medium: string;
      large: string;
    };
  };
}

export interface IUserMalAnimeListUpdateRequest {
  malId: number;
  status: MalAnimeStatus;
}

export interface IGetUserMalAnimeListEntryRequest {
  malId: number;
}

export interface IUserMalAnimeListEntry {
  my_list_status?: {
    status: MalAnimeStatus;
    is_rewatching: boolean;
    num_episodes_watched: number;
    score: number;
  };
}
