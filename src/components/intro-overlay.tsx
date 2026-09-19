import { Sparkles } from "lucide-react";
import { useState } from "react";

type IntroOverlayProps = {
  name: string;
  count: number;
  onBegin: () => void;
};

export function IntroOverlay({ name, count, onBegin }: IntroOverlayProps) {
  const [leaving, setLeaving] = useState(false);

  const begin = () => {
    setLeaving(true);
    window.setTimeout(onBegin, 520);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background px-6 text-center transition-opacity duration-500 ${leaving ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <div className="ambient-field" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="relative animate-note-fade">
        <Sparkles className="mx-auto mb-6 size-5 text-primary" aria-hidden="true" />
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-primary">For</p>
        <h1 className="mt-4 font-display text-6xl font-medium text-gallery-paper sm:text-8xl">{name}</h1>
        <p className="mx-auto mt-6 max-w-sm text-sm leading-7 text-muted-foreground sm:text-base">
          {count} memories, hidden under silver. Scratch each one to remember.
        </p>
        <button
          type="button"
          onClick={begin}
          className="mt-10 rounded-full border border-primary/45 bg-primary/10 px-9 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary transition-colors hover:bg-primary/20"
        >
          Begin
        </button>
      </div>
    </div>
  );
}
