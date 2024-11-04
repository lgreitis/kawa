import { useUserMalAnimeList } from "@renderer/services/mal/malQueries";
import { type MalAnimeStatus } from "@renderer/services/mal/malTypes";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface IAnimeListStatusListProps {
  status: MalAnimeStatus;
  title: string;
  isFirst?: boolean;
}

export const AnimeListStatusList: React.FC<IAnimeListStatusListProps> = (props) => {
  const { status, title, isFirst } = props;
  const navigate = useNavigate();
  const { data: malList, isLoading } = useUserMalAnimeList({ status });

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="sticky top-0 z-20 flex w-full justify-center bg-zinc-900/70 backdrop-blur-lg">
        <div className="w-full max-w-5xl px-4">
          <h1 className="pb-2 pt-2 text-3xl font-semibold">{title}</h1>
        </div>
      </div>
      <div className="w-full max-w-5xl px-4 py-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 lg:grid-cols-5">
          {malList?.data.map((anime, index) => (
            <motion.div
              key={anime.node.id}
              className="flex h-full w-full cursor-pointer flex-col gap-2"
              initial={index < 5 * 6 && isFirst ? { opacity: 0, y: 48 } : false}
              animate={index < 5 * 6 && isFirst ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.2, delay: 0.03 * index }}
              onClick={() => navigate(`/info/${anime.node.id}`)}
            >
              <img
                className="aspect-[2/3] overflow-hidden rounded-2xl object-cover"
                src={anime.node.main_picture.large}
              />
              <span className="line-clamp-2">{anime.node.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
