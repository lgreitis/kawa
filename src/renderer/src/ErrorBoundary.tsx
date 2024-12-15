import { useRouteError } from "react-router-dom";
import { BlurBackgroundContainer } from "./components/containers/BlurBackgroundContainer";
import { TitleBar } from "./components/TitleBar/TitleBar";
import { ScrollArea } from "./components/ScrollArea/ScrollArea";
import React from "react";

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();

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
            </div>
          </div>
        </BlurBackgroundContainer>
      </main>
    </div>
  );
};
