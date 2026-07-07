export interface ITrack {
  number: number;
  language?: string;
  type: string;
  name: string;
  header: string;
}

export interface ISubtitleAttachment {
  filename: string;
  mimetype: string;
  data: Uint8Array;
}

export interface IWatchPageState {
  animeTitle: string;
  size?: number;
  videoResolution?: string;
  tracks: ITrack[];
  attachments: ISubtitleAttachment[];
  malId: number;
  episodeNumber: number;
  infoHash: string;
}
