import { twMerge } from "tailwind-merge";

interface IProgressProps {
  percent: number;
  className?: string;
}

export const Progress: React.FC<IProgressProps> = (props) => {
  const { percent, className } = props;

  return (
    <div className={twMerge("h-1 w-full overflow-hidden rounded-full bg-black/40", className)}>
      <div
        style={{ width: `${percent}%` }}
        className={twMerge("h-full bg-white transition-all")}
      ></div>
    </div>
  );
};
