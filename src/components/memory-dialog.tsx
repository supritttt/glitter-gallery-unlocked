import { Heart, Sparkles, X } from "lucide-react";
import { useEffect } from "react";

import type { Memory } from "@/lib/memories";

type MemoryDialogProps = {
  memory: (Memory & { position: number | string }) | null;
  onClose: () => void;
};

export function MemoryDialog({ memory, onClose }: MemoryDialogProps) {
  useEffect(() => {
    if (!memory) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Prevent background scrolling while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [memory, onClose]);

  if (!memory) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={memory.caption}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-background/88 p-4 backdrop-blur-xl animate-note-fade"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-card border border-gallery-line bg-card shadow-2xl transition-all"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close memory view"
          className="absolute right-3.5 top-3.5 z-10 inline-flex size-9 items-center justify-center rounded-full border border-gallery-line bg-background/80 text-gallery-paper shadow-md backdrop-blur-md transition-colors hover:bg-card hover:text-primary"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
          <img
            src={memory.image}
            alt={memory.caption}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent" />
        </div>

        <div className="px-6 pb-8 pt-4 text-center sm:px-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="size-3" />
            <span>
              {typeof memory.position === "number"
                ? `Memory ${String(memory.position).padStart(2, "0")}`
                : memory.position}{" "}
              · {memory.date}
            </span>
          </div>

          <h2 className="mt-4 font-display text-3xl font-medium text-gallery-paper sm:text-4xl">
            {memory.caption}
          </h2>

          <div className="mt-4 rounded-xl border border-gallery-line/50 bg-background/40 p-5 text-sm leading-7 text-muted-foreground sm:text-base">
            <Heart className="mx-auto mb-2 size-4 fill-primary/30 text-primary/70" />
            <p className="italic text-gallery-paper/90">"{memory.note}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
