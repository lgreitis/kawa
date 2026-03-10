import { useQuery } from "@tanstack/react-query";
import { type IAiringScheduleVariables } from "../anilist/anilistTypes";
import { getUserAiringSchedule } from "./scheduleServices";
import { ONE_DAY_IN_MS } from "@renderer/constants";

export const useUserAiringScheduleQuery = (variables: IAiringScheduleVariables) =>
  useQuery({
    queryKey: ["anilist", "userAiringSchedule", variables],
    queryFn: () => getUserAiringSchedule(variables),
    staleTime: ONE_DAY_IN_MS,
  });
