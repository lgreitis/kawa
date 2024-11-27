import { Progress } from "@renderer/components/Progress/Progress";
import { useIsEpisodeReleased } from "@renderer/hooks/useIsEpisodeReleased";
import { useAnizipMappingsQuery } from "@renderer/services/anizip/anizipQueries";
import { type IKitsuAnimeEpisode } from "@renderer/services/kitsu/kitsuTypes";
import { useUserMalAnimeListEntryQuery } from "@renderer/services/mal/malQueries";
import { useAnimeListEntry } from "@renderer/store/animeListStore";
import { intlFormat } from "date-fns";
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
  const { data: malUserEntry } = useUserMalAnimeListEntryQuery({ malId });
  const { data: anizipData } = useAnizipMappingsQuery(malId);

  const anizipEpisode = anizipData?.episodes[episode.attributes.number];

  const thumbnail =
    episode.attributes.thumbnail?.small ??
    episode.attributes.thumbnail?.original ??
    anizipEpisode?.image;

  const title =
    episode.attributes.canonicalTitle ?? anizipEpisode?.title.en ?? anizipEpisode?.title.ja;

  const description = episode.attributes.description ?? anizipEpisode?.overview;

  const progress = animeListEntry?.episodes[episode.attributes.number]?.watchProgress;
  const episodeWatchCount = malUserEntry?.my_list_status?.num_episodes_watched ?? 0;

  const { isEpisodeReleased, airdate } = useIsEpisodeReleased(episode.attributes.number, anidbId);

  return (
    <button
      className="relative flex items-center gap-4 rounded-lg p-2 text-left hover:bg-black/30"
      onClick={() => navigate(`/stream/${malId}/${episode.attributes.number}`)}
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
        {episodeWatchCount >= episode.attributes.number && isEpisodeReleased && (
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
          {title
            ? `${episode.attributes.number}. ${title}`
            : `Episode ${episode.attributes.number}`}
        </span>
        <span className="line-clamp-2 text-sm text-neutral-300">{description}</span>
      </div>
    </button>
  );
};
