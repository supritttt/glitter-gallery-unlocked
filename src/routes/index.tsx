import { createFileRoute } from "@tanstack/react-router";
import confetti from "canvas-confetti";
import { Heart, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import photo01 from "@/assets/SaveClip.App_658498508_18083375588581606_6467128962319141064_n.jpg.asset.json";
import photo02 from "@/assets/SaveClip.App_670966024_18089894888581606_4219233217059532802_n.jpg.asset.json";
import photo03 from "@/assets/SaveClip.App_700419298_18089894870581606_2697602208727002805_n.jpg.asset.json";
import photo04 from "@/assets/SaveClip.App_702093595_18089894879581606_3894618027456060074_n.jpg.asset.json";
import photo05 from "@/assets/SaveClip.App_723491185_18093754157581606_6668784199136083627_n.jpg.asset.json";
import photo06 from "@/assets/SaveClip.App_723988381_18093754202581606_2376780900211667041_n.jpg.asset.json";
import photo07 from "@/assets/SaveClip.App_724092453_18093754187581606_649781097160943115_n.jpg.asset.json";
import photo08 from "@/assets/SaveClip.App_793867456_18105278330581606_920480787757312739_n.jpg.asset.json";
import photo09 from "@/assets/SaveClip.App_795252474_18105278246581606_6601809545290298397_n.jpg.asset.json";
import photo10 from "@/assets/SaveClip.App_802298427_18105936572581606_22816562041446178_n.jpg.asset.json";
import { ScratchCard } from "@/components/scratch-card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scratch-Off Gallery | Our Memories" },
      {
        name: "description",
        content: "Scratch away the silver to uncover twelve treasured memories and a special message.",
      },
      { property: "og:title", content: "Scratch-Off Gallery | Our Memories" },
      {
        property: "og:description",
        content: "Scratch away the silver to uncover twelve treasured memories and a special message.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const memories = [
  { image: photo01.url, caption: "A little mirror moment" },
  { image: photo02.url, caption: "Elegance in every reflection" },
  { image: photo03.url, caption: "Silver saree, city lights" },
  { image: photo04.url, caption: "A moonlit walk to remember" },
  { image: photo05.url, caption: "Lost in the garden lights" },
  { image: photo06.url, caption: "A perfect evening glow" },
  { image: photo07.url, caption: "Nails, rings, and a little sparkle" },
  { image: photo08.url, caption: "Dancing beneath the blue light" },
  { image: photo09.url, caption: "A quiet moment after the celebration" },
  { image: photo10.url, caption: "Wrapped in color and confidence" },
  { image: photo01.url, caption: "That smile in the mirror" },
  { image: photo06.url, caption: "One more night under the palms" },
];

function Index() {
  const [unlocked, setUnlocked] = useState<Set<number>>(() => new Set());
  const celebratedRef = useRef(false);
  const complete = unlocked.size === memories.length;
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    if (!complete || celebratedRef.current) return;
    celebratedRef.current = true;
    if (!reducedMotion) {
      const end = Date.now() + 1_350;
      const colors = ["#f0c675", "#f5eee2", "#8fb9ad"];
      const burst = () => {
        confetti({ particleCount: 7, angle: 60, spread: 60, origin: { x: 0, y: 0.82 }, colors });
        confetti({ particleCount: 7, angle: 120, spread: 60, origin: { x: 1, y: 0.82 }, colors });
        if (Date.now() < end) requestAnimationFrame(burst);
      };
      burst();
    }
  }, [complete, reducedMotion]);

  const unlockMemory = (index: number) => {
    setUnlocked((current) => {
      if (current.has(index)) return current;
      const next = new Set(current);
      next.add(index);
      return next;
    });
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background pb-36 text-foreground">
      <div className="ambient-field" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="sticky top-0 z-30 flex justify-center px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div
          className="flex min-w-56 items-center justify-center gap-2 rounded-full border border-gallery-line bg-background/88 px-5 py-2.5 shadow-gallery backdrop-blur-xl"
          aria-live="polite"
        >
          <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase text-gallery-paper">
            {unlocked.size} / {memories.length} Memories Unlocked
          </span>
        </div>
      </div>

      <header className="mx-auto max-w-4xl px-5 pb-12 pt-14 text-center sm:pb-16 sm:pt-20">
        <p className="mb-5 text-[0.68rem] font-semibold uppercase text-primary">A collection made for you</p>
        <h1 className="font-display text-5xl leading-[0.95] font-medium text-gallery-paper sm:text-7xl">
          Beneath the silver,
          <br />our story waits.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          Scratch side to side to bring a moment back into view — swipe up or down to scroll.
        </p>
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:gap-6" aria-label="Twelve hidden memories">
        {memories.map((memory, index) => (
          <ScratchCard
            key={`${memory.image}-${index}`}
            image={memory.image}
            caption={memory.caption}
            index={index}
            unlocked={unlocked.has(index)}
            onUnlock={() => unlockMemory(index)}
          />
        ))}
      </section>

      <footer className="mx-auto max-w-2xl px-6 pb-6 pt-20 text-center">
        <p className="font-display text-2xl italic text-muted-foreground">Some moments are worth uncovering twice.</p>
      </footer>

      {complete && (
        <aside className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100%-2rem)] max-w-lg animate-note-rise rounded-card border border-primary/35 bg-card/95 p-5 text-center shadow-gallery backdrop-blur-xl sm:p-6" role="status">
          <Heart className="mx-auto mb-2 size-5 fill-primary text-primary" aria-hidden="true" />
          <h2 className="font-display text-2xl text-gallery-paper sm:text-3xl">Every memory is brighter with you in it.</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Here’s to everything we’ve shared—and all the beautiful moments still waiting for us.</p>
        </aside>
      )}
    </main>
  );
}
