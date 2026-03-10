import { type ITrack } from "@renderer/types/watchPageTypes";
import JASSUB from "jassub";
import type Player from "video.js/dist/types/player";
import workerUrl from "./jassub-worker.ts?worker&url";
import wasmUrl from "jassub/dist/wasm/jassub-worker.wasm?url";
import modernWasmUrl from "jassub/dist/wasm/jassub-worker-modern.wasm?url";
import { type ASSStyle } from "jassub/dist/worker/util";

const defaultHeader = `[Script Info]
Title: English (US)
ScriptType: v4.00+
WrapStyle: 0
PlayResX: 1280
PlayResY: 720
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default, Roboto Medium,52,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2.6,0,2,20,20,46,1
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
  tracks: ITrack[];
  player: Player;
  receivedSubtitles = new Map<string, Set<string>>();
  instance: JASSUB;
  currentTrack: number | null = null;
  styles: string[] = [];

  constructor(player: Player, tracks: ITrack[]) {
    this.player = player;
    this.tracks = tracks;

    this.instance = new JASSUB({
      video: player.el().firstElementChild as HTMLVideoElement,
      subContent: defaultHeader,
      workerUrl: workerUrl,
      wasmUrl: wasmUrl,
      modernWasmUrl: modernWasmUrl,
      availableFonts: {
        "Liberation Sans": new URL("../assets/default.woff2", import.meta.url).toString(),
      },
      queryFonts: "localandremote",
      defaultFont: "Liberation Sans",
    });

    void this.setActiveTrack(tracks[0]?.number ?? 0);

    // Set the active track to English if it exists
    for (const track of this.tracks) {
      const name = track.name ?? track.language ?? "Unknown";

      if (name.toLowerCase().includes("eng")) {
        void this.setActiveTrack(track.number);
        break;
      }
    }

    const overrideStyle: ASSStyle = {
      Name: "DialogueStyleOverride",
      FontSize: 72,
      PrimaryColour: 0xffffff00,
      SecondaryColour: 0xff000000,
      OutlineColour: 0,
      BackColour: 0,
      Bold: 1,
      Italic: 0,
      Underline: 0,
      StrikeOut: 0,
      ScaleY: 0.6,
      ScaleX: 0.6,
      Angle: 0,
      BorderStyle: 1,
      Outline: 4,
      Shadow: 0,
      Alignment: 2,
      MarginL: 135,
      MarginR: 135,
      MarginV: 50,
      Encoding: 1,
      treat_fontname_as_pattern: 0,
      Blur: 0,
      Justify: 0,
      FontName: "Roboto Medium",
      Spacing: 0,
    };

    void (async (instance) => {
      await instance.ready;
      await instance.renderer.styleOverride(overrideStyle);
    })(this.instance);

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
        const textTrack = this.tracks.find((track) => track.number === trackNumber);

        if (!textTrack) {
          return;
        }

        if (!this.receivedSubtitles.has(textTrack.number.toString())) {
          this.receivedSubtitles.set(textTrack.number.toString(), new Set());
        }

        const subtitleSet = this.receivedSubtitles.get(textTrack.number.toString())!;

        if (subtitleSet.has(JSON.stringify(subtitle))) {
          return;
        }

        subtitleSet.add(JSON.stringify(subtitle));

        if (this.currentTrack !== trackNumber) {
          return;
        }

        void this.instance?.ready.then(() => {
          void this.instance.renderer.createEvent({
            Start: subtitle.time,
            Duration: subtitle.duration,
            // TODO: need to setup styles
            Style: 1,
            // Style: subtitle.style,
            Name: subtitle.name || "",
            MarginL: Number(subtitle.marginL) || 0,
            MarginR: Number(subtitle.marginR) || 0,
            MarginV: Number(subtitle.marginV) || 0,
            Effect: subtitle.effect || "",
            Text: subtitle.text || "",
            ReadOrder: 1,
            Layer: Number(subtitle.layer) || 0,
          });
        });
      },
    );
  }

  async setActiveTrack(trackNumber: number) {
    this.currentTrack = Number(trackNumber);
    const textTrack = this.tracks.find((track) => track.number === trackNumber);
    await this.instance.ready;
    await this.instance.renderer.setTrack(textTrack?.header ?? defaultHeader);
    const subtitleSet = this.receivedSubtitles.get(this.currentTrack.toString());

    if (!subtitleSet) {
      return;
    }

    subtitleSet.forEach((subtitleString) => {
      const subtitle = JSON.parse(subtitleString) as ISubtitle;
      void this.instance.renderer.createEvent({
        Start: subtitle.time,
        Duration: subtitle.duration,
        // TODO: need to setup styles
        Style: 1,
        // Style: subtitle.style,
        Name: subtitle.name || "",
        MarginL: Number(subtitle.marginL) || 0,
        MarginR: Number(subtitle.marginR) || 0,
        MarginV: Number(subtitle.marginV) || 0,
        Effect: subtitle.effect || "",
        Text: subtitle.text || "",
        ReadOrder: 1,
        Layer: Number(subtitle.layer) || 0,
      });
    });
  }

  destroy() {
    window.electron.ipcRenderer.removeAllListeners("subtitle");
    void this.instance.destroy();
  }
}
