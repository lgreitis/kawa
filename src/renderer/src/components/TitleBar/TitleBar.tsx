import { isMac, isWindows } from "@renderer/utils/osUtils";
import { MacTitleBarButtons } from "./components/MacTitleBarButtons";
import { WindowsTitleBarButtons } from "./components/WindowsTitleBarButtons";

export const TitleBar: React.FC = () => {
  return (
    <header className="absolute left-0 top-0 z-50 h-9 w-full select-none bg-black/30 backdrop-blur-md">
      {isMac && <MacTitleBarButtons />}
      {isWindows && <WindowsTitleBarButtons />}
    </header>
  );
};
