import { ipcMain } from "electron";

export const registerEvent = <DataType, ReturnType>(
  name: string,
  listener: (event: Electron.IpcMainInvokeEvent, data: DataType) => ReturnType,
) => {
  ipcMain.handle(name, async (event: Electron.IpcMainInvokeEvent, data: DataType) => {
    return Promise.resolve(listener(event, data)).then((result) => {
      if (!result) return result;
      return JSON.parse(JSON.stringify(result)) as ReturnType;
    });
  });
};
