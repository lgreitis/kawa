import { type BrowserWindow } from "electron";
import { registerEvent } from "../registerEvent";

export const registerWindowEvents = (window: BrowserWindow) => {
  const handleWindowClose = () => {
    window.close();
  };

  const handleWindowMinimize = () => {
    window.minimize();
  };

  const handleWindowMaximize = () => {
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  };

  registerEvent("window:close", handleWindowClose);
  registerEvent("window:minimize", handleWindowMinimize);
  registerEvent("window:maximize", handleWindowMaximize);
};
