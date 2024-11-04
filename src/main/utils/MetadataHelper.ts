import type WebTorrent from "webtorrent";
import Metadata from "matroska-metadata";
import { BrowserWindow } from "electron";

export class MetadataHelper {
  metadata: Metadata;
  videoFile: WebTorrent.TorrentFile;

  constructor(videoFile: WebTorrent.TorrentFile) {
    this.metadata = new Metadata(videoFile);
    this.videoFile = videoFile;

    this.metadata.on("subtitle", (subtitle, trackNumber) => {
      BrowserWindow.getAllWindows()[0].webContents.send("subtitle", { subtitle, trackNumber });
    });

    this.videoFile.on("iterator", ({ iterator }, cb) => {
      // eslint-disable-next-line
      cb(this.metadata.parseStream(iterator));
    });
  }

  getTracks = async () => {
    return this.metadata.getTracks();
  };

  getAttachments = async () => {
    return this.metadata.getAttachments();
  };
}
