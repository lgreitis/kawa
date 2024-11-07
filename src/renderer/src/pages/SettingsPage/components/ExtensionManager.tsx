import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dropzone } from "@renderer/components/Dropzone/Dropzone";
import {
  useAddExtensionMutation,
  useRemoveExtensionMutation,
} from "@renderer/services/electron/electronMutations";
import { useExtensionStore } from "@renderer/store/extensionStore";

export const ExtensionManager: React.FC = () => {
  const { mutateAsync } = useAddExtensionMutation();
  const { sources, removeSource } = useExtensionStore();

  const { mutateAsync: removeExtension } = useRemoveExtensionMutation();

  const handleDrop = async (acceptedFiles: File[]) => {
    void mutateAsync({ extensions: acceptedFiles });
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
          <button className="absolute right-2 top-2" onClick={() => handleRemove(source.name)}>
            <XMarkIcon className="size-5" />
          </button>
          <span className="text-lg font-semibold">{source.importedModule.name}</span>
          <span className="text-sm">{source.importedModule.description}</span>
          <div className="flex gap-4 text-sm text-neutral-400">
            <span className="">Accuracy: {source.importedModule.accuracy}</span>
            <span className="">Availability: {source.importedModule.availability}</span>
          </div>
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
