export type TKitsuAnimeMapping = Record<
  string,
  {
    imdb_id?: string;
    tvdb_id?: string;
    fanartLogoId?: string;
    title: string;
    fromSeason?: number;
    fromEpisode?: number;
  }
>;

export interface IGetKitsuAnimeEpisodesResponse {
  data: IKitsuAnimeEpisode[];
  meta: {
    count: number;
  };
  links: {
    first: string;
    next: string;
    last: string;
  };
}

export interface IKitsuAnimeEpisode {
  id: string;
  type: string;
  links: {
    self: string;
  };
  attributes: {
    createdAt: string;
    updatedAt: string;
    synopsis: string;
    description: string;
    titles: {
      en: string;
    };
    canonicalTitle: string;
    seasonNumber: number;
    number: number;
    relativeNumber: null;
    airdate: string;
    length: number;
    thumbnail?: {
      tiny?: string;
      large?: string;
      small?: string;
      medium?: string;
      original: string;
      meta: {
        dimensions: {
          tiny?: {
            width: number;
            height: number;
          };
          large?: {
            width: number;
            height: number;
          };
          small?: {
            width: number;
            height: number;
          };
          medium?: {
            width: number;
            height: number;
          };
        };
      };
    };
  };
  relationships: {
    media: {
      links: {
        self: string;
        related: string;
      };
    };
    videos: {
      links: {
        self: string;
        related: string;
      };
    };
  };
}
