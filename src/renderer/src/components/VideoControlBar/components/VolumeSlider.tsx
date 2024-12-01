import type Player from "video.js/dist/types/player";
import { type IPlayerState } from "../VideoControlBar";
import React, { useEffect, useState } from "react";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import * as Slider from "@radix-ui/react-slider";
import { AnimatePresence, motion } from "framer-motion";

interface IVolumeSliderProps {
  player: Player | null;
  playerState: IPlayerState;
}

export const VolumeSlider: React.FC<IVolumeSliderProps> = (props) => {
  const { player, playerState } = props;

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolume] = useState(playerState.volume);
  const [preMuteVolume, setPreMuteVolume] = useState(1);

  useEffect(() => {
    if (player) {
      if (volume !== 0) {
        setPreMuteVolume(volume);
      }
      player.volume(volume);
    }
  }, [volume, player]);

  useEffect(() => {
    setVolume(playerState.volume);
  }, [playerState.volume]);

  return (
    <div
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => setShowVolumeSlider(false)}
      className="flex cursor-pointer gap-2"
    >
      <AnimatePresence>
        {volume === 0 ? (
          <SpeakerXMarkIcon className="size-5" onClick={() => setVolume(preMuteVolume)} />
        ) : (
          <SpeakerWaveIcon
            className="size-5"
            onClick={() => {
              setPreMuteVolume(volume);
              setVolume(0);
            }}
          />
        )}
        {showVolumeSlider && (
          <motion.div
            key="volume-slider"
            initial={{ width: 0 }}
            animate={{ width: "auto" }}
            exit={{ width: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center gap-2"
          >
            <Slider.Root
              className="relative flex h-5 w-16 touch-none select-none items-center"
              value={[volume * 100]}
              onValueChange={(value) => setVolume(value[0] / 100)}
              max={100}
              step={1}
            >
              <Slider.Track className="relative h-[3px] grow rounded-full bg-white/40">
                <Slider.Range className="absolute h-full rounded-full bg-white/80" />
              </Slider.Track>
              <motion.div
                key="thumb"
                className="size-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Slider.Thumb className="block size-3 rounded-[10px] bg-white focus:shadow-[0_2px_10px] focus:shadow-white/50 focus:outline-none" />
              </motion.div>
            </Slider.Root>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
