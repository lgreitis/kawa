import { type ISubtitleAttachment, type ITrack } from "@renderer/types/watchPageTypes";
import JASSUB from "jassub";
import type Player from "video.js/dist/types/player";
import workerUrl from "./jassub-worker.ts?worker&url";
import wasmUrl from "jassub/dist/wasm/jassub-worker.wasm?url";
import modernWasmUrl from "jassub/dist/wasm/jassub-worker-modern.wasm?url";
import { type ASSEvent } from "jassub/dist/worker/util";

const defaultHeader = `[Script Info]
Title: Default
ScriptType: v4.00+
WrapStyle: 0
PlayResX: 1920
PlayResY: 1080
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Roboto Medium,52,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2.6,0,2,20,20,46,1
[Events]

`;

const availableFonts = {
  "Roboto Medium": new URL("../assets/Roboto.woff2", import.meta.url).toString(),
  "Noto Sans": new URL("../assets/NotoSans-Bold.woff2", import.meta.url).toString(),
  "Noto Sans JP": new URL("../assets/NotoSansJP.woff2", import.meta.url).toString(),
  "Noto Sans JP Bold": new URL("../assets/NotoSansJP.woff2", import.meta.url).toString(),
  "Noto Sans KR": new URL("../assets/NotoSansKR.woff2", import.meta.url).toString(),
  "Noto Sans KR Bold": new URL("../assets/NotoSansKR.woff2", import.meta.url).toString(),
  "Noto Sans HK": new URL("../assets/NotoSansHK.woff2", import.meta.url).toString(),
  "Liberation Sans": new URL("../assets/default.woff2", import.meta.url).toString(),
};

const languageFontOverrides: Record<string, string> = {
  chi: "Noto Sans HK",
  chs: "Noto Sans HK",
  cht: "Noto Sans HK",
  jpn: "Noto Sans JP Bold",
  kor: "Noto Sans KR Bold",
  ja: "Noto Sans JP Bold",
  jp: "Noto Sans JP Bold",
  ko: "Noto Sans KR Bold",
  kr: "Noto Sans KR Bold",
  zh: "Noto Sans HK",
};

const fontFileRx = /\.(?:ttf|ttc|otf|woff2?|pfb)$/i;
const styleRx = /^Style\s*:\s*([^,\r\n]*)/gim;

interface ISubtitle {
  text: string;
  time: number;
  duration: number;
  readOrder?: number;
  layer: string;
  style?: string;
  name: string;
  marginL: string;
  marginR: string;
  marginV: string;
  effect: string;
}

interface ITrackState {
  meta: ITrack;
  styles: Record<string, number>;
  events: Map<string, ASSEvent>;
}

const normalizeHeader = (track: ITrack) => {
  if (track.header?.startsWith("[Script Info]")) {
    return convertAssEventHtmlTags(track.header);
  }

  return defaultHeader;
};

const isAssTrack = (track: ITrack) => {
  return track.type === "ass" || track.header?.startsWith("[Script Info]");
};

const getStyleMap = (header: string) => {
  const styles: Record<string, number> = {
    Default: 0,
  };

  const matches = [...header.matchAll(styleRx)];

  matches.forEach((match, index) => {
    const name = match[1]?.trim();

    if (name) {
      styles[name] = index + 1;
    }
  });

  return styles;
};

const detectCJKLanguage = (text: string) => {
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) {
    return "jpn";
  }

  if (/[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff]/.test(text)) {
    return "kor";
  }

  if (/[\u4e00-\u9fff\u3400-\u4dbf]/.test(text)) {
    return "chi";
  }

  return null;
};

const decodeHtmlEntity = (entity: string) => {
  const normalized = entity.toLowerCase();

  if (normalized === "amp") return "&";
  if (normalized === "lt") return "<";
  if (normalized === "gt") return ">";
  if (normalized === "quot") return '"';
  if (normalized === "apos") return "'";
  if (normalized === "nbsp") return "\\h";

  if (normalized.startsWith("#x")) {
    const codePoint = Number.parseInt(normalized.slice(2), 16);
    return Number.isNaN(codePoint) ? `&${entity};` : String.fromCodePoint(codePoint);
  }

  if (normalized.startsWith("#")) {
    const codePoint = Number.parseInt(normalized.slice(1), 10);
    return Number.isNaN(codePoint) ? `&${entity};` : String.fromCodePoint(codePoint);
  }

  return `&${entity};`;
};

