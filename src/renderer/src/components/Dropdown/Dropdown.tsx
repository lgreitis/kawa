import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { twJoin } from "tailwind-merge";

interface IDropdownProps {
  as?: React.ElementType;
  to?:
    | "top end"
    | "top start"
    | "right end"
    | "right start"
    | "bottom end"
    | "bottom start"
    | "left end"
    | "left start";
  origin?: "top-right" | "top-left";
  options: ({
    label: string;
    icon: React.ElementType;
    onClick?: () => void;
    keyboardShortcut?: string;
  } | null)[];
}

export const Dropdown: React.FC<IDropdownProps> = (props) => {
  const { as, to, origin, options } = props;

  return (
    <div className="text-right">
      <Menu>
        {as && <MenuButton as={as} />}
        {/* TODO: add correctly styled default button */}
        {!as && (
          <MenuButton
            as={as}
            className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
          >
            Options
            <ChevronDownIcon className="size-4 fill-white/60" />
          </MenuButton>
        )}

        <MenuItems
          transition
          anchor={{ to: to ?? "bottom end", gap: "8px" }}
          className={twJoin(
            "z-40 w-52 rounded-xl border border-white/10 bg-black/50 p-1 text-sm/6 text-white backdrop-blur-lg focus:outline-none",
            "transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0",
            (origin === "top-right" || !origin) && "origin-top-right",
            origin === "top-left" && "origin-top-left",
          )}
        >
          {options.map((option, index) => {
            if (option === null) {
              return <div key={"divider" + index} className="my-1 h-px bg-white/5" />;
            }

            return (
              <MenuItem key={option.label}>
                <button
                  className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10"
                  onClick={option.onClick}
                >
                  <option.icon className="size-4" />
                  {option.label}
                  <kbd className="ml-auto font-sans text-xs text-white/50">
                    {option.keyboardShortcut}
                  </kbd>
                </button>
              </MenuItem>
            );
          })}
        </MenuItems>
      </Menu>
    </div>
  );
};
