import { Heart, Sparkles } from "lucide-react";
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
    window.setTimeout(onBegin, 550);
  };

  return (
    <div
      role="banner"
      aria-label="Welcome screen"
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background px-6 text-center transition-all duration-500 ease-out ${
        leaving ? "pointer-events-none scale-105 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      <div className="ambient-field" aria-hidden="true">
        {Array.from({ length: 24 }, (_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className="relative z-10 max-w-lg animate-note-fade">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary shadow-lg backdrop-blur-md">
          <Sparkles className="size-5 animate-pulse text-primary" aria-hidden="true" />
        </div>

        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.35em] text-primary">
          A heartfelt collection
        </p>

        <h1 className="mt-4 font-display text-6xl font-medium tracking-tight text-gallery-paper sm:text-7xl md:text-8xl">
          {name}
        </h1>

        <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <p className="mx-auto mt-6 max-w-sm font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
          <span className="font-semibold text-gallery-paper">{count} memories</span> hidden under silver.
          <br />
          Scratch to remember.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={begin}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-primary/50 bg-primary/15 px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-primary hover:bg-primary/25 hover:shadow-primary/20"
          >
            <span>Begin</span>
            <Heart className="size-3.5 fill-primary text-primary transition-transform group-hover:scale-125" />
          </button>
          <span className="text-[0.68rem] text-muted-foreground/60">
            Tap to start our journey
          </span>
        </div>
      </div>
    </div>
  );
}
