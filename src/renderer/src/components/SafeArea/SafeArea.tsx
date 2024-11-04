import { twMerge } from "tailwind-merge";

interface ISafeAreaProps {
  children?: React.ReactNode;
  className?: string;
}

export const SafeArea: React.FC<ISafeAreaProps> = (props) => {
  const { children, className } = props;

  return <div className={twMerge("pt-9", className)}>{children}</div>;
};
