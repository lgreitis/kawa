import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import { twMerge } from "tailwind-merge";

interface IScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  scrollbarClassName?: string;
  hideScrollbar?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

const baseScrollbarClassName =
  "z-40 flex touch-none select-none bg-black/30 p-0.5 backdrop-blur-md transition-colors duration-[160ms] ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col";

const thumbClassName =
  "relative flex-1 rounded-[10px] bg-white/40 transition-colors duration-200 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] hover:bg-white/60";

export const ScrollArea: React.FC<IScrollAreaProps> = (props) => {
  const { children, className, scrollbarClassName, hideScrollbar, ref } = props;

  const hiddenScrollbarClassName = hideScrollbar
    ? "opacity-0 transition-opacity duration-200 hover:opacity-100 data-[scrolling]:opacity-100"
    : "";

  return (
    <BaseScrollArea.Root className={twMerge("overflow-hidden", className)}>
      <BaseScrollArea.Viewport className="h-full w-full overscroll-contain" ref={ref}>
        <BaseScrollArea.Content>{children}</BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar
        className={twMerge(baseScrollbarClassName, hiddenScrollbarClassName, scrollbarClassName)}
        orientation="vertical"
      >
        <BaseScrollArea.Thumb className={thumbClassName} />
      </BaseScrollArea.Scrollbar>
      <BaseScrollArea.Scrollbar
        className={twMerge(baseScrollbarClassName, hiddenScrollbarClassName, scrollbarClassName)}
        orientation="horizontal"
      >
        <BaseScrollArea.Thumb className={thumbClassName} />
      </BaseScrollArea.Scrollbar>
      <BaseScrollArea.Corner className="bg-black/50" />
    </BaseScrollArea.Root>
  );
};
