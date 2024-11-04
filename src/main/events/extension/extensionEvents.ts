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
  data: { paths: string[] },
) => {
  try {
    await fs.promises.access(extensionsDir);
  } catch {
    await fs.promises.mkdir(extensionsDir, { recursive: true });
  }

  for (const sourcePath of data.paths) {
    const fileName = path.basename(sourcePath);
    const destinationPath = path.join(extensionsDir, fileName);

    try {
      await fs.promises.cp(sourcePath, destinationPath, { recursive: true });
      console.log(`Copied ${sourcePath} to ${destinationPath}`);
    } catch (err) {
      console.error(`Error copying ${sourcePath} to ${destinationPath}:`, err);
    }
  }
};

registerEvent("extensionAdd", handleExtensionAdd);
registerEvent("extensionsGet", handleGetExtensions);
registerEvent("extensionRemove", handleRemoveExtension);
