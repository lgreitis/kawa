import { XMLParser } from "fast-xml-parser";
import pako from "pako";

enum MalAnimeStatus {
  Watching = "Watching",
  Completed = "Completed",
  OnHold = "On-Hold",
  Dropped = "Dropped",
  PlanToWatch = "Plan to Watch",
}

export interface IMyAnimeList {
  myanimelist: {
    anime: {
      my_status: MalAnimeStatus;
      my_watched_episodes: number;
      series_animedb_id: number;
      series_episodes: number;
    }[];
    myinfo: {
      user_id: number;
      user_name: string;
    };
  };
}

export const importMalFile = async (file: File): Promise<IMyAnimeList> => {
  const inflatedData = pako.inflate(await file.arrayBuffer());
  const xmlFile = new File([inflatedData], "test.xml");
  const xmlString = await xmlFile.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    parseAttributeValue: true,
  });

  const jsonObj = parser.parse(xmlString) as IMyAnimeList;

  return jsonObj;
};
