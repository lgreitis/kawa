export interface ITrack {
  number: number;
  language?: string;
  type: string;
  name: string;
  header: string;
}

export interface IWatchPageState {
  state?: {
    tracks: ITrack[];
    malId: number;
    episodeNumber: number;
  };
}
