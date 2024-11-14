import JASSUB from "jassub";
import type Player from "video.js/dist/types/player";

const defaultHeader = `[Script Info]
Title: English (US)
ScriptType: v4.00+
WrapStyle: 0
PlayResX: 1280
PlayResY: 720
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default, Roboto Medium},52,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2.6,0,2,20,20,46,1
[Events]

`;

interface ISubtitle {
  text: string;
  time: number;
  duration: number;
  layer: string;
  style: string;
  name: string;
  marginL: string;
  marginR: string;
  marginV: string;
  effect: string;
}

export class TrackHelper {
  textTracks: TextTrack[] = [];
  tracks: { number: number; language?: string; type: string; name: string; header: string }[];
  player: Player;
  receivedSubtitles = new Map<string, Set<string>>();
  renderer: JASSUB;
  currentTrack: number | null = null;

  constructor(
    player: Player,
    tracks: { number: number; language?: string; type: string; name: string; header: string }[],
  ) {
    this.player = player;
    this.tracks = tracks;

    this.renderer = new JASSUB({
      video: player.el().firstElementChild as HTMLVideoElement,
      subContent: defaultHeader,
      workerUrl: new URL("jassub/dist/jassub-worker.js", import.meta.url).toString(),
      wasmUrl: new URL("jassub/dist/jassub-worker.wasm", import.meta.url).toString(),
    });

    // TODO: this needs a rewrite
    player.on("texttrackchange", () => {
      this.textTracks.forEach((track) => {
        if (track.mode === "showing") {
          this.currentTrack = Number(track.id);
          const foundTrack = this.tracks.find((t) => t.number === this.currentTrack);
          this.renderer.setTrack(foundTrack?.header ?? defaultHeader);
          const subtitleSet = this.receivedSubtitles.get(this.currentTrack.toString())!;

          if (!subtitleSet) {
            return;
          }

          subtitleSet.forEach((subtitleString) => {
            const subtitle = JSON.parse(subtitleString) as ISubtitle;
            this.renderer.createEvent({
              Start: subtitle.time,
              Duration: subtitle.duration,
              Style: subtitle.style,
              Name: subtitle.name || "",
              MarginL: Number(subtitle.marginL) || 0,
              MarginR: Number(subtitle.marginR) || 0,
              MarginV: Number(subtitle.marginV) || 0,
              Effect: subtitle.effect || "",
              Text: subtitle.text || "",
              ReadOrder: 1,
              Layer: Number(subtitle.layer) || 0,
              _index: this.currentTrack ?? 0,
            });
          });
        }
      });
    });

    // @ts-expect-error -- TODO: manual typing
    // eslint-disable-next-line
    player.textTracks().on("addtrack", (e: { track: TextTrack }) => {
      this.textTracks.push(e.track);
      // TODO: not like this lmao
      if (e.track.label.toLowerCase().includes("eng") && !this.currentTrack) {
        e.track.mode = "showing";
      }
    });

    window.electron.ipcRenderer.on(
      "subtitle",
      (
        _event,
        data: {
          subtitle: ISubtitle;
          trackNumber: number;
        },
      ) => {
        const { subtitle, trackNumber } = data;
        const textTrack = this.textTracks.find((track) => track.id === trackNumber.toString());

        if (!textTrack) {
          return;
        }

        if (!this.receivedSubtitles.has(textTrack.id)) {
          this.receivedSubtitles.set(textTrack.id, new Set());
        }

        const subtitleSet = this.receivedSubtitles.get(textTrack.id)!;

        if (subtitleSet.has(JSON.stringify(subtitle))) {
          return;
        }

        subtitleSet.add(JSON.stringify(subtitle));

        if (this.currentTrack !== trackNumber) {
          return;
        }

        this.renderer.createEvent({
          Start: subtitle.time,
          Duration: subtitle.duration,
          Style: subtitle.style,
          Name: subtitle.name || "",
          MarginL: Number(subtitle.marginL) || 0,
          MarginR: Number(subtitle.marginR) || 0,
          MarginV: Number(subtitle.marginV) || 0,
          Effect: subtitle.effect || "",
          Text: subtitle.text || "",
          ReadOrder: 1,
          Layer: Number(subtitle.layer) || 0,
          _index: trackNumber,
        });
      },
    );
  }

  destroy() {
    window.electron.ipcRenderer.removeAllListeners("subtitle");
    this.renderer.destroy();
  }
}
