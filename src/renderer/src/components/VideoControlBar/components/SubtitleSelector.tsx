import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Dropdown } from "@renderer/components/Dropdown/Dropdown";
import { CCIcon } from "@renderer/components/icons/CCIcon";
import { type TrackHelper } from "@renderer/utils/TrackHelper";

interface ISubtitleSelectorProps {
  trackHelperRef: React.MutableRefObject<TrackHelper | null>;
}

export const SubtitleSelector: React.FC<ISubtitleSelectorProps> = (props) => {
  const { trackHelperRef } = props;

  const options = trackHelperRef.current?.tracks.map((track) => ({
    label: track.name ?? track.language ?? "Unknown",
    icon: trackHelperRef.current?.currentTrack === track.number ? CheckCircleIcon : undefined,
    onClick: () => {
      trackHelperRef.current?.setActiveTrack(track.number);
    },
  }));

  return <Dropdown options={options ?? []} as={SubtitleSelectorButton} />;
};

interface ISubtitleSelectorButtonProps {
  ref: React.RefObject<HTMLButtonElement>;
}

const SubtitleSelectorButton: React.FC<ISubtitleSelectorButtonProps> = (props) => {
  const { ref, ...rest } = props;

  return (
    <button ref={ref} {...rest}>
      <CCIcon className="size-5 cursor-pointer" />
    </button>
  );
};
