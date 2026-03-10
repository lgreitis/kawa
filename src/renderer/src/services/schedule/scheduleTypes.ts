import { type IScheduledAnime } from "../anilist/anilistTypes";

export type ScheduledAnimeWithMalId = IScheduledAnime & { malId: number | undefined };
