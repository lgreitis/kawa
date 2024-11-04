import { Dropzone } from "@renderer/components/Dropzone/Dropzone";
import { useAnimeListStore } from "@renderer/store/animeListStore";
import { importMalFile } from "@renderer/utils/malImporter";
import React from "react";

export const MalImportDropzone: React.FC = () => {
  const { importMalData } = useAnimeListStore();

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      const malData = await importMalFile(acceptedFiles[0]);
      importMalData(malData);
    }
  };

  return (
    <Dropzone
      onDrop={onDrop}
      acceptedFiles={{
        "application/gzip": [".xml.gz"],
      }}
      dragActiveText="Drop your MAL export here"
      dragInactiveText="Drag & drop your MAL export here"
    />
  );
};
