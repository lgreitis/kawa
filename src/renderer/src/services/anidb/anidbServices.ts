import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { type IAnidbAnimeData } from "./anidbTypes";
import { RateLimiter } from "@renderer/utils/RateLimiter";

const clientVer = 9;
// TODO: change this lmao
const clientName = "clientname";

const rateLimiter = new RateLimiter(1000, 5000, 300000);

export const getAnidbAnimeInfo = async (anidbId: number) => {
  await rateLimiter.wait();

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
