import { type IKitsuAnimeEpisode } from "@renderer/services/kitsu/kitsuTypes";
import React from "react";
import { useNavigate } from "react-router-dom";

interface IInfoEpisodeListBadgeProps {
  malId: number;
  episode: IKitsuAnimeEpisode;
}
export const InfoEpisodeListBadge: React.FC<IInfoEpisodeListBadgeProps> = (props) => {
  const { malId, episode } = props;
  const navigate = useNavigate();
  // TODO: watched episode visual indicator
  // const animeListEntry = useAnimeListEntry(malId);

  return (
    <button
      className="size-10 rounded-md bg-black/40"
      onClick={() => navigate(`/stream/${malId}/${episode.attributes.number}`)}
    >
      <span>{episode.attributes.number}</span>
    </button>
  );
};
