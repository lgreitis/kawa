export interface IAiringScheduleVariables {
  weekStart: number;
  weekEnd: number;
  page: number;
}

export interface IAiringScheduleResponse {
  Page: {
    pageInfo: { hasNextPage: boolean; total: number };
    airingSchedules: Array<{
      id: number;
      episode: number;
      airingAt: number;
      media: {
        id: number;
        idMal: number;
        title: {
          romaji: string;
          english: string | null;
        };
      };
    }>;
  };
}

export interface IAnimeDetailsResponse {
  schedules: IScheduledAnime[];
}

export interface IScheduledAnime {
  id: number;
  episode: number;
  airingAt: number;
  media: {
    id: number;
    idMal: number;
    title: {
      romaji: string;
      english: string | null;
    };
  };
}
