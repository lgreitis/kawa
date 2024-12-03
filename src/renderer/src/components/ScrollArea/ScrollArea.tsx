import * as ScrollAreaComponents from "@radix-ui/react-scroll-area";
import { twMerge } from "tailwind-merge";

interface IScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
}

export const ScrollArea: React.FC<IScrollAreaProps> = (props) => {
  const { children, className, ref } = props;

  return (
    <ScrollAreaComponents.Root className={twMerge("overflow-hidden", className)}>
      {/* TODO: 1.2.1 breaks display of some elements because of `display: table` style on a radix internal element which we can't easily control */}
      {/* Keeping the package on 1.2.0 until it's fixed */}
      {/* https://github.com/radix-ui/primitives/issues/3247 */}
      {/* https://github.com/radix-ui/primitives/issues/2722 */}
      <ScrollAreaComponents.Viewport className="h-full w-full" ref={ref}>
        {children}
      </ScrollAreaComponents.Viewport>
      <ScrollAreaComponents.Scrollbar
        className="z-40 flex touch-none select-none bg-black/30 p-0.5 backdrop-blur-md transition-colors duration-[160ms] ease-out hover:bg-black/50 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
        orientation="vertical"
      >
        <ScrollAreaComponents.Thumb className="relative flex-1 rounded-[10px] bg-white/40 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
      </ScrollAreaComponents.Scrollbar>
      <ScrollAreaComponents.Scrollbar
        className="z-40 flex touch-none select-none bg-black/30 p-0.5 backdrop-blur-md transition-colors duration-[160ms] ease-out hover:bg-black/50 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
        orientation="horizontal"
      >
        <ScrollAreaComponents.Thumb className="relative flex-1 rounded-[10px] bg-white/40 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
      </ScrollAreaComponents.Scrollbar>
      <ScrollAreaComponents.Corner className="bg-black/50" />
    </ScrollAreaComponents.Root>
  );
};
