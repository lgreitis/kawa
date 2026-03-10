import { resolve } from "path";
import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    resolve: {
      alias: {
        "@shared": resolve("src/shared"),
      },
    },
  },
  preload: {
    resolve: {
      alias: {
        "@shared": resolve("src/shared"),
      },
    },
    build: {
      lib: {
        entry: resolve("src/preload/index.mts"),
      },
    },
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@shared": resolve("src/shared"),
      },
    },
    optimizeDeps: {
      exclude: ["anitomyscript"],
    },
    worker: {
      format: "es",
    },
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler", {}]],
        },
      }),
    ],
  },
});
