import { useIdFromMal } from "@renderer/hooks/useIdFromMal";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { Carousel } from "@renderer/components/Carousel/Carousel";
import { useMalRankingAnimeQuery } from "@renderer/services/mal/malQueries";
import { motion } from "framer-motion";
import { useHomePageStore } from "@renderer/store/homePageStore";
import { BackgroundImage } from "@renderer/components/BackgroundImage/BackgroundImage";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const { data } = useMalRankingAnimeQuery({ rankingType: "airing" });

  const { currentSlide, setSlide } = useHomePageStore();

  const { imdbId } = useIdFromMal(data?.data[currentSlide].node.id ?? 0);

  if (!data) {
    return (
      <div className="absolute inset-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <BackgroundImage
        imdbId={imdbId}
        className="absolute left-0 top-0 h-dvh w-full select-none overflow-hidden"
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute h-full w-full select-none bg-gradient-to-t from-zinc-900 from-15% to-60% will-change-auto"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 flex w-full"
      >
        <div className="absolute bottom-64 flex w-full items-end justify-between px-4">
          <div className="flex flex-col">
            <span>Top airing anime</span>
            <h1 className="text-4xl font-bold text-white">
              {data.data[currentSlide].node.alternative_titles?.en
                ? data.data[currentSlide].node.alternative_titles.en
                : data.data[currentSlide].node.title}
            </h1>
          </div>
          <div className="flex h-[60px] flex-grow items-center justify-end">
            {imdbId && (
              <button
                className="flex items-center gap-1 rounded-full bg-black/30 px-4 py-2 font-medium text-white backdrop-blur-md transition-colors active:bg-black/50"
                onClick={() => navigate(`/info/${data.data[currentSlide].node.id}`)}
              >
                <PlayIcon className="size-5" />
                Watch
              </button>
            )}
          </div>
        </div>
        <div className="grid h-max grid-flow-col items-end gap-4">
          <Carousel
            containerClassName="pb-2 pl-4"
            slides={data.data.map((anime) => ({
              src: anime.node.main_picture.medium,
              alt: anime.node.title,
            }))}
            options={{ skipSnaps: true }}
            onSlideChange={(index) => {
              setSlide(index);
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};
