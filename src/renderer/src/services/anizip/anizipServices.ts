import axios from "axios";
import { type IAniZipResponse } from "./anizipTypes";

export const getAnizipMappings = async (malId: number) =>
  (await axios.get<IAniZipResponse>(`https://api.ani.zip/mappings?mal_id=${malId}`)).data;
