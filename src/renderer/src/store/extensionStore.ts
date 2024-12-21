import { type AbstractSource } from "@lgreitis/kawa-sdk";
import { create } from "zustand";
import * as Comlink from "comlink";
import { sleep } from "@renderer/utils/utils";

interface ISourceInfo {
  name: AbstractSource["name"];
  description: AbstractSource["description"];
  accuracy: AbstractSource["accuracy"];
  availability: AbstractSource["availability"];
}

interface ISource {
  importedModule?: Comlink.Remote<AbstractSource>;
  info?: ISourceInfo;
  isDefault?: boolean;
  name: string;
}

interface IExtensionStore {
  sources: ISource[];
  addSource: (sources: { name: string; code: string; isDefault?: boolean }) => Promise<ISource>;
  removeSource: (name: string) => void;
  reset: () => void;
}

export const useExtensionStore = create<IExtensionStore>((set, get) => ({
  sources: [],
  addSource: async (source) => {
    if (get().sources.some((s) => s.name === source.name)) {
      get().removeSource(source.name);
    }

    let abstractSourceInstance: Comlink.Remote<AbstractSource> | undefined;
    let info: ISourceInfo | undefined;

    try {
      const blob = new Blob([source.code], { type: "text/javascript" });
      const moduleUrl = URL.createObjectURL(blob);

      const worker = new Worker(moduleUrl, { type: "module" });
      const SourceClass = Comlink.wrap<new () => AbstractSource>(worker);

      abstractSourceInstance = await Promise.race([
        new SourceClass(),
        sleep(200).then(() => undefined),
      ]);

      if (abstractSourceInstance) {
        info = {
          name: await abstractSourceInstance.name,
          description: await abstractSourceInstance.description,
          accuracy: await abstractSourceInstance.accuracy,
          availability: await abstractSourceInstance.availability,
        };
      }
    } catch (error) {
      console.error("Failed to import source", source.name);
      console.error(error);
    }

    const importedSource: ISource = {
      importedModule: abstractSourceInstance,
      info: info,
      name: source.name,
      isDefault: source.isDefault,
    };

    set((state) => ({
      sources: [...state.sources, importedSource],
    }));
    return importedSource;
  },
  removeSource: (name) => {
    set((state) => ({
      sources: state.sources.filter((source) => source.name !== name),
    }));
  },
  reset: () => set({ sources: [] }),
}));
