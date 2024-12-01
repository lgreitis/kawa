import { SafeArea } from "@renderer/components/SafeArea/SafeArea";
import { useAnimeListStore } from "@renderer/store/animeListStore";
import { type IWatchPageState } from "@renderer/types/watchPageTypes";
import { TrackHelper } from "@renderer/utils/TrackHelper";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useWatchedEpisodeUpdater } from "./hooks/useWatchedEpisodeUpdater";
import videojs from "video.js";
import { VideoControlBar } from "@renderer/components/VideoControlBar/VideoControlBar";
import { calculatePlayerTime } from "@renderer/utils/utils";
import { twJoin } from "tailwind-merge";
import "video.js/dist/video-js.min.css";
import "videojs-hotkeys";

const initialOptions = {
  controls: true,
  fluid: true,
  // controlBar: {
  //   volumePanel: {
  //     inline: false,
  //   },
  // },
  controlBar: false,
  plugins: {
    hotkeys: {
      volumeStep: 0.1, // Volume step for up/down keys
      seekStep: 5, // Seek step in seconds for left/right keys
      enableModifiersForNumbers: false, // Disable Shift/Ctrl modifier for number keys
    },
  },
};

export const WatchPage: React.FC = () => {
  const { state } = useLocation() as IWatchPageState;
  const { url } = useParams<{ url: string }>();
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>();
  const [player, setPlayer] = useState<ReturnType<typeof videojs> | null>(null);
  const trackHelperRef = useRef<TrackHelper | null>(null);

  useWatchedEpisodeUpdater({
    malId: state?.malId ?? 0,
    episodeNumber: state?.episodeNumber ?? 0,
    player,
  });

  const [showMouse, setShowMouse] = useState(true);

  const { setProgress, getEpisodeData } = useAnimeListStore();

  const decodedUrl = encodeURI(atob(url ?? ""));

  useEffect(() => {
    if (!playerRef.current) {
      const videoEl = videoRef.current;
      const videoJsElement = document.createElement("video-js");
      const videoElement = videoEl!.appendChild(videoJsElement);

      state?.tracks.forEach((track) => {
        const trackElement = document.createElement("track");
        trackElement.kind = "subtitles";
        trackElement.label = track.language ?? "English";
        trackElement.srclang = track.language ?? "en";
        trackElement.id = track.number.toString();
        videoElement.appendChild(trackElement);
      });

      const player = (playerRef.current = videojs(
        videoElement,
        {
          ...initialOptions,
          sources: [
            {
              src: decodedUrl,
              type: "video/mp4",
            },
          ],
        },
        () => {
          videojs.log("player is ready");
        },
      ));

      setPlayer(player);

      if (state?.tracks) {
        trackHelperRef.current = new TrackHelper(player, state.tracks);
      }

      player.fill(true);

      player.ready(() => {
        if (!state) {
          return;
        }

        const episodeData = getEpisodeData(state.malId, state.episodeNumber);

        if (!episodeData?.watchTime) {
          return;
        }

        if (episodeData.watchTime - 1 > 0) {
          player.currentTime(episodeData.watchTime - 1);
        }
      });
    } else {
      // const player = playerRef.current;
    }
  }, [decodedUrl, state, getEpisodeData]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        videojs.log("player is disposed");
        trackHelperRef.current?.destroy();
        player.dispose();
        setPlayer(null);
        trackHelperRef.current = null;
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  useEffect(() => {
    if (!player || !state) {
      return;
    }

    const handleTimeUpdate = () => {
      const { currentTime, timePercentage } = calculatePlayerTime(player);
      setProgress(state.malId, state.episodeNumber, timePercentage, currentTime);
    };

    player.on("timeupdate", handleTimeUpdate);

    return () => {
      if (player && !player.isDisposed()) {
        player.off("timeupdate", handleTimeUpdate);
      }
    };
  }, [player, setProgress, state]);

  return (
    <SafeArea>
      <div
        className={twJoin(
          "h-[calc(100dvh-2.25rem-2px)] w-full !border-none",
          showMouse ? "cursor-default" : "cursor-none",
        )}
        ref={videoRef}
      ></div>
      <VideoControlBar
        player={player}
        setShowMouse={setShowMouse}
        trackHelperRef={trackHelperRef}
      />
    </SafeArea>
  );
};
