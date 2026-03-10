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

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const gqlFetch = async <TData, TVariables extends object>(
  url: string,
  query: string,
  variables?: TVariables,
): Promise<TData> => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

  const json = (await res.json()) as { data?: TData; errors?: { message: string }[] };
  if (json.errors) throw new Error(json.errors[0].message);

  return json.data as TData;
};
