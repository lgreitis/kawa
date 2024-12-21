import { useGetExtensionsQuery } from "@renderer/services/electron/electronQueries";
import { useExtensionStore } from "@renderer/store/extensionStore";
import { useEffect, useRef, useState } from "react";
import { BlurBackgroundContainer } from "../containers/BlurBackgroundContainer";
import { useAddExtensionMutation } from "@renderer/services/electron/electronMutations";
import { getDefaultExtensions } from "@renderer/services/extensions/extensionsServices";

interface IExtensionProps {
  children?: React.ReactNode;
}

export const ExtensionLoader: React.FC<IExtensionProps> = (props) => {
  const { children } = props;
  const { data } = useGetExtensionsQuery();
  const { addSource, reset } = useExtensionStore();
  const isAddingRef = useRef(false);
  const { mutateAsync: addExtension } = useAddExtensionMutation();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!data || isAddingRef.current) {
      return;
    }

    isAddingRef.current = true;
    setIsLoading(true);
    const run = async () => {
      const extensions = await getDefaultExtensions().catch(() => []);

      if (extensions.length) {
        for (const extension of extensions) {
          await addSource({
            name: extension.name,
            code: extension.code,
            isDefault: true,
          });
        }
      }

      if (data) {
        for (const extension of data.extensions) {
          await addSource({ name: extension.name, code: extension.code });
        }
      }
      setIsLoading(false);
      isAddingRef.current = false;
    };

    void run();

    return () => {
      reset();
    };
  }, [data, addSource, reset, addExtension]);

  if (isLoading) {
    return (
      <BlurBackgroundContainer>
        <div className="flex h-full items-center justify-center">
          <span>Loading extensions...</span>
        </div>
      </BlurBackgroundContainer>
    );
  }

  return children;
};
