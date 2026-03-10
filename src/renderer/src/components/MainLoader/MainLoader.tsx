import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useState } from "react";
import { useSmoothProgress } from "@renderer/hooks/useSmoothProgress";
import { IS_DEV } from "@renderer/constants";

interface IMainLoaderProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  progress?: number;
}

const stroke: Variants = {
  hidden: { pathLength: 0, opacity: 1 },
  show: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: 2, ease: "easeInOut", delay },
  }),
};

const P1 = "M332.544 0H284.16V340.992H332.544V0Z";
const P2 = "M213.888 17.28H166.656V304.896H213.888V17.28Z";
const P3 =
  "M96.384 0.768013H49.152V133.632C49.152 154.624 48.128 175.744 46.08 196.992C44.032 217.984 39.552 238.336 32.64 258.048C25.728 277.504 14.848 295.552 0 312.192C3.84 314.496 8.32 317.568 13.44 321.408C18.56 325.504 23.424 329.6 28.032 333.696C32.896 338.048 36.736 342.016 39.552 345.6C52.352 331.008 62.464 315.264 69.888 298.368C77.568 281.472 83.328 263.936 87.168 245.76C91.008 227.584 93.44 209.152 94.464 190.464C95.744 171.52 96.384 152.576 96.384 133.632V0.768013Z";

export const MainLoader: React.FC<IMainLoaderProps> = ({ children, isLoading, progress }) => {
  const [phase, setPhase] = useState<"drawing" | "filling" | "done">(IS_DEV ? "done" : "drawing");
  const isFilled = phase === "filling" || phase === "done";

  const [showLoader, setShowLoader] = useState(true);

  const allReady = isLoading === false && phase === "done";
  const { displayProgress, isComplete } = useSmoothProgress(progress ?? 0, allReady);

  // Once complete, never show the loader again (even if props change)
  if (isComplete && showLoader) setShowLoader(false);

  return (
    <>
      <div
        className={showLoader ? "opacity-0" : "opacity-100"}
        style={{ transition: "opacity 450ms ease" }}
      >
        {children}
      </div>

      <AnimatePresence>
        {showLoader && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <div className="relative flex flex-col items-center gap-10">
              <div className="relative" style={{ width: 208, height: 208 }}>
                <div
                  className="absolute inset-0 z-0"
                  style={{
                    opacity: isFilled ? 1 : 0,
                    transition: "opacity 1.2s ease",
                    background:
                      "radial-gradient(circle at 50% 50%, oklch(0.95 0 0 / 0.08) 0%, oklch(0.95 0 0 / 0.03) 40%, transparent 70%)",
                    filter: "blur(20px)",
                    transform: "scale(1.8)",
                  }}
                />
                <svg
                  viewBox="0 0 333 346"
                  width="333"
                  height="346"
                  className="relative z-10 size-52"
                >
                  <g
                    fill="none"
                    stroke="oklch(0.95 0 0)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path
                      d={P1}
                      variants={stroke}
                      initial="hidden"
                      animate="show"
                      custom={0.4}
                    />
                    <motion.path
                      d={P2}
                      variants={stroke}
                      initial="hidden"
                      animate="show"
                      custom={0.2}
                    />
                    <motion.path
                      d={P3}
                      variants={stroke}
                      initial="hidden"
                      animate="show"
                      custom={0}
                      onAnimationComplete={() => !IS_DEV && setPhase("filling")} // fires after the last one finishes
                    />
                  </g>

                  <defs>
                    <filter id="textGlow">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <motion.g
                    initial={false}
                    animate={{
                      opacity: isFilled ? 1 : 0,
                      filter: isFilled ? "url(#textGlow)" : "none",
                    }}
                    transition={{
                      opacity: { duration: 0.8, ease: "easeInOut" },
                      filter: { duration: 0 },
                    }}
                    onUpdate={(latest) => {
                      if (
                        isFilled &&
                        typeof latest.opacity === "number" &&
                        latest.opacity > 0.999
                      ) {
                        setPhase("done");
                      }
                    }}
                  >
                    <path d={P1} fill="oklch(0.95 0 0)" />
                    <path d={P2} fill="oklch(0.95 0 0)" />
                    <path d={P3} fill="oklch(0.95 0 0)" />
                  </motion.g>
                </svg>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-4">
                <div
                  className="h-px w-32 overflow-hidden"
                  style={{ backgroundColor: "oklch(0.2 0 0)" }}
                >
                  <div
                    className="h-full"
                    style={{
                      width: `${displayProgress}%`,
                      backgroundColor: "oklch(0.95 0 0)",
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
