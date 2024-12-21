import { BlurBackgroundContainer } from "@renderer/components/containers/BlurBackgroundContainer";
import { useIdFromMal } from "@renderer/hooks/useIdFromMal";
import { useAnidbAnimeInfoQuery } from "@renderer/services/anidb/anidbQueries";
import { useSubmitMagnetUriMutation } from "@renderer/services/electron/electronMutations";
import { useGetEpisodeFromExtensionsQuery } from "@renderer/services/extensions/extensionsQueries";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StreamButton } from "./components/StreamButton";
import { motion } from "framer-motion";
import { useIsMounted } from "usehooks-ts";
import { useMalTitles } from "@renderer/hooks/useMalTitles";

type TStreamPageParams = {
  malId: string;
  episode: string;
};

export const StreamPage: React.FC = () => {
  const { malId: malIdString, episode: episodeString } = useParams<TStreamPageParams>();
  const navigate = useNavigate();
  const isMounted = useIsMounted();

  const episode = parseInt(episodeString ?? "-1");
  const malId = parseInt(malIdString ?? "0");

  const { anidbId, imdbId, anilistId } = useIdFromMal(malId);

  const titles = useMalTitles(malId);
  const { data: anidbData, isLoading: isAnidbDataLoading } = useAnidbAnimeInfoQuery(anidbId ?? 0);

  const anidbEid = useMemo(() => {
    const episodes = anidbData?.anime.episodes?.episode;

    if (!episodes) {
      return undefined;
    }

    if (Array.isArray(episodes)) {
      return episodes.find((ep) => ep.epno["#text"] === episode && ep.epno.type === 1)?.id;
    } else {
      return episodes?.epno["#text"] === episode && episodes?.epno.type === 1
        ? episodes.id
        : undefined;
    }
  }, [anidbData, episode]);

  const { data, isLoading } = useGetEpisodeFromExtensionsQuery({
    anidbId: anidbId ?? 0,
    anidbEid: anidbEid ?? 0,
    anilistId: anilistId ?? 0,
    titles: titles,
  });

  const { mutateAsync, isPending } = useSubmitMagnetUriMutation();

  const dataExists = data && data.results.length > 0 && data.best;

  return (
    <BlurBackgroundContainer
      imdbId={imdbId}
      isLoading={isAnidbDataLoading || isLoading || isPending}
      darkenLoader={isPending}
    >
      <motion.div
        className="flex h-full items-center justify-center"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {dataExists ? (
          <div className="flex w-full max-w-4xl flex-col gap-4 p-4">
            <h1 className="text-2xl font-medium">Best Source:</h1>
            {data?.best && (
              <StreamButton
                disabled={isPending}
                data={data.best}
                onClick={async () => {
                  const mutationResult = await mutateAsync({
                    magnetURI: data?.best.magnet,
                    infoHash: data.best.infoHash,
                  });

                  const watchPageState = {
                    tracks: mutationResult.tracks,
                    malId: malId,
                    episodeNumber: episode,
                  };

                  if (!isMounted()) {
                    return;
                  }

                  navigate(`/watch/${btoa(mutationResult.streamUrl)}`, {
                    state: watchPageState,
                    replace: true,
                  });
                }}
              />
            )}
            <h1 className="text-2xl font-medium">Other Sources:</h1>
            {data?.results.map((stream) => (
              <StreamButton
                disabled={isPending}
                key={stream.title}
                data={stream}
                onClick={async () => {
                  const mutationResult = await mutateAsync({
                    magnetURI: stream.magnet,
                    infoHash: stream.infoHash,
                  });

                  const watchPageState = {
                    tracks: mutationResult.tracks,
                    malId: malId,
                    episodeNumber: episode,
                  };

                  navigate(`/watch/${btoa(mutationResult.streamUrl)}`, {
                    state: watchPageState,
                    replace: true,
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <h1 className="text-2xl font-medium">Failed to find any sources for this episode.</h1>
          </div>
        )}
      </motion.div>
    </BlurBackgroundContainer>
  );
};
