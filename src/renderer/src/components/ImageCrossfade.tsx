import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

interface IImageCrossfade {
  src?: string;
  className?: string;
}

export const ImageCrossfade: React.FC<IImageCrossfade> = (props) => {
  const { src, className } = props;

  return (
    <div className={twMerge(className)}>
      <AnimatePresence initial={false}>
        <motion.img
          key={"current" + src}
          className="absolute h-full w-full object-cover"
          src={src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
    </div>
  );
};
