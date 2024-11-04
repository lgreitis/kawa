import {
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  ListBulletIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "../Dropdown/Dropdown";
import { UserButton } from "../UserButton/UserButton";
import { useCurrentUser } from "@renderer/store/userStore";
import { useStartMalAuthMutation } from "@renderer/services/electron/electronMutations";
import { isMac } from "@renderer/utils/osUtils";

interface IUserTitleBarSectionProps {
  setSearchOpen: (open: boolean) => void;
}

export const UserTitleBarSection: React.FC<IUserTitleBarSectionProps> = (props) => {
  const { setSearchOpen } = props;
  const navigate = useNavigate();
  const { mutateAsync: startMalAuth } = useStartMalAuthMutation();
  const user = useCurrentUser();

  const userOptions = [
    user
      ? {
          label: "My list",
          icon: ListBulletIcon,
          onClick: () => navigate("/list"),
        }
      : {
          label: "Login",
          icon: ArrowRightEndOnRectangleIcon,
          onClick: () => startMalAuth(),
        },
    {
      label: "Search",
      icon: MagnifyingGlassIcon,
      onClick: () => setSearchOpen(true),
      keyboardShortcut: isMac ? "⌘K" : "Ctrl+K",
    },
    null,
    {
      label: "Settings",
      icon: Cog6ToothIcon,
      onClick: () => navigate("/settings"),
    },
  ];

  return <Dropdown as={UserButton} options={userOptions} />;
};
