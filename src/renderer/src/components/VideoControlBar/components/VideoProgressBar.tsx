import { useCallback, useEffect, useRef, useState } from "react";
import type Player from "video.js/dist/types/player";
import { type IPlayerState } from "../VideoControlBar";

interface IVideoProgressBarProps {
  player: Player | null;
  playerState: IPlayerState;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const VideoProgressBar: React.FC<IVideoProgressBarProps> = (props) => {
  const { player, playerState, onDragStart, onDragEnd } = props;

  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateProgress = useCallback(
    (e: MouseEvent) => {
      if (!player || !progressBarRef.current) {
        return;
      }

      const rect = progressBarRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const percentage = (offsetX / rect.width) * 100;
      const time = (player.duration() ?? 0) * (percentage / 100);
      player.currentTime(time);
    },
    [player],
  );

  const handleMouseDown = () => {
    setIsDragging(true);
    onDragStart?.();
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        updateProgress(e);
      }
    },
    [isDragging, updateProgress],
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd?.();
    }
  }, [isDragging, onDragEnd]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, isDragging]);

  return (
    <div
      ref={progressBarRef}
      className="flex h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-white/20"
      onMouseDown={handleMouseDown}
      onClick={(e) => updateProgress(e.nativeEvent)}
    >
      <div
        style={{
          width: `${playerState.timePercentage}%`,
        }}
        className="bg-white"
      ></div>
    </div>
  );
};
