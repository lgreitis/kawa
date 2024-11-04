import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import os from "os";

// Custom APIs for renderer
const api = {};

const platform = os.platform();

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld("os", platform);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
  // @ts-expect-error - lazy to define
  window.os = platform;
}
