export const IS_DEV = import.meta.env.DEV;
export const MAL_CLIENT_ID = import.meta.env.VITE_MAL_CLIENT_ID;

export const EMPTY_IMAGE = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

export const ONE_HOUR_IN_MS = 60 * 60 * 1000;
export const ONE_DAY_IN_MS = 24 * ONE_HOUR_IN_MS;
export const ONE_WEEK_IN_MS = 7 * ONE_DAY_IN_MS;

// TODO: might want actual translation lib in the future
export const MAL_STATUS_TO_ENGLISH_TRANSLATION = {
  watching: "Watching",
  completed: "Completed",
  on_hold: "On Hold",
  dropped: "Dropped",
  plan_to_watch: "Plan to Watch",
};

export const MAL_AIR_STATUS_TO_ENGLISH_TRANSLATION = {
  finished_airing: "Finished Airing",
  currently_airing: "Currently Airing",
  not_yet_aired: "Not Yet Aired",
};

export const DEFAULT_EXTENSIONS = JSON.parse(import.meta.env.VITE_DEFAULT_EXTENSIONS) as {
  extensions: string[];
};
