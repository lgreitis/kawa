import { Badge } from "@renderer/components/Badge/Badge";
import { type IEpisodeServiceResult } from "@renderer/services/extensions/extensionsServices";
import { twMerge } from "tailwind-merge";

interface StreamButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: IEpisodeServiceResult;
}

export const StreamButton: React.FC<StreamButtonProps> = (props) => {
  const { data, className, ...rest } = props;

  return (
    <button
      className={twMerge(
        "rounded-lg bg-black/60 px-4 py-2 text-left backdrop-blur-md transition-colors hover:bg-black/80 disabled:bg-black",
        className,
      )}
      {...rest}
    >
      <div className="flex flex-col">
        <span className="text-xl font-semibold">{data.releaseGroup ?? "Unknown Group"}</span>
        <span className="text-sm text-gray-400">{data.fileName}</span>
        <div className="flex justify-between pt-2">
          <div>
            <span className="text-sm text-gray-400">{data.seeders ?? 0} seeders</span>
          </div>
          <div className="flex gap-4">
            <div>{data.videoResolution && <Badge>{data.videoResolution}</Badge>}</div>
            <div>{data.source && <Badge>{data.source}</Badge>}</div>
          </div>
        </div>
      </div>
    </button>
  );
};
