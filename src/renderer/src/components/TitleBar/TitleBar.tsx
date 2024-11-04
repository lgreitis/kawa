import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  XMarkIcon,
  HomeIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { SearchPalette } from "../SearchPalette/SearchPalette";
import { useEffect, useState } from "react";
import { useKeyPress } from "@xyflow/react";
import { isMac, isWindows } from "@renderer/utils/osUtils";
import { twMerge } from "tailwind-merge";
import { UserTitleBarSection } from "../UserTitleBarSection/UserTitleBarSection";

export const TitleBar: React.FC = () => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const keyPress = useKeyPress(["Meta+k", "Control+k"]);

  useEffect(() => {
    if (keyPress) {
      setSearchOpen(true);
    }
  }, [keyPress]);

  return (
    <header className="absolute left-0 top-0 z-50 h-9 w-full select-none bg-black/30 backdrop-blur-md">
      <SearchPalette open={searchOpen} setOpen={setSearchOpen} />
      <div className="flex h-full w-full">
        {isMac && <div className="h-full w-20 min-w-20 region-drag"></div>}
        <div className={twMerge("flex h-full items-center justify-start", !isMac && "ml-1")}>
          <button
            className="mr-2 rounded-md p-1 transition-colors hover:bg-black/30"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="size-4" />
          </button>
          <button
            className="mb-[0.5px] rounded-md p-1 transition-colors hover:bg-black/30"
            onClick={() => navigate(1)}
          >
            <ArrowRightIcon className="size-4" />
          </button>
          <button
            className="ml-2 rounded-md p-1 transition-colors hover:bg-black/30"
            onClick={() => navigate("/")}
          >
            <HomeIcon className="size-4" />
          </button>
        </div>
        <div className="h-full w-full region-drag"></div>
        <div className="mr-1 flex h-full items-center justify-start">
          <button
            className="mr-2 rounded-md p-1 transition-colors hover:bg-black/30"
            onClick={() => setSearchOpen(true)}
          >
            <MagnifyingGlassIcon className="m-auto size-4" />
          </button>
          <UserTitleBarSection setSearchOpen={setSearchOpen} />
        </div>
        {isWindows && (
          <div className="flex">
            <button
              className="flex w-10 items-center justify-center hover:bg-black/40"
              onClick={() => window.electron.ipcRenderer.invoke("window:minimize")}
            >
              <MinusIcon className="size-4" />
            </button>
            <button
              className="flex w-10 items-center justify-center hover:bg-black/40"
              onClick={() => window.electron.ipcRenderer.invoke("window:maximize")}
            >
              <StopIcon className="size-4" />
            </button>
            <button
              className="flex w-10 items-center justify-center hover:bg-red-600"
              onClick={() => window.electron.ipcRenderer.invoke("window:close")}
            >
              <XMarkIcon className="size-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
