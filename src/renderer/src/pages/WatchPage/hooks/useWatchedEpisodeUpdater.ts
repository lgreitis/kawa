import { useUpdateUserMalAnimeList } from "@renderer/services/mal/malMutations";
import { useUserMalAnimeListEntryQuery } from "@renderer/services/mal/malQueries";
import { useEffect, useRef } from "react";
import type Player from "video.js/dist/types/player";

/**
 * Updates the watched episode number in mal on player time update.
 */
export const useWatchedEpisodeUpdater = ({
  malId,
  episodeNumber,
  playerRef,
}: {
  malId: number;
  episodeNumber: number;
  playerRef: React.MutableRefObject<Player | null | undefined>;
}) => {
  const { data: malUserEntry } = useUserMalAnimeListEntryQuery({ malId });
  const { mutateAsync: updateUserAnimeEntry } = useUpdateUserMalAnimeList();

  const isUpdating = useRef(false);

  useEffect(() => {
    // Early return if malUserEntry is not available
    if (!malUserEntry) {
      return;
    }

    // Early return if malId or episodeNumber is 0 or playerRef is not available
    if (malId === 0 || episodeNumber === 0 || !playerRef.current) {
      return;
    }

    // Don't update if the user has already watched the episode
    if ((malUserEntry.my_list_status?.num_episodes_watched ?? 0) >= episodeNumber) {
      return;
    }

    const player = playerRef.current;

    player.on("timeupdate", async () => {
      const currentTime = player.currentTime() ?? 0;
      const duration = player.duration() ?? 0;
      if (duration === 0) return;
      const percentage = (currentTime / duration) * 100;

      // Update the watched episode if the user has watched 90% of the episode
      if (percentage < 90) {
        return;
      }

      // Prevent multiple updates
      if (isUpdating.current) {
        return;
      }

      isUpdating.current = true;

      await updateUserAnimeEntry({ malId: malId, num_watched_episodes: episodeNumber });

      isUpdating.current = false;
    });

    return () => {
      if (player && !player.isDisposed()) {
        player.off("timeupdate");
      }
    };
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [malUserEntry, malId, episodeNumber, playerRef.current]);

  return;
};
