import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Smoothly interpolates a progress value toward a target using RAF.
 *
 * - Data-driven `progress` (0–100) is capped at 90% until `allReady` is true.
 * - A small ambient creep (+0.1/frame) prevents the bar from looking stuck.
 * - Returns a float 0–100 that can be used directly as a CSS width %.
 * - `isComplete` flips true once the display value reaches ≥99.5 and `allReady`.
 */
export function useSmoothProgress(progress: number, allReady: boolean) {
  const target = allReady ? 100 : Math.min(progress, 90);

  const [displayProgress, setDisplayProgress] = useState(0);
  const dpRef = useRef(0);
  const rafRef = useRef<number>(0);
  const targetRef = useRef(target);
  const allReadyRef = useRef(allReady);

  useLayoutEffect(() => {
    targetRef.current = target;
    allReadyRef.current = allReady;
  });

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const tick = () => {
      const curr = dpRef.current;
      const t = targetRef.current;

      let next = curr + (t - curr) * 0.06 + 0.1;
      next = Math.min(next, t);
      if (Math.abs(t - next) < 0.5) next = t;

      if (next !== curr) {
        dpRef.current = next;
        setDisplayProgress(next);
      }

      if (allReadyRef.current && next >= 99.5) {
        setIsComplete(true);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return { displayProgress, isComplete };
}
