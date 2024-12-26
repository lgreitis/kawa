import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { type ITorrentStatus } from "@shared/types/torrent";
import { type IpcRendererEvent } from "electron";
import prettyBytes from "pretty-bytes";
import { useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";

interface IInformationPopoverProps {
  infoHash: string;
}

export const InformationPopover: React.FC<IInformationPopoverProps> = (props) => {
  const { infoHash } = props;
  const [torrentStatus, setTorrentStatus] = useDebounceValue<ITorrentStatus | null>(null, 1000, {
    maxWait: 2000,
  });

  useEffect(() => {
    const updateData = (_event: IpcRendererEvent, data: ITorrentStatus) => {
      if (data.infoHash !== infoHash) {
        return;
      }
      setTorrentStatus(data);
    };

    window.electron.ipcRenderer.on("torrent:status", updateData);
    return () => {
      window.electron.ipcRenderer.removeAllListeners("torrent:status");
    };
  }, [infoHash, setTorrentStatus]);

  return (
    <Popover>
      <PopoverButton>
        <InformationCircleIcon className="size-5" />
      </PopoverButton>
      <PopoverPanel
        transition
        anchor={{
          to: "bottom",
          gap: 32,
          padding: 8,
        }}
        className="rounded-xl border border-white/10 bg-black/50 backdrop-blur-lg transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0"
      >
        <div className="flex min-w-48 flex-col px-2 py-1">
          <span>Information:</span>
          <span>Download: {prettyBytes(torrentStatus?.downloadSpeed ?? 0)}/s</span>
          <span>Upload: {prettyBytes(torrentStatus?.uploadSpeed ?? 0)}/s</span>
        </div>
      </PopoverPanel>
    </Popover>
  );
};
