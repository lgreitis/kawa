import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Dropdown } from "@renderer/components/Dropdown/Dropdown";
import { CCIcon } from "@renderer/components/icons/CCIcon";
import { type TrackHelper } from "@renderer/utils/TrackHelper";
import { useState } from "react";

interface ISubtitleSelectorProps {
  trackHelper: TrackHelper | null;
}

export const SubtitleSelector: React.FC<ISubtitleSelectorProps> = (props) => {
  const { trackHelper } = props;
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [prevHelper, setPrevHelper] = useState<TrackHelper | null>(null);

  if (trackHelper !== prevHelper) {
    setPrevHelper(trackHelper);
    setActiveTrack(trackHelper?.currentTrack ?? null);
  }

  const tracks = trackHelper?.tracks ?? [];

  const options = tracks.map((track) => ({
    label: `${track.name} ${track.language}`,
    icon: activeTrack === track.number ? CheckCircleIcon : undefined,
    onClick: () => {
      void trackHelper?.setActiveTrack(track.number);
      setActiveTrack(track.number);
    },
  }));

  return <Dropdown options={options} as={SubtitleSelectorButton} />;
};

interface ISubtitleSelectorButtonProps {
  ref: React.RefObject<HTMLButtonElement>;
}

const SubtitleSelectorButton: React.FC<ISubtitleSelectorButtonProps> = (props) => {
  const { ref, ...rest } = props;

  return (
    <button
      ref={ref}
      {...rest}
      className="rounded-md p-1.5 transition-colors hover:bg-white/30 active:bg-white/40"
    >
      <CCIcon className="size-4 cursor-pointer" />
    </button>
  );
};
