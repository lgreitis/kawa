import { app } from "electron";
import { join } from "path";

export const APP_DATA_PATH = join(app.getPath("appData"), "kawa");
export const IS_WINDOWS = process.platform === "win32";