const decodeHtmlEntities = (text: string) => {
  return text.replace(/&([a-z\d#]+);/gi, (_, entity: string) => decodeHtmlEntity(entity));
};

const convertHtmlTagsToAss = (text: string) => {
  return text.replace(/<\/?([a-z][\w:-]*)(?:\s+[^>]*)?>/gi, (tag, rawName: string) => {
    const name = rawName.toLowerCase();
    const closing = tag.startsWith("</");

    if (name === "br") return "\\N";
    if (name === "i") return closing ? "{\\i0}" : "{\\i1}";
    if (name === "b" || name === "strong") return closing ? "{\\b0}" : "{\\b1}";
    if (name === "u") return closing ? "{\\u0}" : "{\\u1}";
    if (name === "s" || name === "strike") return closing ? "{\\s0}" : "{\\s1}";

    return "";
  });
};

const convertHtmlTextToAss = (text: string) => {
  return convertHtmlTagsToAss(decodeHtmlEntities(text));
};

const convertNonAssText = (text: string) => {
  return convertHtmlTextToAss(text).replace(/\r?\n/g, "\\N");
};

function convertAssEventHtmlTags(text: string) {
  return text.replace(
    /^(Dialogue|Comment):((?:[^,\r\n]*,){9})(.*)$/gim,
    (_match, kind: string, fields: string, dialogueText: string) => {
      return `${kind}:${fields}${convertHtmlTextToAss(dialogueText)}`;
    },
  );
}

const normalizeFontData = (data: unknown) => {
  if (data instanceof Uint8Array) {
    return data;
  }

  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  }

  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
  }

  if (Array.isArray(data)) {
    return new Uint8Array(data);
  }

  return null;
};

const attachmentToFont = (attachment: ISubtitleAttachment) => {
  const isFont =
    fontFileRx.test(attachment.filename) || attachment.mimetype.toLowerCase().includes("font");

  if (!isFont) {
    return null;
  }

  return normalizeFontData(attachment.data);
};

export class TrackHelper {
  tracks: ITrack[];
  player: Player;
  instance: JASSUB;
  currentTrack: number | null = null;
  private currentTrackKey: string | null = null;
  private trackStates = new Map<string, ITrackState>();

  constructor(player: Player, tracks: ITrack[], attachments: ISubtitleAttachment[] = []) {
    this.player = player;
    this.tracks = tracks;

    for (const track of tracks) {
      const header = normalizeHeader(track);
      const meta = {
        ...track,
        header,
        type: isAssTrack({ ...track, header }) ? "ass" : track.type,
      };

      this.trackStates.set(String(track.number), {
        meta,
        styles: getStyleMap(header),
        events: new Map(),
      });
    }

    const embeddedFonts = attachments.map(attachmentToFont).filter((font) => font !== null);
    const videoElement =
      player.el().querySelector("video") ?? (player.el().firstElementChild as HTMLVideoElement);

    this.instance = new JASSUB({
      video: videoElement,
      subContent: defaultHeader,
      workerUrl,
      wasmUrl,
      modernWasmUrl,
      fonts: embeddedFonts,
      availableFonts,
      queryFonts: "localandremote",
      defaultFont: "Roboto Medium",
    });

    void this.setActiveTrack(tracks[0]?.number ?? 0);

    for (const track of this.tracks) {
      const name = `${track.language ?? ""} ${track.name ?? ""}`.toLowerCase();

      if (name.includes("eng")) {
        void this.setActiveTrack(track.number);
        break;
      }
    }

    window.electron.ipcRenderer.on("subtitle", this.handleSubtitle);
  }

  private handleSubtitle = (
    _event: unknown,
    data: {
      subtitle: ISubtitle;
      trackNumber: number;
    },
  ) => {
    void this.addSubtitle(data.trackNumber, data.subtitle);
  };

  private async addSubtitle(trackNumber: number, subtitle: ISubtitle) {
    const track = this.trackStates.get(String(trackNumber));

    if (!track) {
      return;
    }

    const dedupeKey = JSON.stringify(subtitle);

    if (track.events.has(dedupeKey)) {
      return;
    }

    const event = this.constructSub(subtitle, track, track.events.size);
    track.events.set(dedupeKey, event);

    if (this.currentTrackKey !== String(trackNumber)) {
      return;
    }

    await this.instance.ready;

    if (this.instance._destroyed) {
      return;
    }

    await this.instance.renderer.createEvent(event);
  }

  private constructSub(subtitle: ISubtitle, track: ITrackState, subtitleIndex: number): ASSEvent {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Empty styles must fall back to Default.
    const styleName = subtitle.style?.trim() || "Default";
    const style = track.styles[styleName] ?? track.styles.Default ?? 0;
    const text = subtitle.text ?? "";

    return {
      Start: subtitle.time,
      Duration: subtitle.duration,
      Style: style,
      Name: subtitle.name || "",
      MarginL: Number(subtitle.marginL) || 0,
      MarginR: Number(subtitle.marginR) || 0,
      MarginV: Number(subtitle.marginV) || 0,
      Effect: subtitle.effect || "",
      Text: isAssTrack(track.meta)
        ? convertHtmlTextToAss(text).replace(/\r?\n/g, "\\N")
        : convertNonAssText(text),
      ReadOrder: subtitle.readOrder ?? subtitleIndex,
      Layer: Number(subtitle.layer) || 0,
    };
  }

  private getDefaultFontForTrack(track: ITrackState) {
    const language = track.meta.language?.toLowerCase();

    if (language && languageFontOverrides[language]) {
      return languageFontOverrides[language];
    }

    const detectedLanguage = detectCJKLanguage(track.meta.header);

    if (detectedLanguage && languageFontOverrides[detectedLanguage]) {
      return languageFontOverrides[detectedLanguage];
    }

    return "Roboto Medium";
  }

  async setActiveTrack(trackNumber: number | string) {
    const trackKey = String(trackNumber);
    const track = this.trackStates.get(trackKey);

    this.currentTrack = Number(trackNumber);
    this.currentTrackKey = trackKey;

    await this.instance.ready;

    if (!track) {
      await this.instance.renderer.setTrack(defaultHeader);
      await this.instance.resize();
      return;
    }

    await this.instance.renderer.setTrack(track.meta.header || defaultHeader);
    await this.instance.renderer.setDefaultFont(this.getDefaultFontForTrack(track));

    for (const event of track.events.values()) {
      await this.instance.renderer.createEvent(event);
    }

    await this.instance.resize();
  }

  destroy() {
    window.electron.ipcRenderer.removeAllListeners("subtitle");
    this.trackStates.clear();
    void this.instance.destroy();
  }
}
