import { ScrollArea } from "@renderer/components/ScrollArea/ScrollArea";
import { Schedule } from "@renderer/components/Schedule/Schedule";
import { HomePageCarousel } from "@renderer/components/HomePageCarousel/HomePageCarousel";

export const HomePage: React.FC = () => {
  return (
    <div className="relative h-full">
      <ScrollArea
        className="h-dvh w-full"
        scrollbarClassName="mt-[2.25rem] bg-black/30 backdrop-blur-md"
        hideScrollbar
      >
        <HomePageCarousel />
        <Schedule />
      </ScrollArea>
    </div>
  );
};
