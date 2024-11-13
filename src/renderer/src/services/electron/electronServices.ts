import {
  type IAddExtensionsRequest,
  type IRemoveExtensionsRequest,
  type ISubmitMagnetUriRequest,
} from "./electronTypes";

export const submitMagnetUri = async (data: ISubmitMagnetUriRequest) => {
  const path = (await window.electron.ipcRenderer.invoke("torrent:sendMagnetURI", {
    infoHash: data.infoHash,
    magnetURI: data.magnetURI,
  })) as {
    streamUrl: string;
    tracks: { number: number; language?: string; type: string; name: string; header: string }[];
  };

  return path;
};

const readFileAsString = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error("File reading result is null or undefined."));
      }
    };

    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    reader.onerror = (error) => reject(error);

    reader.readAsText(file);
  });
};

export const addExtension = async (data: IAddExtensionsRequest) => {
  const filesStrings = await Promise.all(data.extensions.map(readFileAsString));

  await window.electron.ipcRenderer.invoke("extensionAdd", {
    files: data.extensions.map((file, index) => ({
      fileName: file.name,
      content: filesStrings[index],
    })),
  });
};

export const getExtensions = async () => {
  const response = (await window.electron.ipcRenderer.invoke("extensionsGet")) as {
    extensions: { name: string; code: string }[];
  };

  return response;
};

export const removeExtension = async (data: IRemoveExtensionsRequest) => {
  await window.electron.ipcRenderer.invoke("extensionRemove", data);
};

export const startMalAuthStart = async () => {
  await window.electron.ipcRenderer.invoke("malAuthStart");
};

export const getDownloadFolderSize = async () => {
  const response = (await window.electron.ipcRenderer.invoke("torrent:downloadsSize")) as number;

  return response;
};

export const removeAllDownloads = async () => {
  const response = (await window.electron.ipcRenderer.invoke("torrent:removeAllDownloads")) as void;

  return response;
};
