import { X } from "lucide-react";
import { useEffect } from "react";

import type { Memory } from "@/lib/memories";

type MemoryDialogProps = {
  memory: (Memory & { position: number }) | null;
  onClose: () => void;
};

export function MemoryDialog({ memory, onClose }: MemoryDialogProps) {
  useEffect(() => {
    if (!memory) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [memory, onClose]);

  if (!memory) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={memory.caption}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-background/92 p-4 backdrop-blur-xl animate-note-fade"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-card border border-gallery-line bg-card shadow-gallery"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close memory"
          className="absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full border border-gallery-line bg-background/80 text-gallery-paper backdrop-blur-md"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
        <img src={memory.image} alt={memory.caption} className="aspect-[4/5] w-full object-cover" />
        <div className="px-6 pb-7 pt-5 text-center">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-primary">
            Memory {String(memory.position).padStart(2, "0")} · {memory.date}
          </p>
          <h2 className="mt-3 font-display text-3xl text-gallery-paper">{memory.caption}</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{memory.note}</p>
        </div>
      </div>
    </div>
  );
}
