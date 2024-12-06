import { app } from "electron";
import { join } from "path";

export const APP_DATA_PATH = join(app.getPath("appData"), "kawa");
export const IS_WINDOWS = process.platform === "win32";
export const TORRENT_CONTENT_LISTEN_PORT = 5292;
