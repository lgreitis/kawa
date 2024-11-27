import { useUserMalAnimeListEntryQuery } from "@renderer/services/mal/malQueries";
import React from "react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface IInfoEpisodeListBadgeProps {
  malId: number;
  episodeNumber: number;
}

export const InfoEpisodeListBadge: React.FC<IInfoEpisodeListBadgeProps> = (props) => {
  const { malId, episodeNumber } = props;
  const navigate = useNavigate();

  const { data: malUserEntry } = useUserMalAnimeListEntryQuery({ malId });
  const episodeWatchCount = malUserEntry?.my_list_status?.num_episodes_watched ?? 0;

  return (
    <button
      className={twMerge(
        "size-10 rounded-md bg-black/40",
        episodeWatchCount >= episodeNumber && "bg-white/10",
      )}
      onClick={() => navigate(`/stream/${malId}/${episodeNumber}`)}
    >
      <span>{episodeNumber}</span>
    </button>
  );
};
