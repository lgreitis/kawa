import path from "path";
import WebTorrent from "webtorrent";
import { registerEvent } from "../registerEvent";
import { MetadataHelper } from "../../utils/MetadataHelper";
import { APP_DATA_PATH, TORRENT_CONTENT_LISTEN_PORT } from "../../constants";
import fs from "fs";
import { readdir, stat, unlink } from "fs/promises";

const downloadsDir = path.join(APP_DATA_PATH, "downloads");
const client = new WebTorrent();
const instance = client.createServer();
// @ts-expect-error - bad types
// eslint-disable-next-line
instance.server.listen(TORRENT_CONTENT_LISTEN_PORT);

const addDownloadsDirIfDoesntExist = async () => {
  try {
    await fs.promises.access(downloadsDir);
  } catch {
    await fs.promises.mkdir(downloadsDir, { recursive: true });
  }
};

const findVideoFile = (torrent: WebTorrent.Torrent) => {
  const videoExtensions = [".mkv", ".mp4", ".avi", ".m4v"];

  const videoFiles = torrent.files.filter((file) =>
    videoExtensions.some((ext) => file.name.includes(ext)),
  );

  if (!videoFiles.length) {
    console.log(torrent.files);
    throw new Error("No video files found in torrent");
  }
  if (videoFiles.length > 1) {
    console.warn("Multiple video files found in torrent");
  }

  return videoFiles[0];
};

const addTorrent = (magnetURI: string): Promise<WebTorrent.Torrent> => {
  return new Promise((resolve, _reject) => {
    client.add(
      magnetURI,
      {
        path: downloadsDir,
        // @ts-expect-error - bad types
        deselect: true,
        announce: [atob("aHR0cDovL255YWEudHJhY2tlci53Zjo3Nzc3L2Fubm91bmNl")],
      },
      function (torrent) {
        resolve(torrent);
      },
    );
  });
};

const pauseOtherTorrents = (torrent: WebTorrent.Torrent) => {
  for (const otherTorrent of client.torrents) {
    if (otherTorrent !== torrent) {
      otherTorrent.pause();
    }
  }
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

  pauseOtherTorrents(torrent);
  torrent.resume();

  if (!torrent.ready) {
    await new Promise<void>((resolve, _reject) => {
      torrent.on("ready", () => {
        resolve();
      });
    });
  }

  const videoFile = findVideoFile(torrent);
  const metadataHelper = new MetadataHelper(videoFile);
  const tracks = await metadataHelper.getTracks();
  videoFile.select();

  return {
    streamUrl: `http://localhost:${TORRENT_CONTENT_LISTEN_PORT}${videoFile.streamURL}`,
    tracks,
  };
};

const getDownloadFolderSize = async () => {
  await addDownloadsDirIfDoesntExist();

  const files = await readdir(downloadsDir);
  const stats = files.map((file) => stat(path.join(downloadsDir, file)));
  const size = (await Promise.all(stats)).reduce((accumulator, { size }) => accumulator + size, 0);

  return size;
};

const removeAllDownloads = async () => {
  for (const torrent of client.torrents) {
    await new Promise<void>((resolve, _reject) => {
      client.remove(torrent, { destroyStore: true }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        resolve();
      });
    });
  }

  const files = await readdir(downloadsDir);

  for (const file of files) {
    await unlink(path.join(downloadsDir, file));
  }

  return;
};

registerEvent("torrent:sendMagnetURI", handleTorrentAdd);
registerEvent("torrent:downloadsSize", getDownloadFolderSize);
registerEvent("torrent:removeAllDownloads", removeAllDownloads);
