import path from "path";
import WebTorrent from "webtorrent";
import { registerEvent } from "../registerEvent";
import { MetadataHelper } from "../../utils/MetadataHelper";
import { APP_DATA_PATH } from "../../constants";

const downloadsDir = path.join(APP_DATA_PATH, "downloads");
const client = new WebTorrent();
const instance = client.createServer();
// @ts-expect-error - bad types
// eslint-disable-next-line
instance.server.listen(8080);

const findVideoFile = (torrent: WebTorrent.Torrent) => {
  const videoExtensions = [".mkv", ".mp4", ".avi", ".m4v"];

  const videoFiles = torrent.files.filter((file) =>
    videoExtensions.some((ext) => file.name.includes(ext)),
  );

  if (!videoFiles.length) {
    throw new Error("No video files found in torrent");
  }
  if (videoFiles.length > 1) {
    console.warn("Multiple video files found in torrent");
  }

  return videoFiles[0];
};

const addTorrent = (magnetURI: string): Promise<WebTorrent.Torrent> => {
  return new Promise((resolve, _reject) => {
    // @ts-expect-error - bad types
    client.add(magnetURI, { path: downloadsDir, deselect: true }, function (torrent) {
      resolve(torrent);
    });
  });
};

const handleTorrentAdd = async (
  _event: Electron.IpcMainInvokeEvent,
  data: { magnetURI: string; infoHash: string },
) => {
  let torrent: WebTorrent.Torrent | undefined = client.torrents.find(
    (torrent) => torrent.infoHash === data.infoHash,
  );

  if (!torrent) {
    torrent = await addTorrent(data.magnetURI);
  }

  const videoFile = findVideoFile(torrent);
  const metadataHelper = new MetadataHelper(videoFile);
  const tracks = await metadataHelper.getTracks();
  videoFile.select();
  return { streamUrl: `http://localhost:8080${videoFile.streamURL}`, tracks };
};

registerEvent("torrent:sendMagnetURI", handleTorrentAdd);
