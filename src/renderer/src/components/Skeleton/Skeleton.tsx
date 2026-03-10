import { twMerge } from "tailwind-merge";

interface ISkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<ISkeletonProps> = ({ className }) => {
  return <div className={twMerge("animate-pulse rounded-md bg-white/10", className)} />;
};
