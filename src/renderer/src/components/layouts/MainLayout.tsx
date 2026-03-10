import { TitleBar } from "../TitleBar/TitleBar";
import { MainLoader } from "../MainLoader/MainLoader";
import { useExtensionLoader } from "@renderer/hooks/useExtensionLoader";
import { Outlet } from "react-router-dom";
import { useMalRankingAnimeQuery } from "@renderer/services/mal/malQueries";
import { useUserAiringScheduleQuery } from "@renderer/services/schedule/scheduleQueries";

export const MainLayout: React.FC = () => {
  const { isLoading: isExtensionLoading } = useExtensionLoader();
  const { isLoading: isMalLoading } = useMalRankingAnimeQuery({ rankingType: "airing" });
  const { isLoading: isScheduleLoading } = useUserAiringScheduleQuery();

  const loaders = [isExtensionLoading, isMalLoading, isScheduleLoading];
  const isLoading = loaders.some(Boolean);
  const progress = Math.round((loaders.filter((l) => !l).length / loaders.length) * 100);

  return (
    <div className="relative">
      <TitleBar />
      <MainLoader isLoading={isLoading} progress={progress}>
        <main className="h-dvh overflow-auto">
          <Outlet />
        </main>
      </MainLoader>
    </div>
  );
};
