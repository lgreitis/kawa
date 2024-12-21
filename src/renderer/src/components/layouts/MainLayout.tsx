import { Outlet } from "react-router-dom";
import { TitleBar } from "../TitleBar/TitleBar";
import { ExtensionLoader } from "../ExtensionLoader/ExtensionLoader";

export const MainLayout: React.FC = () => {
  return (
    <div className="relative">
      <TitleBar />
      <main className="h-dvh overflow-auto">
        <ExtensionLoader>
          <Outlet />
        </ExtensionLoader>
      </main>
    </div>
  );
};
