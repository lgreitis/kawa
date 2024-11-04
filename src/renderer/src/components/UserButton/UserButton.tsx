import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useCurrentUser } from "@renderer/store/userStore";
import { twMerge } from "tailwind-merge";

interface IUserButtonProps {
  className?: string;
  ref: React.Ref<HTMLButtonElement>;
}

export const UserButton: React.FC<IUserButtonProps> = (props) => {
  const { className, ref, ...rest } = props;
  const user = useCurrentUser();

  return (
    <button
      ref={ref}
      className={twMerge(
        "flex h-7 items-center gap-2 rounded-full bg-black/30 p-2 transition-colors hover:bg-white/20",
        className,
      )}
      {...rest}
    >
      <span className="text-sm font-medium">{user ? user.username : "Login"}</span>
      <div className="size-5 overflow-hidden rounded-full">
        {user?.picture ? <img className="object-cover" src={user.picture} /> : <UserCircleIcon />}
      </div>
    </button>
  );
};
