import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import os from "os";

// Custom APIs for renderer
const api = {};

const platform = os.platform();

const version = process.env.APP_VERSION ?? "dev";

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld("os", platform);
    contextBridge.exposeInMainWorld("version", version);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
  // @ts-expect-error - lazy to define
  window.os = platform;
  window.version = version;
}
