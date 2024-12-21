import { createHashRouter, RouterProvider } from "react-router-dom";
import "./app.css";
import React from "react";
import { HomePage } from "./pages/HomePage";
import { MainLayout } from "./components/layouts/MainLayout";
import { QueryClientProvider } from "@tanstack/react-query";
import { StreamPage } from "./pages/StreamPage/StreamPage";
import { InfoPage } from "./pages/InfoPage/InfoPage";
import { WatchPage } from "./pages/WatchPage/WatchPage";
import { queryClient } from "./queryClient";
import { SettingsPage } from "./pages/SettingsPage/SettingsPage";
import { AnimeListPage } from "./pages/AnimeListPage/AnimeListPage";
import { MalAuthListener } from "./listeners/MalAuthListener";
import { Toaster } from "sonner";
import { ErrorBoundary } from "./ErrorBoundary";

const router = createHashRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/info/:malId", element: <InfoPage /> },
      { path: "/stream/:malId/:episode", element: <StreamPage /> },
      { path: "/watch/:url", element: <WatchPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/list", element: <AnimeListPage /> },
    ],
  },
]);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MalAuthListener />
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          style: {
            background: "rgba(0, 0, 0, 0.4)",
          },
          className: "backdrop-blur-md border-none",
        }}
        position="top-right"
        theme="dark"
        offset={48}
      />
      {/* {IS_DEV && <ReactQueryDevtools />} */}
    </QueryClientProvider>
  );
};

export default App;
