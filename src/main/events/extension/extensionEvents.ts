import { registerEvent } from "../registerEvent";
import path from "path";
import fs from "fs";
import { APP_DATA_PATH } from "../../constants";

const extensionsDir = path.join(APP_DATA_PATH, "extensions");

const handleGetExtensions = async () => {
  const extensionFiles = fs.readdirSync(extensionsDir).filter((file) => file.endsWith(".js"));

  const extensionCodes = extensionFiles.map((file) => {
    const filePath = path.join(extensionsDir, file);
    const code = fs.readFileSync(filePath, "utf8");
    return { name: file, code };
  });

  return { extensions: extensionCodes };
};

const handleRemoveExtension = async (
  _event: Electron.IpcMainInvokeEvent,
  data: { name: string },
) => {
  const filePath = path.join(extensionsDir, data.name);

  try {
    await fs.promises.unlink(filePath);
    console.log(`Removed extension ${data.name}`);
  } catch (err) {
    console.error(`Error removing extension ${data.name}:`, err);
  }
};

const handleExtensionAdd = async (
  _event: Electron.IpcMainInvokeEvent,
  data: {
    files: {
      fileName: string;
      content: string;
    }[];
  },
) => {
  try {
    await fs.promises.access(extensionsDir);
  } catch {
    await fs.promises.mkdir(extensionsDir, { recursive: true });
  }

  for (const file of data.files) {
    const filePath = path.join(extensionsDir, file.fileName);
    await fs.promises
      .writeFile(filePath, file.content)
      .then(() => console.log(`Added extension ${file.fileName}`))
      .catch((err) => console.error(`Error adding extension ${file.fileName}:`, err));
  }
};

registerEvent("extensionAdd", handleExtensionAdd);
registerEvent("extensionsGet", handleGetExtensions);
registerEvent("extensionRemove", handleRemoveExtension);
