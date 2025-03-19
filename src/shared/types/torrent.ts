export interface ITorrentStatus {
  infoHash: string;
  downloadSpeed: number;
  uploadSpeed: number;
  peerCount: number;
  progress: number
}
