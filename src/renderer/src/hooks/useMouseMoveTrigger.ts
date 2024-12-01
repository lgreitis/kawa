import { useEffect, useRef, useState } from "react";

export const useMouseMoveTrigger = (timeout: number) => {
  const [mouseMovementTriggered, setMouseMovementTriggered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setMouseMovementTriggered(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setMouseMovementTriggered(false);
      }, timeout);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [timeout]);

  return { mouseMovementTriggered };
};
