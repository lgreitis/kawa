import { type ISubtitleAttachment, type ITrack } from "@renderer/types/watchPageTypes";

export interface ISubmitMagnetUriRequest {
  infoHash: string;
  magnetURI: string;
}

export interface IStreamResponse {
  streamUrl: string;
  tracks: ITrack[];
  attachments: ISubtitleAttachment[];
}

export interface IAddExtensionsRequest {
  extensions: File[];
}
export interface IRemoveExtensionsRequest {
  name: string;
}
