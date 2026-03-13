import { airingScheduleQueryFn } from "../anilist/anilistQueries";
import { type IAiringScheduleVariables } from "../anilist/anilistTypes";
import { userMalAnimeListQueryFn } from "../mal/malQueries";
import { MalAnimeStatus } from "../mal/malTypes";
import { type ScheduledAnimeWithMalId } from "./scheduleTypes";

export const getUserAiringSchedule = async (
  variables: IAiringScheduleVariables,
): Promise<ScheduledAnimeWithMalId[]> => {
  const [{ schedules }, animeList] = await Promise.all([
    airingScheduleQueryFn(variables),
    userMalAnimeListQueryFn({ status: MalAnimeStatus.Watching }),
  ]);

  if (!animeList) {
    return schedules.map((schedule) => ({ ...schedule, malId: undefined }));
  }

  const watchingMalIds = new Set(animeList.data.map((anime) => anime.node.id));

  return schedules
    .filter((schedule) => schedule.media.idMal && watchingMalIds.has(schedule.media.idMal))
    .map((schedule) => ({ ...schedule, malId: schedule.media.idMal }));
};
