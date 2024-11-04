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
    tracks: {
      number: number;
      language?: string;
      type: string;
      TrackType: string;
      header: string;
    }[];
  };

  return path;
};

export const addExtension = async (data: IAddExtensionsRequest) => {
  await window.electron.ipcRenderer.invoke("extensionAdd", {
    paths: data.extensions.map((file) => file.path),
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
