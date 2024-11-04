import { twMerge } from "tailwind-merge";

interface IBadgeProps {
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<IBadgeProps> = (props) => {
  const { children, className } = props;

  return (
    <div
      className={twMerge(
        "inline-flex w-fit items-center whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-black",
        className,
      )}
    >
      {children}
    </div>
  );
};
