import { gqlFetch } from "@renderer/utils/utils";
import {
  type IAnimeDetailsResponse,
  type IAiringScheduleResponse,
  type IAiringScheduleVariables,
} from "./anilistTypes";

const AIRING_SCHEDULE_QUERY = `
query ($weekStart: Int, $weekEnd: Int, $page: Int) {
  Page(page: $page) {
    pageInfo {
      hasNextPage
      total
    }
    airingSchedules(
      airingAt_greater: $weekStart
      airingAt_lesser: $weekEnd
    ) {
      id
      episode
      airingAt
      media {
        id
        idMal
        title {
          romaji
          english
        }
        episodes
      }
    }
  }
}
`;

export const getAiringSchedule = async (
  variables: IAiringScheduleVariables,
): Promise<IAnimeDetailsResponse> => {
  let page = 1;
  let hasNextPage = true;
  const allSchedules: IAiringScheduleResponse["Page"]["airingSchedules"] = [];

  while (hasNextPage) {
    const data = await gqlFetch<IAiringScheduleResponse, IAiringScheduleVariables>(
      "https://graphql.anilist.co",
      AIRING_SCHEDULE_QUERY,
      { ...variables, page },
    );

    allSchedules.push(...data.Page.airingSchedules);
    hasNextPage = data.Page.pageInfo.hasNextPage;
    page++;
  }

  return {
    schedules: allSchedules,
  };
};
