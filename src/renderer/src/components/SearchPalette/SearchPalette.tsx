import {
  Combobox,
  ComboboxInput,
  Dialog,
  DialogPanel,
  DialogBackdrop,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useMalAnimeSearchQuery } from "@renderer/services/mal/malQueries";
import { useDebounceValue } from "usehooks-ts";
import { ScrollArea } from "../ScrollArea/ScrollArea";
import { useNavigate } from "react-router-dom";
import { Loader } from "../Loader/Loader";

interface ISearchPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const SearchPalette: React.FC<ISearchPaletteProps> = (props) => {
  const { open, setOpen } = props;
  const navigate = useNavigate();

  const [debouncedQuery, setQuery] = useDebounceValue("", 300);

  const { data: searchResults, isLoading } = useMalAnimeSearchQuery({
    q: debouncedQuery,
    limit: 10,
  });

  return (
    <Dialog
      className="relative z-20"
      open={open}
      onClose={() => {
        setOpen(false);
        setQuery("");
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
        <DialogPanel
          transition
          className="mx-auto max-w-xl transform divide-y divide-neutral-800 overflow-hidden rounded-xl bg-black/80 backdrop-blur-md transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <Combobox
            onChange={(malId: number) => {
              if (malId) {
                navigate(`/info/${malId}`);
              }
            }}
          >
            <div className="relative flex items-center">
              <MagnifyingGlassIcon
                className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <ComboboxInput
                autoFocus
                className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                placeholder="Search..."
                onChange={(event) => setQuery(event.target.value)}
                onBlur={() => setOpen(false)}
              />
              {isLoading && <Loader className="mr-4 inline-block text-white" />}
            </div>

            {searchResults && searchResults.data.length > 0 && (
              <ComboboxOptions static className="scroll-py-2 py-2 text-sm text-white">
                <ScrollArea className="h-full max-h-72">
                  {searchResults.data.map((anime) => (
                    <ComboboxOption
                      key={anime.node.id}
                      value={anime.node.id}
                      className="group flex cursor-default select-none items-center gap-2 px-4 py-2 data-[focus]:bg-white/70 data-[focus]:text-black"
                    >
                      {anime.node.main_picture?.medium && (
                        <img
                          className="h-10 w-7 object-cover"
                          src={anime.node.main_picture.medium}
                        />
                      )}
                      <div className="flex flex-col">
                        <span>{anime.node.title}</span>
                        {anime.node.title !== anime.node.alternative_titles.en && (
                          <span className="text-sm text-neutral-300 group-data-[focus]:text-neutral-800">
                            {anime.node.alternative_titles.en}
                          </span>
                        )}
                      </div>
                    </ComboboxOption>
                  ))}
                </ScrollArea>
              </ComboboxOptions>
            )}
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
