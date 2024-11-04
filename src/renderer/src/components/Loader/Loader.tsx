import { twMerge } from "tailwind-merge";
import { LoaderIcon } from "../icons/LoaderIcon";

interface ILoaderPorps {
  className?: string;
}

export const Loader: React.FC<ILoaderPorps> = (props) => {
  const { className } = props;

  return <LoaderIcon className={twMerge("size-6 animate-spin text-neutral-950", className)} />;
};
