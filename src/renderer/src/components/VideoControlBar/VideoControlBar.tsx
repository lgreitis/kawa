import { ArrowsPointingOutIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import type Player from "video.js/dist/types/player";
import { VideoProgressBar } from "./components/VideoProgressBar";
import { VideoControlBarTime } from "./components/VideoControlBarTime";
import { calculatePlayerTime } from "@renderer/utils/utils";
import { createPortal } from "react-dom";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { VolumeSlider } from "./components/VolumeSlider";
import { type TrackHelper } from "@renderer/utils/TrackHelper";
import { SubtitleSelector } from "./components/SubtitleSelector";
import { twMerge } from "tailwind-merge";
import { useMouseMoveTrigger } from "@renderer/hooks/useMouseMoveTrigger";
import { InformationPopover } from "./components/InformationPopover";
import { useVolumeStore } from "@renderer/store/volumeStore";

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
  trackHelper: TrackHelper | null;
  infoHash: string;
}

export const VideoControlBar: React.FC<IVideoControlBarProps> = (props) => {
  const { player, setShowMouse, infoHash, trackHelper } = props;

  const { setVolume, volume } = useVolumeStore();

  const { mouseMovementTriggered } = useMouseMoveTrigger(2000);
  const [isDragging, setIsDragging] = useState(false);
  const [isInsideControlBar, setIsInsideControlBar] = useState(false);

  const [playerState, setPlayerState] = useState<IPlayerState>({
    currentTime: 0,
    timePercentage: 0,
    volume: volume,
    length: 0,
    isPlaying: false,
    isFullscreen: false,
  });

  useEffect(() => {
    if (!player) {
      return;
    }

    const { currentTime, timePercentage, duration } = calculatePlayerTime(player);

    // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronizes the initial state from the imperative video.js player.
    setPlayerState((prev) => ({
      ...prev,
      currentTime: currentTime,
      timePercentage: timePercentage,
      length: duration,
      isPlaying: !player.paused(),
      isFullscreen: player.isFullscreen() ?? false,
    }));

    const handleVolumeChange = () => {
      const newVolume = player.volume() ?? 0;
      setVolume(newVolume);
      setPlayerState((state) => ({
        ...state,
        volume: newVolume,
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
  }, [player, setVolume]);

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
      const isFullscreen = player.isFullscreen();

      if (isFullscreen) {
        void player.exitFullscreen();
      } else {
        void player.requestFullscreen();
      }

      setPlayerState((state) => ({
        ...state,
        isFullscreen: !isFullscreen,
      }));
    }
  };

  useEffect(() => {
    setShowMouse(mouseMovementTriggered || isDragging || isInsideControlBar);
  }, [isDragging, mouseMovementTriggered, isInsideControlBar, setShowMouse]);

  const shouldShowControlBar = isDragging || mouseMovementTriggered || isInsideControlBar;

  return createPortal(
    <div
      onMouseEnter={() => setIsInsideControlBar(true)}
      onMouseLeave={() => setIsInsideControlBar(false)}
      className={twMerge(
        "absolute flex select-none flex-col border-white/5 bg-black/40 backdrop-blur-sm",
        shouldShowControlBar ? "visible" : "invisible",
        "inset-x-0 bottom-0 px-2 py-1",
      )}
    >
      <div className="absolute inset-x-0 top-0 flex items-center">
        <VideoProgressBar
          player={player}
          playerState={playerState}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        />
      </div>
      <div className="flex items-center gap-2 pb-1 pt-2">
        <button
          onClick={onPlayResumeClick}
          className="rounded-md p-0.5 transition-colors hover:bg-white/30 active:bg-white/40"
        >
          {playerState.isPlaying ? (
            <PauseIcon className="size-5" />
          ) : (
            <PlayIcon className="size-5" />
          )}
        </button>

        <VolumeSlider player={player} playerStateVolume={playerState.volume} />
        <div className="flex items-center gap-1 text-sm">
          <VideoControlBarTime time={playerState.currentTime} />
          <span>/</span>
          <VideoControlBarTime time={playerState.length} />
        </div>
        <div className="flex-grow"></div>
        <div className="flex items-center gap-1">
          <InformationPopover infoHash={infoHash} player={player} />
          <SubtitleSelector trackHelper={trackHelper} />
          <button
            onClick={onFullScreenClick}
            className="rounded-md p-1.5 transition-colors hover:bg-white/30 active:bg-white/40"
          >
            {playerState.isFullscreen ? (
              <ArrowsPointingInIcon className="size-4" />
            ) : (
              <ArrowsPointingOutIcon className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>,
    (player?.el() as HTMLDivElement) ?? document.body,
  );
};
