import { useGetExtensionsQuery } from "@renderer/services/electron/electronQueries";
import { useExtensionStore } from "@renderer/store/extensionStore";
import { useEffect, useRef } from "react";

export const ExtensionLoader: React.FC = () => {
  const { data } = useGetExtensionsQuery();
  const { addSource, reset, sources } = useExtensionStore();
  const isAddingRef = useRef(false);

  useEffect(() => {
    if (!data || isAddingRef.current) {
      return;
    }

    isAddingRef.current = true;
    const run = async () => {
      for (const extension of data.extensions) {
        await addSource({ name: extension.name, code: extension.code });
      }
      isAddingRef.current = false;
    };

    void run();

    return () => {
      reset();
    };
  }, [data, addSource, reset]);

  return null;
};
