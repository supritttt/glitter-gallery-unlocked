import { Download, Heart, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type FinaleProps = {
  images: string[];
  lines: string[];
  reducedMotion: boolean;
  onReplay: () => void;
  onSave: () => void;
};

export function Finale({ images, lines, reducedMotion, onReplay, onSave }: FinaleProps) {
  const fullText = useMemo(() => lines.join("\n"), [lines]);
  const [typed, setTyped] = useState(() => (reducedMotion ? fullText : ""));

  useEffect(() => {
    if (reducedMotion) {
      setTyped(fullText);
      return;
    }
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTyped(fullText.slice(0, index));
      if (index >= fullText.length) window.clearInterval(timer);
    }, 26);
    return () => window.clearInterval(timer);
  }, [fullText, reducedMotion]);

  return (
    <section className="relative mx-auto mt-24 max-w-2xl px-5 pb-16" role="status">
      <div className="collage-drift" aria-hidden="true">
        {images.slice(0, 9).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt="" />
        ))}
      </div>
      <div className="relative animate-note-rise-static rounded-card border border-primary/35 bg-card/92 p-7 text-center shadow-gallery backdrop-blur-xl sm:p-10">
        <Heart className="mx-auto mb-4 size-5 fill-primary text-primary" aria-hidden="true" />
        <p className="whitespace-pre-line font-display text-2xl leading-[1.45] text-gallery-paper sm:text-3xl">
          {typed}
          {!reducedMotion && typed.length < fullText.length && <span className="type-caret" aria-hidden="true" />}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-full border border-primary/45 bg-primary/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/20"
          >
            <Download className="size-3.5" aria-hidden="true" />
            Save as keepsake
          </button>
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center gap-2 rounded-full border border-gallery-line px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-gallery-paper"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Replay
          </button>
        </div>
      </div>
    </section>
  );
}
