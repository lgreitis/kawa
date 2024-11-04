import { useGetMalUserMutation } from "@renderer/services/mal/malMutations";
import { useUserStore } from "@renderer/store/userStore";
import { type IMalTokenResponse } from "@shared/types/mal";
import { type IpcRendererEvent } from "electron";
import { useEffect } from "react";

export const MalAuthListener: React.FC = () => {
  const { addUser } = useUserStore();

  const { mutate: getMalUser } = useGetMalUserMutation();

  useEffect(() => {
    const handleLogin = (_event: IpcRendererEvent, data: IMalTokenResponse) => {
      getMalUser(data.access_token, {
        onSuccess: (user) => {
          addUser({
            id: user.id,
            username: user.name,
            picture: user.picture,
            token: data.access_token,
            refreshToken: data.refresh_token,
          });
        },
      });
    };

    window.electron.ipcRenderer.on("app-data", handleLogin);
    return () => {
      window.electron.ipcRenderer.removeAllListeners("app-data");
    };
  }, [getMalUser, addUser]);

  return null;
};
