import { Outlet } from "react-router-dom";
import { TitleBar } from "../TitleBar/TitleBar";

export const MainLayout: React.FC = () => {
  return (
    <div className="relative">
      <TitleBar />
      <main className="h-dvh overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
