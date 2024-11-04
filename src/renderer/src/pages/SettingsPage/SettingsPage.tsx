import { BlurBackgroundContainer } from "@renderer/components/containers/BlurBackgroundContainer";

import { ExtensionManager } from "./components/ExtensionManager";
import { UserManager } from "./components/UserManager";

export const SettingsPage: React.FC = () => {
  return (
    <BlurBackgroundContainer>
      <ExtensionManager />
      <UserManager />
    </BlurBackgroundContainer>
  );
};
