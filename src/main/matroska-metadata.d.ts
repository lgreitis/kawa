declare module "matroska-metadata" {
  export type TrackType = "ass";

  export interface Subtitle {
    text: string;
    time: number;
    duration: number;
    layer: string;
    style: string;
    name: string;
    marginL: string;
    marginR: string;
    marginV: string;
    effect: string;
  }

  export default class Metadata {
    constructor(file: WebTorrent.TorrentFile);
    on(event: "subtitle", callback: (subtitle: Subtitle, trackNumber: number) => void): this;
    getTracks(): Promise<
      { number: number; language?: string; type: string; name: string; header: string }[]
    >;
    getAttachments(): Promise<unknown>;
    *parseStream(stream: AsyncIterable<Uint8Array>, stable: boolean = false): Promise<unknown>;
  }
}
