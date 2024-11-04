import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { type IAnidbAnimeData } from "./anidbTypes";

const clientVer = 9;
// TODO: change this lmao
const clientName = "clientname";

export const getAnidbAnimeInfo = async (anidbId: number) => {
  const response = await axios.get<string>(
    `http://api.anidb.net:9001/httpapi?request=anime&client=${clientName}&clientver=${clientVer}&protover=1&aid=${anidbId}`,
  );

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    parseAttributeValue: true,
  });

  const jsonObj = parser.parse(response.data) as IAnidbAnimeData;

  if (jsonObj.error) {
    throw new Error(`Anidb error: ${jsonObj.error.code} ${jsonObj.error.message}`);
  }

  return jsonObj;
};
