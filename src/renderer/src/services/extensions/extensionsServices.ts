import { type IEpisodeResult, type IEpisodeParams } from "@lgreitis/kawa-sdk";
import { useExtensionStore } from "@renderer/store/extensionStore";
import anitomyscript, { type AnitomyResult } from "anitomyscript";

export interface IEpisodeServiceResult extends IEpisodeResult {
  fileName: string;
  releaseGroup?: string;
  videoResolution?: string;
}

export const getEpisodeFromExtensions = async (data: IEpisodeParams) => {
  // TODO: actually implement best algo
  let best: IEpisodeServiceResult | undefined = undefined;
  const results: IEpisodeServiceResult[] = [];
  const sources = useExtensionStore.getState().sources;

  for await (const source of sources) {
    try {
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
