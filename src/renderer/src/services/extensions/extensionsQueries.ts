import { useQuery } from "@tanstack/react-query";
import { getEpisodeFromExtensions } from "./extensionsServices";
import { type IEpisodeParams } from "@lgreitis/kawa-sdk";
import { useExtensionStore } from "@renderer/store/extensionStore";
import { ONE_HOUR_IN_MS } from "@renderer/constants";

export const useGetEpisodeFromExtensionsQuery = (data: IEpisodeParams) => {
  const { sources } = useExtensionStore();

  const sourceNames = sources.map((source) => source.name).join(",");

  return useQuery({
    queryKey: ["extensions", "episode", JSON.stringify(data), sourceNames],
    queryFn: () => getEpisodeFromExtensions(data),
    enabled: Boolean(data.anidbEid) && Boolean(data.anidbId),
    staleTime: ONE_HOUR_IN_MS,
  });
};
