import { Progress } from "@renderer/components/Progress/Progress";
import { useIsEpisodeReleased } from "@renderer/hooks/useIsEpisodeReleased";
import { type IKitsuAnimeEpisode } from "@renderer/services/kitsu/kitsuTypes";
import { useAnimeListEntry } from "@renderer/store/animeListStore";
import { useNavigate } from "react-router-dom";

interface IInfoEpisodeListCardProps {
  malId: number;
  anidbId?: number;
  episode: IKitsuAnimeEpisode;
}

export const InfoEpisodeListCard: React.FC<IInfoEpisodeListCardProps> = (props) => {
  const { malId, episode, anidbId } = props;
  const navigate = useNavigate();
  const animeListEntry = useAnimeListEntry(malId);

  const progress = animeListEntry?.episodes[episode.attributes.number]?.watchProgress;

  const { isEpisodeReleased } = useIsEpisodeReleased(episode.attributes.number, anidbId);

  return (
    <button
      className="relative flex items-center gap-4 rounded-lg p-2 text-left hover:bg-black/30"
      onClick={() => navigate(`/stream/${malId}/${episode.attributes.number}`)}
    >
      <div className="relative aspect-video h-24">
        {episode.attributes.thumbnail ? (
          <img
            className="aspect-video h-24 rounded-lg object-cover"
            src={episode.attributes.thumbnail?.small ?? episode.attributes.thumbnail?.original}
          />
        ) : (
          <div className="aspect-video h-24 rounded-lg bg-black/40"></div>
        )}
        {progress && (
          <div className="absolute bottom-2 z-40 w-full px-4">
            <Progress percent={progress} />
          </div>
        )}
        {/* {(animeListEntry?.watchedEpisodes ?? 0) >= episode.attributes.number && (
          <div className="absolute inset-0 flex w-full items-center justify-center rounded-lg bg-black/40 text-sm font-semibold">
            <span>Watched</span>
          </div>
        )} */}
        {!isEpisodeReleased && (
          <div className="absolute inset-0 flex w-full items-center justify-center rounded-lg bg-black/40 text-sm font-semibold">
            <span>Unreleased</span>
          </div>
        )}
      </div>
      <div className="flex w-full flex-col overflow-hidden">
        <span className="font-medium">
          {episode.attributes.canonicalTitle
            ? `${episode.attributes.number}. ${episode.attributes.canonicalTitle}`
            : `Episode ${episode.attributes.number}`}
        </span>
        <span className="line-clamp-2 text-sm text-neutral-300">
          {episode.attributes.description}
        </span>
      </div>
    </button>
  );
};
