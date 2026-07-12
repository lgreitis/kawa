import { useEffect } from "react";

type KeyboardShortcutOptions = {
  key: string;
  onTrigger: () => void;
};

/**
 * Listens for Cmd/Ctrl plus a single key, including when an input is focused.
 */
export const useKeyboardShortcut = ({ key, onTrigger }: KeyboardShortcutOptions) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const hasExactlyOnePrimaryModifier = event.metaKey !== event.ctrlKey;

      if (
        event.repeat ||
        event.isComposing ||
        !hasExactlyOnePrimaryModifier ||
        event.altKey ||
        event.shiftKey ||
        event.key.toLowerCase() !== key.toLowerCase()
      ) {
        return;
      }

      event.preventDefault();
      onTrigger();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, onTrigger]);
};
