export interface ISubmitMagnetUriRequest {
  infoHash: string;
  magnetURI: string;
}

export interface IAddExtensionsRequest {
  extensions: File[];
}
export interface IRemoveExtensionsRequest {
  name: string;
}
