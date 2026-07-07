import { useRouteError } from "react-router-dom";
import { BlurBackgroundContainer } from "./components/containers/BlurBackgroundContainer";
import { TitleBar } from "./components/TitleBar/TitleBar";
import { ScrollArea } from "./components/ScrollArea/ScrollArea";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const queryClient = useQueryClient();

  return (
    <div className="relative">
      <TitleBar />
      <main className="h-dvh overflow-auto">
        <BlurBackgroundContainer>
          <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-3xl text-center">
              <h2 className="text-3xl font-extrabold">Oops! Something went wrong</h2>
              {error instanceof Error && (
                <React.Fragment>
                  <p className="py-2">You can copy this error and report it to a developer</p>
                  <ScrollArea>
                    <div className="flex flex-col rounded-lg bg-black/30 text-left">
                      <code>{error.stack}</code>
                    </div>
                  </ScrollArea>
                </React.Fragment>
              )}
              <button
                className="inline-flex gap-2 rounded-md bg-white px-3 py-2 text-black"
                onClick={() => {
                  void queryClient.clear();
                  window.location.reload();
                }}
              >
                <span>Try again</span>
              </button>
            </div>
          </div>
        </BlurBackgroundContainer>
      </main>
    </div>
  );
};
