import {
  CalendarIcon,
  ClockIcon,
  PhotoIcon,
  StarIcon,
  FilmIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@renderer/components/Badge/Badge";
import React from "react";
import { MAL_AIR_STATUS_TO_ENGLISH_TRANSLATION } from "@renderer/constants";
import { type IMalAnimeDetailsResponse } from "@renderer/services/mal/malTypes";
import { twMerge } from "tailwind-merge";
import { AnimeListStatusSelector } from "./AnimeListStatusSelector";
import { RelatedAnimeSection } from "./RelatedAnimeSection";

interface IInfoPageMainSectionProps {
  malData: IMalAnimeDetailsResponse;
  malId: number;
  imdbId?: string;
  className?: string;
}

export const InfoPageMainSection: React.FC<IInfoPageMainSectionProps> = (props) => {
  const { malData, malId, imdbId, className } = props;

  const onPictureButtonClick = () => {
    if (imdbId) {
      window.open(`https://images.metahub.space/background/large/${imdbId}/img`, "_blank");
    }
  };

  return (
    <div className={twMerge(className)}>
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

      {!!malData.studios.length && (
        <p className="mb-6">
          <strong>{"Studio: "}</strong>
          {malData.studios.map((studio) => studio.name).join(", ")}
        </p>
      )}

      <RelatedAnimeSection malData={malData} />
    </div>
  );
};
