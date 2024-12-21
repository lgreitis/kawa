import { type IEpisodeResult, type IEpisodeParams } from "@lgreitis/kawa-sdk";
import { DEFAULT_EXTENSIONS } from "@renderer/constants";
import { useExtensionStore } from "@renderer/store/extensionStore";
import anitomyscript, { type AnitomyResult } from "anitomyscript";
import axios from "axios";
import { type IExtension } from "./extensionsTypes";

export interface IEpisodeServiceResult extends IEpisodeResult {
  fileName: string;
  releaseGroup?: string;
  videoResolution?: string;
  source: string;
}

export const getEpisodeFromExtensions = async (data: IEpisodeParams) => {
  // TODO: actually implement best algo
  let best: IEpisodeServiceResult | undefined = undefined;
  const results: IEpisodeServiceResult[] = [];
  const sources = useExtensionStore.getState().sources;

  for (const source of sources) {
    try {
      if (!source.importedModule) {
        continue;
      }

      const sourceResults = await source.importedModule.episode(data);

      const anitomyResults = (await anitomyscript(
        sourceResults.map((r) => r.title),
      )) as AnitomyResult[];

      sourceResults.forEach((r, i) => {
        const anitomy = anitomyResults[i];

        results.push({
          ...r,
          fileName: anitomy.file_name,
          releaseGroup: anitomy.release_group,
          videoResolution: anitomy.video_resolution,
          source: source.info?.name ?? "",
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  results.sort((a, b) => b.seeders - a.seeders);
  best = results[0];
  results.shift();

  return { results, best };
};

export const getDefaultExtensions = async (): Promise<IExtension[]> => {
  const extensionPromises = DEFAULT_EXTENSIONS.extensions.map((extension) =>
    axios.get<string>(extension),
  );

  const extensionsResponses = await Promise.allSettled(extensionPromises);

  const extensions: IExtension[] = [];

  for (const extension of extensionsResponses) {
    if (extension.status === "fulfilled") {
      extensions.push({
        name: btoa(extension.value.config.url ?? "") + ".js",
        code: extension.value.data,
      });
    }
  }

  return extensions;
};
