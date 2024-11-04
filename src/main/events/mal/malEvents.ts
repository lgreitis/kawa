import { shell } from "electron";
import { registerEvent } from "../registerEvent";
import crypto from "crypto";
import axios from "axios";
import { type IMalTokenResponse } from "@shared/types/mal";
import { sendIpcData } from "../..";

let codeChallenge: string;

const handleMalAuthStart = async (_event: Electron.IpcMainInvokeEvent) => {
  codeChallenge = crypto.randomBytes(50).toString("base64url");

  const searchParams = new URLSearchParams({
    grant_type: "write:users",
    client_id: import.meta.env.VITE_MAL_CLIENT_ID,
    code_challenge: codeChallenge,
    redirect_uri: import.meta.env.VITE_MAL_REDIRECT_URI,
    response_type: "code",
  }).toString();

  void shell.openExternal(`https://myanimelist.net/v1/oauth2/authorize?${searchParams}`);
};

// TODO: put this code somewhere else
export const handleMalAuthCallback = async (url: string) => {
  const parsedUrl = new URL(url);
  const code = parsedUrl.searchParams.get("code");

  if (!codeChallenge) {
    return;
  }

  const body = {
    grant_type: "authorization_code",
    client_id: import.meta.env.VITE_MAL_CLIENT_ID,
    code: code,
    redirect_uri: import.meta.env.VITE_MAL_REDIRECT_URI,
    code_verifier: codeChallenge,
  };

  const res = await axios.post<IMalTokenResponse>(`https://myanimelist.net/v1/oauth2/token`, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  void sendIpcData("app-data", res?.data);
};

registerEvent("malAuthStart", handleMalAuthStart);
