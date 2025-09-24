import { BlurBackgroundContainer } from "@renderer/components/containers/BlurBackgroundContainer";
import { MalAnimeStatus } from "@renderer/services/mal/malTypes";
import { useUserMalAnimeList } from "@renderer/services/mal/malQueries";
import { useState } from "react";
import { MAL_STATUS_TO_ENGLISH_TRANSLATION } from "@renderer/constants";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader } from "@renderer/components/Loader/Loader";
import { Tabs } from "@renderer/components/Tabs/Tabs";

export const AnimeListPage: React.FC = () => {
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState(MalAnimeStatus.Watching);
  const { data: malList, isLoading } = useUserMalAnimeList({ status: selectedStatus });
  const [filter, setFilter] = useState("");

  const filteredList = malList?.data.filter((anime) =>
    anime.node.title.toLowerCase().includes(filter.toLowerCase()),
  );

  const statuses = Object.values(MalAnimeStatus);

  return (
    <BlurBackgroundContainer>
      <div className="flex flex-col items-center">
        <div className="flex w-full max-w-5xl flex-col gap-2 px-4 pb-4">
          <div className="sticky top-0 flex flex-col items-center gap-4 bg-zinc-900 py-4 md:flex-row">
            <input
              className="h-10 flex-grow rounded-md border border-zinc-600 bg-transparent px-2 py-1 focus:outline-zinc-400"
              placeholder="Search anime..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <div className="rounded-md bg-zinc-800 p-1">
              <Tabs
                tabs={statuses.map((status) => ({
                  title: MAL_STATUS_TO_ENGLISH_TRANSLATION[status],
                  value: status,
                }))}
                currentValue={selectedStatus}
                onChange={(tab) => setSelectedStatus(tab.value as MalAnimeStatus)}
              />
            </div>
          </div>
          {!isLoading ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-5">
              {filteredList?.map((anime, index) => (
                <motion.div
                  key={anime.node.id}
                  className="flex h-full w-full cursor-pointer flex-col gap-2"
                  initial={index < 4 * 6 ? { opacity: 0, y: 64 } : false}
                  animate={index < 4 * 6 ? { opacity: 1, y: 0 } : false}
                  transition={{ duration: 0.3, delay: 0.03 * index }}
                  onClick={() => navigate(`/info/${anime.node.id}`)}
                >
                  <img
                    className="aspect-[2/3] overflow-hidden rounded-2xl object-cover"
                    src={anime.node.main_picture.large}
                  />
                  <span className="line-clamp-2">
                    {anime.node.alternative_titles?.en ?? anime.node.title}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center">
              <Loader className="text-white" />
            </div>
          )}
        </div>
      </div>
    </BlurBackgroundContainer>
  );
};
