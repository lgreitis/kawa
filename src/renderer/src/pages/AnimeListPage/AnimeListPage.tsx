import { BlurBackgroundContainer } from "@renderer/components/containers/BlurBackgroundContainer";
import { AnimeListStatusList } from "./components/AnimeListStatusList";
import { MalAnimeStatus } from "@renderer/services/mal/malTypes";
import { useUserMalAnimeList } from "@renderer/services/mal/malQueries";

export const AnimeListPage: React.FC = () => {
  const { isLoading } = useUserMalAnimeList({ status: MalAnimeStatus.Watching });

  return (
    <BlurBackgroundContainer isLoading={isLoading}>
      <div className="flex flex-col items-center">
        <AnimeListStatusList status={MalAnimeStatus.Watching} title="Watching" isFirst />
        <AnimeListStatusList status={MalAnimeStatus.Completed} title="Completed" />
        <AnimeListStatusList status={MalAnimeStatus.Dropped} title="Dropped" />
        <AnimeListStatusList status={MalAnimeStatus.OnHold} title="On Hold" />
        <AnimeListStatusList status={MalAnimeStatus.PlanToWatch} title="Plan To Watch" />
      </div>
    </BlurBackgroundContainer>
  );
};
