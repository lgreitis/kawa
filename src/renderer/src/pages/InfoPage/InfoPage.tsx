import {
  CalendarIcon,
  ClockIcon,
  PhotoIcon,
  Squares2X2Icon,
  StarIcon,
  ListBulletIcon,
  FilmIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@renderer/components/Badge/Badge";
import { useIdFromMal } from "@renderer/hooks/useIdFromMal";
import { useMalAnimeDetailsQuery } from "@renderer/services/mal/malQueries";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader } from "@renderer/components/Loader/Loader";
import { useKitsuAnimeEpisodesInfiniteQuery } from "@renderer/services/kitsu/kitsuQueries";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { BlurBackgroundContainer } from "@renderer/components/containers/BlurBackgroundContainer";
import { InfoEpisodeListCard } from "./components/InfoEpisodeListCard";
import { InfoEpisodeListBadge } from "./components/InfoEpisodeListBadge";
import { twMerge } from "tailwind-merge";
import { AnimeListStatusSelector } from "./components/AnimeListStatusSelector";
import { toast } from "sonner";
import { MAL_AIR_STATUS_TO_ENGLISH_TRANSLATION } from "@renderer/constants";

export const InfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { malId: malIdString } = useParams<{ malId: string }>();
  const malId = parseInt(malIdString ?? "");
  const { imdbId, kitsuId } = useIdFromMal(malId);
  const [episodesCompressed, setEpisodesCompressed] = useState(false);

  const { ref, inView } = useInView();

  const { data: malData } = useMalAnimeDetailsQuery({ animeId: malId });
  const {
    data: kitsuData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useKitsuAnimeEpisodesInfiniteQuery(kitsuId ?? 0, 20);

  useEffect(() => {
    if (inView) {
      void fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const onPictureButtonClick = () => {
    if (imdbId) {
      window.open(`https://images.metahub.space/background/large/${imdbId}/img`, "_blank");
    }
  };

  const isLoading = !malData || !kitsuData;

  return (
    <BlurBackgroundContainer imdbId={imdbId} isLoading={isLoading}>
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative grid grid-cols-1 flex-row px-6 pt-6 lg:grid-cols-5 lg:gap-8"
        >
          <div className="h-fit w-full flex-grow lg:col-span-3">
            <div className="mb-2">
              <h1 className="text-4xl font-bold">{malData.title}</h1>
              {malData.title !== malData.alternative_titles.en && (
                <h2 className="mb-2 text-lg font-semibold text-neutral-200">
                  {malData.alternative_titles.en}
                </h2>
              )}
            </div>
            <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2">
              {malData.mean && (
                <div className="flex items-center">
                  <StarIcon className="mr-1 h-5 w-5 text-yellow-400" />
                  <span>{malData.mean}/10</span>
                </div>
              )}
              {!!malData.average_episode_duration && (
                <div className="flex items-center">
                  <ClockIcon className="mr-1 h-5 w-5" />
                  <span>{`${Math.round(malData.average_episode_duration / 60)} min per ep`}</span>
                </div>
              )}
              {malData.start_date && (
                <div className="flex items-center">
                  <CalendarIcon className="mr-1 h-5 w-5" />
                  <span>{malData.start_date}</span>
                </div>
              )}
              {malData.status && (
                <div className="flex items-center">
                  <FilmIcon className="mr-1 h-5 w-5" />
                  <span>{MAL_AIR_STATUS_TO_ENGLISH_TRANSLATION[malData.status]}</span>
                </div>
              )}
              <AnimeListStatusSelector malId={malId} />
              {imdbId && (
                <button onClick={onPictureButtonClick} className="flex items-center">
                  <PhotoIcon className="mr-1 h-5 w-5" />
                  <span>View background</span>
                </button>
              )}
            </div>

            <div className="gap mb-6 flex flex-wrap gap-2">
              {malData.genres.map((genre, index) => (
                <Badge key={index}>{genre.name}</Badge>
              ))}
            </div>

            <p className="mb-4 max-w-2xl">{malData.synopsis}</p>

            <p className="mb-6">
              <strong>{"Studio: "}</strong>
              {malData.studios.map((studio) => studio.name).join(", ")}
            </p>

            {!!malData.related_anime.length && (
              <React.Fragment>
                <h3 className="mb-4 mt-3 text-2xl font-semibold">Related anime</h3>
                <div className="grid grid-cols-3 gap-4 overflow-hidden sm:grid-cols-4 2xl:grid-cols-6">
                  {malData.related_anime.slice(0, 7).map((related) => (
                    <button
                      key={related.node.id}
                      className="relative flex flex-col text-left"
                      onClick={() => navigate(`/info/${related.node.id}`)}
                    >
                      <img
                        className="aspect-[2/3] rounded-2xl object-cover"
                        src={related.node.main_picture.medium}
                      />
                      <span className="line-clamp-2">{related.node.title}</span>
                      <span className="text-sm text-zinc-300">
                        {related.relation_type_formatted}
                      </span>
                    </button>
                  ))}
                  {malData.related_anime.length > 7 && (
                    <button
                      className="flex aspect-[2/3] items-center justify-center rounded-2xl bg-black/40"
                      onClick={() => toast.error("Not implemented")}
                    >
                      <span>View more</span>
                    </button>
                  )}
                </div>
              </React.Fragment>
            )}
          </div>

          <div className="flex w-full flex-col lg:col-span-2 lg:max-w-2xl">
            <div className="flex justify-between">
              <h3 className="mb-4 mt-3 text-2xl font-semibold">Episodes</h3>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-md p-1 hover:bg-black/40"
                  onClick={() => setEpisodesCompressed(false)}
                >
                  <ListBulletIcon className="size-5" />
                </button>
                <button
                  className="rounded-md p-1 hover:bg-black/40"
                  onClick={() => setEpisodesCompressed(true)}
                >
                  <Squares2X2Icon className="size-5" />
                </button>
              </div>
            </div>
            <div
              className={twMerge(
                episodesCompressed ? "flex flex-wrap gap-2 pb-4" : "flex flex-col pb-4",
              )}
            >
              {kitsuData.pages.map((page) => (
                <React.Fragment key={page.offset}>
                  {page?.data.map((episode) =>
                    episodesCompressed ? (
                      <InfoEpisodeListBadge key={episode.id} malId={malId} episode={episode} />
                    ) : (
                      <InfoEpisodeListCard key={episode.id} malId={malId} episode={episode} />
                    ),
                  )}
                </React.Fragment>
              ))}
              {hasNextPage && (
                <button ref={ref} onClick={() => fetchNextPage()}>
                  {isFetchingNextPage ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="text-white" /> Loading episodes
                    </div>
                  ) : (
                    <span>Load more</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </BlurBackgroundContainer>
  );
};
