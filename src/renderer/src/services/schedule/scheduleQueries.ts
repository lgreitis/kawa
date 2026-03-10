import { useQuery } from "@tanstack/react-query";
import { getUserAiringSchedule } from "./scheduleServices";
import { ONE_DAY_IN_MS } from "@renderer/constants";
import { endOfWeek, getUnixTime, startOfWeek } from "date-fns";

export const useUserAiringScheduleQuery = () => {
  const now = new Date();
  const weekStart = getUnixTime(startOfWeek(now, { weekStartsOn: 1 }));
  const weekEnd = getUnixTime(endOfWeek(now, { weekStartsOn: 1 }));

  return useQuery({
    queryKey: ["anilist", "userAiringSchedule", weekStart, weekEnd],
    queryFn: () => getUserAiringSchedule({ weekStart, weekEnd, page: 1 }),
    staleTime: ONE_DAY_IN_MS,
  });
};
