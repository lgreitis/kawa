import { queryClient } from "@renderer/queryClient";
import { useQuery } from "@tanstack/react-query";
import { ONE_DAY_IN_MS } from "@renderer/constants";
import { getAnizipMappings } from "./anizipServices";

export const useAnizipMappingsQuery = (malId: number) =>
  useQuery({
    queryKey: ["anizip", "mappings", malId],
    queryFn: () => getAnizipMappings(malId),
    staleTime: ONE_DAY_IN_MS,
  });

export const anizipMappingsQueryFn = (malId: number) =>
  queryClient.fetchQuery({
    queryKey: ["anizip", "mappings", malId],
    queryFn: () => getAnizipMappings(malId),
    staleTime: ONE_DAY_IN_MS,
  });
