import { useMalAnimeDetailsQuery } from "@renderer/services/mal/malQueries";

export const useMalTitles = (malId: number): string[] => {
  const { data } = useMalAnimeDetailsQuery({ animeId: malId });

  return [data?.title, data?.alternative_titles.en, data?.alternative_titles.ja].filter(
    Boolean,
  ) as string[];
};
