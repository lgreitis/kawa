import { useUpdateUserMalAnimeList } from "@renderer/services/mal/malMutations";
import { useUserMalAnimeListEntryQuery } from "@renderer/services/mal/malQueries";
import { calculatePlayerTime } from "@renderer/utils/utils";
import { useEffect, useRef } from "react";
import type Player from "video.js/dist/types/player";

/**
 * Updates the watched episode number in mal on player time update.
 */
export const useWatchedEpisodeUpdater = ({
  malId,
  episodeNumber,
  player,
}: {
  malId: number;
  episodeNumber: number;
  player: Player | null;
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
    if (malId === 0 || episodeNumber === 0 || !player) {
      return;
    }

    // Don't update if the user has already watched the episode
    if ((malUserEntry.my_list_status?.num_episodes_watched ?? 0) >= episodeNumber) {
      return;
    }

    player.on("timeupdate", async () => {
      const { timePercentage } = calculatePlayerTime(player);

      // Update the watched episode if the user has watched 90% of the episode
      if (timePercentage < 90) {
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
  }, [malUserEntry, malId, episodeNumber, player, updateUserAnimeEntry]);

  return;
};
