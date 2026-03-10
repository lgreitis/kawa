import { ONE_DAY_IN_MS } from "@renderer/constants";
import { getAiringSchedule } from "./anilistServices";
import { type IAiringScheduleVariables } from "./anilistTypes";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@renderer/queryClient";

export const useAiringScheduleQuery = (variables: IAiringScheduleVariables) =>
  useQuery({
    queryKey: ["anilist", "airingSchedule", variables],
    queryFn: () => getAiringSchedule(variables),
    staleTime: ONE_DAY_IN_MS,
  });

export const airingScheduleQueryFn = (variables: IAiringScheduleVariables) =>
  queryClient.fetchQuery({
    queryKey: ["anilist", "airingSchedule", variables],
    queryFn: () => getAiringSchedule(variables),
    staleTime: ONE_DAY_IN_MS,
  });
