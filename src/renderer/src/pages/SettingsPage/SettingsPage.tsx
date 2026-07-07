import { BlurBackgroundContainer } from "@renderer/components/containers/BlurBackgroundContainer";

import { ExtensionManager } from "./components/ExtensionManager";
import { UserManager } from "./components/UserManager";
import { useDownloadFolderSizeQuery } from "@renderer/services/electron/electronQueries";
import prettyBytes from "pretty-bytes";
import { useRemoveAllDownloadsMutation } from "@renderer/services/electron/electronMutations";
import { Loader } from "@renderer/components/Loader/Loader";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FolderIcon, PuzzlePieceIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const settingCategories = [
  {
    title: "Extensions",
    value: "extensions",
    description: "Sources, lookup providers, and imported extension files.",
    icon: PuzzlePieceIcon,
  },
  {
    title: "Accounts",
    value: "accounts",
    description: "Signed-in profiles available on this device.",
    icon: UserCircleIcon,
  },
  {
    title: "Storage",
    value: "storage",
    description: "Local download cache and cleanup actions.",
    icon: FolderIcon,
  },
] as const;

type SettingsCategory = (typeof settingCategories)[number];

const categoryButtonHeight = 32;
const categoryButtonGap = 8;

export const SettingsPage: React.FC = () => {
  const { data } = useDownloadFolderSizeQuery();
  const { mutateAsync: deleteDownloads, isPending: isRemovingDownloads } =
    useRemoveAllDownloadsMutation();
  const [selectedCategory, setSelectedCategory] = useState<SettingsCategory["value"]>("extensions");

  const size = typeof data === "number" ? prettyBytes(data) : undefined;
  const selectedCategoryIndex = Math.max(
    settingCategories.findIndex((category) => category.value === selectedCategory),
    0,
  );
  const activeCategory =
    settingCategories.find((category) => category.value === selectedCategory) ??
    settingCategories[0];

  return (
    <BlurBackgroundContainer>
      <div className="mx-auto flex w-full max-w-5xl gap-8 px-6 py-8">
        <aside className="w-64 shrink-0">
          <div className="sticky top-6 flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-1.5 shadow-2xl shadow-black/20 backdrop-blur">
            <motion.div
              className="pointer-events-none absolute left-1.5 right-1.5 top-1.5 rounded-md bg-[#E8C97E]"
              initial={false}
              animate={{
                y: selectedCategoryIndex * (categoryButtonHeight + categoryButtonGap),
              }}
              transition={{ type: "spring", bounce: 0.28, duration: 0.55 }}
              style={{ height: categoryButtonHeight }}
            />

            {settingCategories.map((category) => {
              const isActive = activeCategory.value === category.value;
              const Icon = category.icon;

              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className="relative z-10 flex h-8 items-center overflow-hidden rounded-md px-2 text-left"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <span className="relative flex items-center gap-2">
                    <Icon className={isActive ? "size-5 text-black" : "size-5 text-white/65"} />
                    <span className="flex min-w-0 flex-col">
                      <span
                        className={
                          isActive
                            ? "font-semibold leading-5 text-black"
                            : "font-semibold leading-5 text-white"
                        }
                      >
                        {category.title}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-5 max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-normal text-white">
              {activeCategory.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/55">{activeCategory.description}</p>
          </div>

          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 12, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.99 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {selectedCategory === "extensions" && <ExtensionManager />}
                {selectedCategory === "accounts" && <UserManager />}
                {selectedCategory === "storage" && (
                  <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-lg font-semibold text-white">Download cache</h2>
                      <p className="text-sm leading-6 text-white/55">
                        Remove downloaded episode files from the local cache. This does not change
                        your account data or extension settings.
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4 rounded-md border border-white/10 bg-black/20 px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-white">Downloads folder</div>
                        <div className="text-sm text-white/45">
                          {size ? `${size} currently stored` : "Size unavailable"}
                        </div>
                      </div>

                      <button
                        className="inline-flex shrink-0 items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#E8C97E] disabled:cursor-not-allowed disabled:bg-white/40"
                        onClick={() => {
                          void deleteDownloads();
                        }}
                        disabled={isRemovingDownloads || !size}
                      >
                        <span>Clear</span>
                        {isRemovingDownloads && <Loader className="size-4" />}
                      </button>
                    </div>
                  </section>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </BlurBackgroundContainer>
  );
};
