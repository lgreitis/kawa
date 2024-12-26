import { ArrowsPointingOutIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import type Player from "video.js/dist/types/player";
import { VideoProgressBar } from "./components/VideoProgressBar";
import { VideoControlBarTime } from "./components/VideoControlBarTime";
import { calculatePlayerTime } from "@renderer/utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { VolumeSlider } from "./components/VolumeSlider";
import { type TrackHelper } from "@renderer/utils/TrackHelper";
import { SubtitleSelector } from "./components/SubtitleSelector";
import { twMerge } from "tailwind-merge";
import { useMouseMoveTrigger } from "@renderer/hooks/useMouseMoveTrigger";
import { InformationPopover } from "./components/InformationPopover";

export interface IPlayerState {
  currentTime: number;
  timePercentage: number;
  volume: number;
  length: number;
  isPlaying: boolean;
  isFullscreen: boolean;
}

interface IVideoControlBarProps {
  player: Player | null;
  setShowMouse: (show: boolean) => void;
  trackHelperRef: React.MutableRefObject<TrackHelper | null>;
  infoHash: string;
}

export const VideoControlBar: React.FC<IVideoControlBarProps> = (props) => {
  const { player, setShowMouse, infoHash } = props;

  const { mouseMovementTriggered } = useMouseMoveTrigger(2000);
  const [isDragging, setIsDragging] = useState(false);
  const [isInsideControlBar, setIsInsideControlBar] = useState(false);

  const [playerState, setPlayerState] = useState<IPlayerState>({
    currentTime: 0,
    timePercentage: 0,
    volume: 1,
    length: 0,
    isPlaying: false,
    isFullscreen: false,
  });

  useEffect(() => {
    if (!player) {
      return;
    }

    const { currentTime, timePercentage, duration } = calculatePlayerTime(player);

    setPlayerState({
      currentTime: currentTime,
      timePercentage: timePercentage,
      volume: player.volume() ?? 1,
      length: duration,
      isPlaying: !player.paused(),
      isFullscreen: player.isFullscreen() ?? false,
    });

    const handleVolumeChange = () => {
      setPlayerState((state) => ({
        ...state,
        volume: player.volume() ?? 1,
      }));
    };

    const handleTimeUpdate = () => {
      const { currentTime, timePercentage, duration } = calculatePlayerTime(player);

      setPlayerState({
        currentTime,
        timePercentage: timePercentage,
        volume: player.volume() ?? 1,
        length: duration,
        isPlaying: !player.paused(),
        isFullscreen: player.isFullscreen() ?? false,
      });
    };

    player.on("volumechange", handleVolumeChange);
    player.on("timeupdate", handleTimeUpdate);

    return () => {
      if (player && !player.isDisposed()) {
        player.off("volumechange", handleVolumeChange);
        player.off("timeupdate", handleTimeUpdate);
      }
    };
  }, [player]);

  const onPlayResumeClick = () => {
    if (player) {
      if (player.paused()) {
        void player.play();
      } else {
        player.pause();
      }
    }
  };

  const onFullScreenClick = () => {
    if (player) {
      if (player.isFullscreen()) {
        void player.exitFullscreen();
      } else {
        void player.requestFullscreen();
      }
    }
  };

  useEffect(() => {
    setShowMouse(mouseMovementTriggered || isDragging || isInsideControlBar);
  }, [isDragging, mouseMovementTriggered, isInsideControlBar, setShowMouse]);

  const shouldShowControlBar = isDragging || mouseMovementTriggered || isInsideControlBar;

  return createPortal(
    <AnimatePresence>
      {shouldShowControlBar && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          onMouseEnter={() => setIsInsideControlBar(true)}
          onMouseLeave={() => setIsInsideControlBar(false)}
          className={twMerge(
            "absolute flex select-none flex-col border border-white/5 bg-black/40 backdrop-blur-sm",
            // cant decide between designs
            // "inset-x-4 bottom-4 rounded-lg px-4 py-2",
            "inset-x-0 bottom-0 px-2 py-1",
          )}
        >
          <div className="flex items-center pb-3 pt-1">
            <VideoProgressBar
              player={player}
              playerState={playerState}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onPlayResumeClick}>
              {playerState.isPlaying ? (
                <PauseIcon className="size-5" />
              ) : (
                <PlayIcon className="size-5" />
              )}
            </button>

            <VolumeSlider player={player} playerState={playerState} />
            <div className="flex items-center gap-1 text-sm">
              <VideoControlBarTime time={playerState.currentTime} />
              <span>/</span>
              <VideoControlBarTime time={playerState.length} />
            </div>
            <div className="flex-grow"></div>
            <div className="flex items-center gap-2">
              <InformationPopover infoHash={infoHash} />
              <SubtitleSelector trackHelperRef={props.trackHelperRef} />
              <button onClick={onFullScreenClick}>
                {playerState.isFullscreen ? (
                  <ArrowsPointingInIcon className="size-5" />
                ) : (
                  <ArrowsPointingOutIcon className="size-5" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    (player?.playerElIngest_ as HTMLDivElement) ?? document.body,
  );
};
