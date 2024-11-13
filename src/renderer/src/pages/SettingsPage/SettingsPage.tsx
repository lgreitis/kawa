import { BlurBackgroundContainer } from "@renderer/components/containers/BlurBackgroundContainer";

import { ExtensionManager } from "./components/ExtensionManager";
import { UserManager } from "./components/UserManager";
import { useDownloadFolderSizeQuery } from "@renderer/services/electron/electronQueries";
import prettyBytes from "pretty-bytes";
import { useRemoveAllDownloadsMutation } from "@renderer/services/electron/electronMutations";
import { Loader } from "@renderer/components/Loader/Loader";

export const SettingsPage: React.FC = () => {
  const { data } = useDownloadFolderSizeQuery();
  const { mutateAsync: deleteDownloads, isPending: isRemovingDownloads } =
    useRemoveAllDownloadsMutation();

  const size = data && prettyBytes(data);

  return (
    <BlurBackgroundContainer>
      <ExtensionManager />
      <UserManager />
      {!!size && (
        <div className="flex items-center gap-2 px-6 py-4">
          <button
            className="inline-flex gap-2 rounded-md bg-white px-3 py-2 text-black"
            onClick={() => {
              void deleteDownloads();
            }}
            disabled={isRemovingDownloads}
          >
            <span>Clear downloads folder ({size})</span>
            {isRemovingDownloads && <Loader />}
          </button>
        </div>
      )}
    </BlurBackgroundContainer>
  );
};
