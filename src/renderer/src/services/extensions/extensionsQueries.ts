import { useQuery } from "@tanstack/react-query";
import { getEpisodeFromExtensions } from "./extensionsServices";
import { type IEpisodeParams } from "@lgreitis/kawa-sdk";

export const useGetEpisodeFromExtensionsQuery = (data: IEpisodeParams) =>
  useQuery({
    queryKey: ["extensions", "episode", JSON.stringify(data)],
    queryFn: () => getEpisodeFromExtensions(data),
    enabled: Boolean(data.anidbEid) && Boolean(data.anidbId),
  });
