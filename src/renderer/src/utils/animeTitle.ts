import { type AnimeTitleLanguage } from "@renderer/store/preferencesStore";

interface IAnimeTitles {
  romaji: string;
  english?: string | null;
}

export const getPreferredAnimeTitle = (
  titles: IAnimeTitles,
  titleLanguage: AnimeTitleLanguage,
): string => (titleLanguage === "english" ? titles.english || titles.romaji : titles.romaji);

export const getAlternativeAnimeTitle = (
  titles: IAnimeTitles,
  titleLanguage: AnimeTitleLanguage,
): string | undefined => {
  const preferredTitle = getPreferredAnimeTitle(titles, titleLanguage);
  const alternativeTitle =
    titleLanguage === "english" ? titles.romaji : (titles.english ?? undefined);

  return alternativeTitle && alternativeTitle !== preferredTitle ? alternativeTitle : undefined;
};
