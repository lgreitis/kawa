import type Player from "video.js/dist/types/player";

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const calculatePlayerTime = (player: Player) => {
  const currentTime = player.currentTime() ?? 0;
  const duration = player.duration() ?? 0;
  if (duration === 0)
    return {
      currentTime: currentTime,
      timePercentage: 0,
      duration: duration,
    };
  const percentage = (currentTime / duration) * 100;

  return {
    duration: duration,
    timePercentage: percentage,
    currentTime: currentTime,
  };
};
