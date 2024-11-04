import { useGetExtensionsQuery } from "@renderer/services/electron/electronQueries";
import { useExtensionStore } from "@renderer/store/extensionStore";
import { useEffect } from "react";

export const ExtensionLoader: React.FC = () => {
  const { data } = useGetExtensionsQuery();
  const { addSource } = useExtensionStore();

  useEffect(() => {
    if (data) {
      const run = async () => {
        for await (const extension of data.extensions) {
          await addSource({ name: extension.name, code: extension.code });
        }
      };

      void run();
    }
  }, [data, addSource]);

  return null;
};
