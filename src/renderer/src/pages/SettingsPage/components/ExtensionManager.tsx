import { XMarkIcon } from "@heroicons/react/24/solid";
import { Dropzone } from "@renderer/components/Dropzone/Dropzone";
import {
  useAddExtensionMutation,
  useRemoveExtensionMutation,
} from "@renderer/services/electron/electronMutations";
import { useExtensionStore } from "@renderer/store/extensionStore";
import React from "react";

export const ExtensionManager: React.FC = () => {
  const { mutateAsync } = useAddExtensionMutation();
  const { sources, removeSource } = useExtensionStore();

  const { mutateAsync: removeExtension } = useRemoveExtensionMutation();

  // TODO: this sucks, rewrite this later
  const handleDrop = async (acceptedFiles: File[]) => {
    const renamedFiles = acceptedFiles.map((file) => {
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const extension = file.name.split(".").pop();
      const base64Name = btoa(baseName);

      const newFileName = `${base64Name}.${extension}`;

      return new File([file], newFileName, { type: file.type });
    });

    void mutateAsync({ extensions: renamedFiles });
  };

  const handleRemove = async (name: string) => {
    await removeExtension({ name });
    removeSource(name);
  };

  return (
    <div className="flex max-w-md flex-col gap-2 px-6 py-4">
      <span className="text-lg font-semibold">Extensions:</span>
      {sources.map((source) => (
        <div key={source.name} className="relative flex flex-col rounded-2xl border px-3.5 py-2">
          {!source.isDefault && (
            <button className="absolute right-2 top-2" onClick={() => handleRemove(source.name)}>
              <XMarkIcon className="size-5" />
            </button>
          )}
          {source.info ? (
            <React.Fragment>
              <span className="text-lg font-semibold">{source.info.name}</span>
              <span className="text-sm">{source.info.description}</span>
              <div className="flex gap-4 text-sm text-neutral-400">
                <span className="">Accuracy: {source.info.accuracy}</span>
                <span className="">Availability: {source.info.availability}</span>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <span className="text-lg font-semibold">{atob(source.name.slice(0, -3))}</span>
              <span className="text-sm text-red-400">
                This extension encountered an error. It may be outdated.
              </span>
            </React.Fragment>
          )}
        </div>
      ))}
      <Dropzone
        multiple
        onDrop={handleDrop}
        acceptedFiles={{
          "text/javascript": [".js"],
        }}
        dragActiveText="Drop your extension here"
        dragInactiveText="Drag & drop your extension here"
      />
    </div>
  );
};
