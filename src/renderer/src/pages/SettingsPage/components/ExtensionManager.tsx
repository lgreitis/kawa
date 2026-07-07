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

  const getFallbackName = (name: string) => {
    try {
      return atob(name.slice(0, -3));
    } catch {
      return name;
    }
  };

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Installed extensions</h2>
          <p className="mt-1 text-sm leading-6 text-white/55">
            Manage the source extensions Kawa can use for episode lookup.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/70">
          {sources.length}
        </span>
      </div>

      {sources.length > 0 ? (
        <div className="flex flex-col gap-3">
          {sources.map((source) => (
            <div
              key={source.name}
              className="relative overflow-hidden rounded-md border border-white/10 bg-black/20 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-white">
                      {source.info?.name ?? getFallbackName(source.name)}
                    </h3>
                    {source.isDefault && (
                      <span className="rounded-full bg-[#E8C97E]/15 px-2 py-0.5 text-xs font-medium text-[#E8C97E]">
                        Default
                      </span>
                    )}
                  </div>

                  {source.info ? (
                    <React.Fragment>
                      <p className="mt-1 text-sm leading-6 text-white/55">
                        {source.info.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-white/60">
                        <span className="rounded-full bg-white/10 px-2.5 py-1">
                          Accuracy {source.info.accuracy}
                        </span>
                        <span className="rounded-full bg-white/10 px-2.5 py-1">
                          Availability {source.info.availability}
                        </span>
                      </div>
                    </React.Fragment>
                  ) : (
                    <p className="mt-1 text-sm leading-6 text-red-300">
                      This extension encountered an error. It may be outdated.
                    </p>
                  )}
                </div>

                {!source.isDefault && (
                  <button
                    className="rounded-md p-1.5 text-white/45 transition-colors hover:bg-white/10 hover:text-white"
                    onClick={() => handleRemove(source.name)}
                    aria-label={`Remove ${source.info?.name ?? source.name}`}
                  >
                    <XMarkIcon className="size-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-white/15 bg-black/20 px-4 py-6 text-center text-sm text-white/45">
          No extensions are installed yet.
        </div>
      )}

      <Dropzone
        multiple
        onDrop={handleDrop}
        acceptedFiles={{
          "text/javascript": [".js"],
        }}
        dragActiveText="Drop your extension here"
        dragInactiveText="Drag & drop your extension here"
        className="rounded-md border-white/15 bg-black/20 text-white/65 hover:border-[#E8C97E]/70 hover:text-white"
      />
    </section>
  );
};
