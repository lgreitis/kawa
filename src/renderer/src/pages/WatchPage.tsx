import { SafeArea } from "@renderer/components/SafeArea/SafeArea";
import { useAnimeListStore } from "@renderer/store/animeListStore";
import { type IWatchPageState } from "@renderer/types/watchPageTypes";
import { TrackHelper } from "@renderer/utils/TrackHelper";
import { useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.min.css";

const initialOptions = {
  controls: true,
  fluid: true,
  controlBar: {
    volumePanel: {
      inline: false,
    },
  },
};

export const WatchPage: React.FC = () => {
  // TODO: useLocation sucks
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { state }: IWatchPageState = useLocation();
  const { url } = useParams<{ url: string }>();
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>();
  const trackHelperRef = useRef<TrackHelper | null>(null);

  const { setProgress } = useAnimeListStore();

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

      if (state?.tracks) {
        trackHelperRef.current = new TrackHelper(player, state.tracks);
      }

      player.fill(true);
    } else {
      // const player = playerRef.current;
    }
  }, [decodedUrl, state?.tracks]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        videojs.log("player is disposed");
        trackHelperRef.current?.destroy();
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  useEffect(() => {
    const player = playerRef.current;

    if (player && state) {
      player.on("timeupdate", () => {
        const currentTime = player.currentTime() ?? 0;
        const duration = player.duration() ?? 0;
        if (duration === 0) return;
        const percentage = (currentTime / duration) * 100;

        setProgress(state.malId, state.episodeNumber, percentage);
      });
    }

    return () => {
      if (player && !player.isDisposed()) {
        player.off("timeupdate");
      }
    };
  }, [playerRef, setProgress, state]);

  return (
    <SafeArea>
      <div className="h-[calc(100dvh-2.25rem-2px)] w-full !border-none" ref={videoRef}></div>
    </SafeArea>
  );
};
