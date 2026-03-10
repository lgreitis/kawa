import type Player from "video.js/dist/types/player";
import React, { useEffect, useState } from "react";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { Slider } from "@base-ui/react/slider";

interface IVolumeSliderProps {
  player: Player | null;
  playerStateVolume: number;
}

export const VolumeSlider: React.FC<IVolumeSliderProps> = (props) => {
  const { player, playerStateVolume } = props;

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolume] = useState(playerStateVolume);
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
    setVolume(playerStateVolume);
  }, [playerStateVolume]);

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
              value={volume * 100}
              onValueChange={(value) => setVolume(value / 100)}
              max={100}
              step={1}
            >
              <Slider.Control className="flex w-full items-center py-2">
                <Slider.Track className="relative h-[3px] grow rounded-full bg-white/40">
                  <Slider.Indicator className="absolute h-full rounded-full bg-white/80" />
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
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
