import { app, shell, BrowserWindow, protocol } from "electron";
import path, { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import { registerWindowEvents } from "./events/window/windowEvents";
import { handleMalAuthCallback } from "./events/mal/malEvents";
import { IS_WINDOWS } from "./constants";
import fs from "node:fs";

const pickRendererAssetsDir = (): string => {
  const packaged = path.join(process.resourcesPath, "renderer-assets");
  if (app.isPackaged) return packaged;

  const dev = path.join(process.cwd(), "resources", "renderer-assets");
  return dev;
};

const contentTypeFor = (filePath: string): string => {
  if (filePath.endsWith(".woff2")) return "font/woff2";
  if (filePath.endsWith(".woff")) return "font/woff";
  if (filePath.endsWith(".ttf")) return "font/ttf";
  if (filePath.endsWith(".otf")) return "font/otf";
  if (filePath.endsWith(".wasm")) return "application/wasm";
  return "application/octet-stream";
};

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("kawa", process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient("kawa");
}

const handleUrl = (url: string) => {
  const parsedUrl = new URL(url);

  if (parsedUrl.hostname === "mal-auth") {
    void handleMalAuthCallback(url);
  }
};

let mainWindow: BrowserWindow | null;

function createMainWindow(): BrowserWindow {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1600 - 35 * 2, // We make it a bit smaller by default to make 16:9 videos fill completely and look nicer
    height: 900,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false,
      webSecurity: false,
    },
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 10, y: 10 },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    void shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    void mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return mainWindow;
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  void app.whenReady().then(async () => {
    // Set app user model id for windows
    electronApp.setAppUserModelId("com.lukasgreicius.kawa");

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });

    createMainWindow();

    mainWindow?.on("closed", () => {
      mainWindow = null;
    });

    app.on("second-instance", (_event, argv, _workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }

      // TODO: test Linux maybe it also needs this
      if (IS_WINDOWS) {
        const url = argv.find((arg) => arg.startsWith("kawa://"));
        if (url) {
          handleUrl(url);
        }
      }
    });

    if (mainWindow) {
      registerWindowEvents(mainWindow);
    }

    const assetsDir = pickRendererAssetsDir();

    protocol.handle("kawa", async (request) => {
      const prefix = "kawa://assets/";
      const rel = decodeURIComponent(request.url.slice(prefix.length));

      if (!request.url.startsWith(prefix) || rel.includes("..") || rel.startsWith("/")) {
        return new Response("Forbidden", { status: 403 });
      }

      const filePath = path.join(assetsDir, rel);

      try {
        const data = await fs.promises.readFile(filePath);
        return new Response(new Uint8Array(data), {
          headers: {
            "content-type": contentTypeFor(filePath),
            "content-length": data.length.toString(),
          },
        });
      } catch (e) {
        console.error("[kawa] asset missing:", filePath, e);
        return new Response("Not found", { status: 404 });
      }
    });

    void import("./events");
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

app.on("open-url", (_event, url) => {
  handleUrl(url);
});

export const sendIpcData = async (dataType: string, data: unknown) => {
  mainWindow?.webContents.send(dataType, data);
};
