import { useIdFromMal } from "@renderer/hooks/useIdFromMal";
import { useMalAnimeDetailsQuery } from "@renderer/services/mal/malQueries";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { BlurBackgroundContainer } from "@renderer/components/containers/BlurBackgroundContainer";
import { useAnidbAnimeInfoQuery } from "@renderer/services/anidb/anidbQueries";
import { EpisodeListSection } from "./components/EpisodeListSection";
import { InfoPageMainSection } from "./components/InfoPageMainSection";

export const InfoPage: React.FC = () => {
  const { malId: malIdString } = useParams<{ malId: string }>();
  const malId = parseInt(malIdString ?? "");
  const { imdbId, anidbId } = useIdFromMal(malId);
  const { isLoading: isAnidbDataLoading } = useAnidbAnimeInfoQuery(anidbId ?? 0);
  const { data: malData } = useMalAnimeDetailsQuery({ animeId: malId });

  const isLoading = !malData || isAnidbDataLoading || anidbId === undefined;

  const [parent, setParent] = useState<HTMLDivElement | null>(null);

  const refCallback = (node: HTMLDivElement) => {
    setParent(node);
  };

  return (
    <BlurBackgroundContainer imdbId={imdbId} isLoading={isLoading} ref={refCallback}>
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative grid grid-cols-1 flex-row px-6 pt-6 lg:grid-cols-5 lg:gap-8"
        >
          <InfoPageMainSection
            className="h-fit w-full flex-grow lg:col-span-3"
            malData={malData}
            malId={malId}
            imdbId={imdbId}
          />
          <EpisodeListSection
            className="w-full lg:col-span-2 lg:max-w-2xl"
            malId={malId}
            anidbId={anidbId}
            parent={parent}
          />
        </motion.div>
      )}
    </BlurBackgroundContainer>
  );
};
