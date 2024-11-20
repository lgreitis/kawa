import { useQuery } from "@tanstack/react-query";
import { getIdMappingsFromMalId } from "./mappingsServices";
import { ONE_DAY_IN_MS } from "@renderer/constants";
import { queryClient } from "@renderer/queryClient";

export const useIdMappingsFromMalIdQuery = (malId: number) =>
  useQuery({
    queryKey: ["mappings", "malId", malId],
    queryFn: () => getIdMappingsFromMalId(malId),
    staleTime: ONE_DAY_IN_MS,
    enabled: malId !== 0,
  });

export const idMappingsFromMalIdQueryFn = (malId: number) =>
  queryClient.fetchQuery({
    queryKey: ["mappings", "malId", malId],
    queryFn: () => getIdMappingsFromMalId(malId),
    staleTime: ONE_DAY_IN_MS,
  });
