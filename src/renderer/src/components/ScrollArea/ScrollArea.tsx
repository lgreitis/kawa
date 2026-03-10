import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import { twMerge } from "tailwind-merge";

interface IScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const scrollbarClassName =
  "z-40 flex touch-none select-none bg-black/30 p-0.5 backdrop-blur-md transition-colors duration-[160ms] ease-out hover:bg-black/50 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col";

const thumbClassName =
  "relative flex-1 rounded-[10px] bg-white/40 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']";

export const ScrollArea: React.FC<IScrollAreaProps> = (props) => {
  const { children, className, ref } = props;

  return (
    <BaseScrollArea.Root className={twMerge("overflow-hidden", className)}>
      <BaseScrollArea.Viewport className="h-full w-full overscroll-contain" ref={ref}>
        <BaseScrollArea.Content>{children}</BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar className={scrollbarClassName} orientation="vertical">
        <BaseScrollArea.Thumb className={thumbClassName} />
      </BaseScrollArea.Scrollbar>
      <BaseScrollArea.Scrollbar className={scrollbarClassName} orientation="horizontal">
        <BaseScrollArea.Thumb className={thumbClassName} />
      </BaseScrollArea.Scrollbar>
      <BaseScrollArea.Corner className="bg-black/50" />
    </BaseScrollArea.Root>
  );
};
