export interface IWatchPageState {
  state?: {
    tracks: { number: number; language?: string; type: string; name: string; header: string }[];
    malId: string;
  };
}
