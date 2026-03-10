import prettyBytes from "pretty-bytes";
import React from "react";
import { createPortal } from "react-dom";
import type Player from "video.js/dist/types/player";

interface IVideoTitleOverlayProps {
  player: Player | null;
  title: string;
  episode?: number;
  size?: number;
  videoResolution?: string;
}

export const VideoTitleOverlay: React.FC<IVideoTitleOverlayProps> = (props) => {
  const { player, title, episode, size, videoResolution } = props;

  return createPortal(
    <div className="absolute left-6 top-6 rounded-xl border border-white/5 bg-black/40 px-4 py-2 backdrop-blur-sm">
      <h1 className="text-sm font-medium text-white/90">{title}</h1>
      <p className="mt-0.5 text-xs text-white/50">
        {episode !== undefined && `Episode ${episode}`}
        {(episode !== undefined ? true : false) && (videoResolution ?? size) && " • "}
        {videoResolution ?? false}
        {(videoResolution ?? false) && (size ?? false) && " • "}
        {size && prettyBytes(size)}
      </p>
    </div>,
    (player?.playerElIngest_ as HTMLDivElement) ?? document.body,
  );
};
