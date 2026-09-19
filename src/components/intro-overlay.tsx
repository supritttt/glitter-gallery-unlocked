import { Heart, Sparkles } from "lucide-react";
import { useState } from "react";

type IntroOverlayProps = {
  name: string;
  creator: string;
  count: number;
  onBegin: () => void;
};

export function IntroOverlay({ name, creator, count, onBegin }: IntroOverlayProps) {
  const [leaving, setLeaving] = useState(false);

  const begin = () => {
    window.dispatchEvent(new Event("start-background-music"));
    setLeaving(true);
    window.setTimeout(onBegin, 550);
  };

  return (
    <div
      role="banner"
      aria-label="Welcome screen"
      className={`fixed inset-0 z-[60] flex min-h-dvh flex-col items-center justify-center overflow-y-auto bg-background px-5 py-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] text-center transition-[opacity,transform,filter] duration-700 ease-out sm:px-8 ${
        leaving ? "pointer-events-none scale-[1.035] opacity-0 blur-[3px]" : "scale-100 opacity-100"
      }`}
    >
      <div className="ambient-field" aria-hidden="true">
        {Array.from({ length: 24 }, (_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className="intro-content relative z-10 w-full max-w-lg animate-intro-content">
        <div className="mx-auto mb-5 flex size-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary shadow-lg backdrop-blur-md sm:size-12">
          <Sparkles className="size-4 animate-pulse text-primary sm:size-5" aria-hidden="true" />
        </div>

        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.25em] text-primary sm:text-[0.68rem] sm:tracking-[0.35em]">
          A heartfelt collection by {creator}
        </p>

        <h1 className="mt-4 font-display text-[clamp(3.25rem,15vw,6rem)] leading-[0.92] font-medium tracking-tight text-gallery-paper sm:text-7xl md:text-8xl">
          {name}
        </h1>

        <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <p className="mx-auto mt-6 max-w-sm px-2 font-sans text-sm leading-relaxed text-muted-foreground sm:text-lg">
          <span className="font-semibold text-gallery-paper">{count} memories</span> hidden under silver.
          <br />
          Scratch to remember.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:mt-10">
          <button
            type="button"
            onClick={begin}
            className="group relative inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-full border border-primary/50 bg-primary/15 px-9 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-primary hover:bg-primary/25 hover:shadow-primary/20 active:scale-[0.98]"
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
