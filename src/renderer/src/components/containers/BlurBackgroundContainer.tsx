import { Loader } from "@renderer/components/Loader/Loader";
import { ScrollArea } from "@renderer/components/ScrollArea/ScrollArea";
import React from "react";
import { SafeArea } from "@renderer/components/SafeArea/SafeArea";
import { BackgroundImage } from "@renderer/components/BackgroundImage/BackgroundImage";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

interface IBlurBackgroundContainerProps {
  children?: React.ReactNode;
  imdbId?: string;
  isLoading?: boolean;
  darkenLoader?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

export const BlurBackgroundContainer: React.FC<IBlurBackgroundContainerProps> = (props) => {
  const { children, imdbId, isLoading, darkenLoader, ref } = props;

  return (
    <div className="relative h-full">
      <BackgroundImage imdbId={imdbId} className="absolute h-dvh w-full object-cover" />
      {imdbId && <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-lg" />}

      {!isLoading ? (
        <SafeArea>
          <ScrollArea className="h-[calc(100dvh-2.25rem)] w-full" ref={ref}>
            {children}
          </ScrollArea>
        </SafeArea>
      ) : (
        // TODO: Maybe dont darken everything
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={twMerge(
            "relative z-10 flex h-full items-center justify-center",
            darkenLoader && "bg-black/50 backdrop-blur-lg",
          )}
        >
          <Loader className="text-white" />
        </motion.div>
      )}
    </div>
  );
};
