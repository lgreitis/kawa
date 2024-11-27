import { Progress } from "@renderer/components/Progress/Progress";
import { useIsEpisodeReleased } from "@renderer/hooks/useIsEpisodeReleased";
import { useAnizipMappingsQuery } from "@renderer/services/anizip/anizipQueries";
import { useUserMalAnimeListEntryQuery } from "@renderer/services/mal/malQueries";
import { useAnimeListEntry } from "@renderer/store/animeListStore";
import { intlFormat } from "date-fns";
import { useNavigate } from "react-router-dom";

interface IInfoEpisodeListCardProps {
  malId: number;
  anidbId?: number;
  episodeNumber: number;
  style?: React.CSSProperties;
}

export const InfoEpisodeListCard: React.FC<IInfoEpisodeListCardProps> = (props) => {
  const { malId, anidbId, episodeNumber, style } = props;
  const navigate = useNavigate();
  const animeListEntry = useAnimeListEntry(malId);
  const { data: malUserEntry } = useUserMalAnimeListEntryQuery({ malId });
  const { data: anizipData } = useAnizipMappingsQuery(malId);

  const anizipEpisode = anizipData?.episodes[episodeNumber];

  const thumbnail = anizipEpisode?.image;
  const title = anizipEpisode?.title.en ?? anizipEpisode?.title["x-jat"];
  const description = anizipEpisode?.overview;
  const progress = animeListEntry?.episodes[episodeNumber]?.watchProgress;
  const episodeWatchCount = malUserEntry?.my_list_status?.num_episodes_watched ?? 0;

  const { isEpisodeReleased, airdate } = useIsEpisodeReleased(episodeNumber, anidbId);

  return (
    <button
      className="relative flex items-center gap-4 rounded-lg p-2 text-left hover:bg-black/30"
      onClick={() => navigate(`/stream/${malId}/${episodeNumber}`)}
      style={style}
    >
      <div className="relative aspect-video h-24">
        {thumbnail ? (
          <img className="aspect-video h-24 rounded-lg object-cover" src={thumbnail} />
        ) : (
          <div className="aspect-video h-24 rounded-lg bg-black/40"></div>
        )}
        {progress && (
          <div className="absolute bottom-2 z-40 w-full px-4">
            <Progress percent={progress} />
          </div>
        )}
        {episodeWatchCount >= episodeNumber && isEpisodeReleased && (
          <div className="absolute inset-0 flex w-full items-center justify-center rounded-lg bg-black/40 text-sm font-semibold">
            <span>Watched</span>
          </div>
        )}
        {!isEpisodeReleased && (
          <div className="absolute inset-0 flex w-full items-center justify-center rounded-lg bg-black/40 text-sm font-semibold">
            <span>{airdate ? intlFormat(airdate) : "Unreleased"}</span>
          </div>
        )}
      </div>
      <div className="flex w-full flex-col overflow-hidden">
        <span className="font-medium">
          {title ? `${episodeNumber}. ${title}` : `Episode ${episodeNumber}`}
        </span>
        <span className="line-clamp-2 text-sm text-neutral-300">{description}</span>
      </div>
    </button>
  );
};
