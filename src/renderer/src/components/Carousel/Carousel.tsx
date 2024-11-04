import { type EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useHomePageStore } from "@renderer/store/homePageStore";

interface ISlde {
  src: string;
  alt: string;
}

interface ICarouselProps {
  slides: ISlde[];
  options?: EmblaOptionsType;
  onSlideChange?: (index: number) => void;
  containerClassName?: string;
}

export const Carousel: React.FC<ICarouselProps> = (props) => {
  const { slides, options, onSlideChange, containerClassName } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [WheelGesturesPlugin()]);

  const { currentSlide, setSlide } = useHomePageStore();
  const [userTouched, setUserTouched] = useState(false);
  const [firstRenderJump, setFirstRenderJump] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;
    if (userTouched) return;

    const timer = setInterval(() => {
      onSlideChange?.((currentSlide + 1) % slides.length);
      setSlide((currentSlide + 1) % slides.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [emblaApi, currentSlide, slides.length, onSlideChange, userTouched, setSlide]);

  useEffect(() => {
    if (!emblaApi) return;

    const scrollSnapList = emblaApi.scrollSnapList();

    if (currentSlide > scrollSnapList.length - 1) {
      emblaApi.scrollTo(scrollSnapList.length - 1, firstRenderJump);
    } else {
      emblaApi.scrollTo(currentSlide, firstRenderJump);
    }

    setFirstRenderJump(false);
  }, [emblaApi, currentSlide, firstRenderJump]);

  useEffect(() => {
    const timer = setInterval(() => {
      setUserTouched(false);
    }, 15000);

    return () => clearInterval(timer);
  }, [userTouched]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("pointerDown", () => {
      setUserTouched(true);
    });
  }, [emblaApi]);

  return (
    <section className="m-auto w-screen">
      <div className={twMerge("overflow-hidden pt-4", containerClassName)} ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom items-end">
          {slides.map((slide, index) => (
            <div
              className="min-w-0 flex-[0_0_10rem]"
              key={slide.alt}
              style={{ transform: "translate3d(0, 0, 0)" }}
            >
              <button
                onClick={() => {
                  setSlide(index);
                  onSlideChange?.(index);
                }}
                className={twMerge(
                  "h-52 w-36 select-none overflow-hidden rounded-2xl transition-all duration-500",
                  index === currentSlide && "mb-4 scale-110",
                )}
              >
                <img
                  alt={slide.alt}
                  src={slide.src}
                  className="pointer-events-none h-52 w-36 object-cover"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
