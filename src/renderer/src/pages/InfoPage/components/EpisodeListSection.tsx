import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import React, { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { useAnidbAnimeInfoQuery } from "@renderer/services/anidb/anidbQueries";
import { InfoEpisodeListBadge } from "./InfoEpisodeListBadge";
import { InfoEpisodeListCard } from "./InfoEpisodeListCard";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useAnimeListEntry, useAnimeListStore } from "@renderer/store/animeListStore";

interface IEpisodeListSectionProps {
  malId: number;
  anidbId?: number | null;
  className?: string;
  parent: HTMLDivElement | null;
}

export const EpisodeListSection: React.FC<IEpisodeListSectionProps> = (props) => {
  // eslint-disable-next-line react-compiler/react-compiler
  "use no memo";
  const { malId, anidbId, className, parent } = props;
  const { data: anidbData } = useAnidbAnimeInfoQuery(anidbId ?? 0);
  const animeListEntry = useAnimeListEntry(malId);
  const episodesCompressed = animeListEntry?.showCompressed ?? false;
  const { setShowCompressed } = useAnimeListStore();

  const episodes = useMemo(() => {
    const episodes = anidbData?.anime.episodes?.episode;

    if (!episodes) {
      return [];
    }

    if (Array.isArray(episodes)) {
      return episodes;
    } else {
      return [episodes];
    }
  }, [anidbData]);

  const rowVirtualizer = useVirtualizer({
    count: episodes.length,
    getScrollElement: () => parent,
    estimateSize: () => 112,
    paddingEnd: 16,
    overscan: 40,
    enabled: !episodesCompressed,
  });

  return (
    <div className={twMerge("flex flex-col place-self-end self-start", className)}>
      <div className="flex justify-between">
        <h3 className="mb-4 mt-3 text-2xl font-semibold">Episodes</h3>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md p-1 hover:bg-black/40"
            onClick={() => setShowCompressed(malId, false)}
          >
            <ListBulletIcon className="size-5" />
          </button>
          <button
            className="rounded-md p-1 hover:bg-black/40"
            onClick={() => setShowCompressed(malId, true)}
          >
            <Squares2X2Icon className="size-5" />
          </button>
        </div>
      </div>
      {episodesCompressed && (
        <div className="flex flex-wrap gap-2 pb-4">
          {episodes.map((episode, index) => (
            <InfoEpisodeListBadge key={episode.id} malId={malId} episodeNumber={index + 1} />
          ))}
        </div>
      )}
      {!episodesCompressed && anidbId && (
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
          className={"flex flex-wrap gap-2 pb-4"}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const index = virtualRow.index;
            const episode = episodes[index];

            return (
              <InfoEpisodeListCard
                key={episode.id}
                malId={malId}
                episodeNumber={index + 1}
                anidbId={anidbId}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
