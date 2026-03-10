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
          native
          english
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        status
        season
        format
        genres
        synonyms
        duration
        popularity
        episodes
        source(version: 2)
        countryOfOrigin
        hashtag
        averageScore
        siteUrl
        description
        bannerImage
        isAdult
        coverImage {
          extraLarge
          color
        }
        trailer {
          id
          site
          thumbnail
        }
        externalLinks {
          site
          icon
          color
          url
        }
        rankings {
          rank
          type
          season
          allTime
        }
        studios(isMain: true) {
          nodes {
            id
            name
            siteUrl
          }
        }
        relations {
          edges {
            relationType(version: 2)
            node {
              id
              title {
                romaji
                native
                english
              }
              siteUrl
            }
          }
        }
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
