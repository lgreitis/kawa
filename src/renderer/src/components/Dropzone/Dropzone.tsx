import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import { type DropEvent, type FileRejection, useDropzone, type Accept } from "react-dropzone";
import { twMerge } from "tailwind-merge";

interface IDropzoneProps {
  multiple?: boolean;
  onDrop?: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => void;
  disabled?: boolean;
  acceptedFiles?: Accept;
  className?: string;
  dragActiveText: string;
  dragInactiveText: string;
}

export const Dropzone: React.FC<IDropzoneProps> = (props) => {
  const {
    multiple,
    onDrop,
    disabled,
    acceptedFiles,
    className,
    dragActiveText,
    dragInactiveText,
    ...rest
  } = props;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple,
    accept: acceptedFiles,
    onDrop,
    ...rest,
  });

  return (
    <div
      {...getRootProps()}
      className={twMerge(
        "flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed px-3.5 py-6 transition-colors duration-100",
        disabled && "bg-base-light-grey",
        className,
      )}
    >
      <input {...getInputProps()} />
      <ArrowUpOnSquareIcon className="size-10" />
      {isDragActive ? <span>{dragActiveText}</span> : <span>{dragInactiveText}</span>}
    </div>
  );
};
