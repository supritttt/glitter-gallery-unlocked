import confetti from "canvas-confetti";
import { Download, Heart, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type FinaleProps = {
  images: string[];
  lines: string[];
  reducedMotion: boolean;
  onReplay: () => void;
  onSave: () => void;
};

export function Finale({ images, lines, reducedMotion, onReplay, onSave }: FinaleProps) {
  const fullText = useMemo(() => lines.join("\n\n"), [lines]);
  const [typed, setTyped] = useState(() => (reducedMotion ? fullText : ""));
  const confettiFiredRef = useRef(false);

  // Confetti celebratory burst
  useEffect(() => {
    if (reducedMotion || confettiFiredRef.current) return;
    confettiFiredRef.current = true;

    const colors = ["#f0c675", "#f5eee2", "#8fb9ad", "#ff7b90", "#e8a838"];
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.75 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.75 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [reducedMotion]);

  // Character-interval typewriter effect
  useEffect(() => {
    if (reducedMotion) {
      setTyped(fullText);
      return;
    }
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setTyped(fullText.slice(0, index));
      if (index >= fullText.length) {
        window.clearInterval(interval);
      }
    }, 28);

    return () => window.clearInterval(interval);
  }, [fullText, reducedMotion]);

  return (
    <section
      className="relative mx-auto mt-20 max-w-2xl px-5 pb-20"
      role="status"
      aria-label="Gallery finale and letter"
    >
      {/* Drifting collage background */}
      <div className="collage-drift" aria-hidden="true">
        {images.slice(0, 9).map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt=""
            className="rounded-xl object-cover shadow-2xl transition-transform duration-1000"
          />
        ))}
      </div>

      {/* Foreground letter */}
      <div className="relative z-10 animate-note-rise-static rounded-card border border-primary/40 bg-card/95 p-7 text-center shadow-2xl backdrop-blur-xl sm:p-11">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary shadow-sm">
          <Heart className="size-5 fill-primary text-primary animate-pulse" aria-hidden="true" />
        </div>

        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-primary">
          From the bottom of my heart
        </p>

        <div className="mx-auto mt-3 h-px w-20 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="mt-6 min-h-32 text-left font-display text-xl leading-relaxed text-gallery-paper sm:text-2xl">
          <p className="whitespace-pre-line text-center leading-[1.6]">
            {typed}
            {!reducedMotion && typed.length < fullText.length && (
              <span className="type-caret" aria-hidden="true" />
            )}
          </p>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/15 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-md backdrop-blur-md transition-all hover:scale-105 hover:bg-primary/25 hover:shadow-primary/20"
          >
            <Download className="size-4" aria-hidden="true" />
            Save as keepsake
          </button>

          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center gap-2 rounded-full border border-gallery-line bg-background/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-all hover:border-primary/40 hover:text-gallery-paper"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Replay
          </button>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-[0.72rem] text-muted-foreground/75">
          <Sparkles className="size-3 text-primary" />
          Thank you for every shared moment
        </p>
      </div>
    </section>
  );
}
