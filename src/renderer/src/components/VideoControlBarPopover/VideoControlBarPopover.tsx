import {
  useFloating,
  autoUpdate,
  offset,
  shift,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId,
} from "@floating-ui/react";
import React, { type ComponentType, type ElementType, useState } from "react";
import { twJoin } from "tailwind-merge";

interface IVideoControlBarPopoverProps {
  icon: ComponentType | ElementType;
  children?: React.ReactNode;
}

export const VideoControlBarPopover: React.FC<IVideoControlBarPopoverProps> = (props) => {
  const { icon: Icon, children } = props;

  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top",
    middleware: [offset(32), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const headingId = useId();

  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()}>
        <Icon className="size-5" />
      </button>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className={twJoin(
              "rounded-xl border border-white/10 bg-black/50 text-base font-normal backdrop-blur-lg",
            )}
            ref={refs.setFloating}
            style={floatingStyles}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            {children}
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};
