import { airingScheduleQueryFn } from "../anilist/anilistQueries";
import { type IAiringScheduleVariables } from "../anilist/anilistTypes";
import { userMalAnimeListQueryFn } from "../mal/malQueries";
import { MalAnimeStatus } from "../mal/malTypes";
import { idMappingsFromMalIdQueryFn } from "../mappings/mappingsQueries";
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

  const results = await Promise.allSettled(
    animeList.data.map(async (anime) => {
      const { anilist } = await idMappingsFromMalIdQueryFn(anime.node.id);
      if (!anilist) return null;

      const matchedSchedule = schedules.find((schedule) => schedule.media.id === anilist);
      return matchedSchedule ? { ...matchedSchedule, malId: anime.node.id } : null;
    }),
  );

  return results
    .filter((r) => r.status === "fulfilled" && r.value !== null)
    .map((r) => (r as PromiseFulfilledResult<ScheduledAnimeWithMalId>).value);
};
