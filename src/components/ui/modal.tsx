"use client";

/**
 * Native <dialog> wrapper: Esc to close, focus trapped by the browser (top layer),
 * focus returned to the trigger on close, click on the backdrop closes.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  label,
  variant = "center",
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  label: string;
  variant?: "center" | "drawer" | "palette";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      returnTo.current = document.activeElement as HTMLElement | null;
      d.showModal();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={() => {
        onClose();
        returnTo.current?.focus?.({ preventScroll: true });
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      className={cn(
        "modal m-0 max-h-none max-w-none bg-transparent p-0 text-fg backdrop:bg-black/45 backdrop:backdrop-blur-[2px]",
        variant === "drawer" && "modal-drawer ml-auto h-dvh w-full sm:w-[min(560px,100vw)]",
        variant === "center" && "modal-center m-auto w-[min(640px,calc(100vw-1.5rem))]",
        variant === "palette" && "modal-center mx-auto mt-[12vh] w-[min(620px,calc(100vw-1.5rem))]",
        className,
      )}
    >
      {open && children}
    </dialog>
  );
}
