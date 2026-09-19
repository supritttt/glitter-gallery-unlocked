import { createFileRoute } from "@tanstack/react-router";
import { Gift, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { BackgroundMusic } from "@/components/background-music";
import { Finale } from "@/components/finale";
import { IntroOverlay } from "@/components/intro-overlay";
import { MemoryDialog } from "@/components/memory-dialog";
import { ScratchCard } from "@/components/scratch-card";
import { downloadKeepsake, playUnlockChime } from "@/lib/celebration";
import {
  bonusMemory,
  encouragementMilestones,
  memories,
  recipientName,
  type Memory,
} from "@/lib/memories";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Someone made this for you." },
      {
        name: "description",
        content: "12 memories, hidden under silver. Scratch each one to remember.",
      },
      { property: "og:title", content: "Someone made this for you." },
      {
        property: "og:description",
        content: "12 memories, hidden under silver. Scratch each one to remember.",
      },
      { property: "og:image", content: "/cover.jpg" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Someone made this for you." },
      {
        name: "twitter:description",
        content: "12 memories, hidden under silver. Scratch each one to remember.",
      },
      { name: "twitter:image", content: "/cover.jpg" },
    ],
  }),
  component: Index,
});

const FINALE_LINES = [
  "Dear Sonakshi,",
  "Every memory here is a treasure, but my favorite moments are the quiet, everyday ones with you.",
  "Thank you for being the brightest part of every single day, and the most beautiful chapter of my life.",
  "Here's to everything we've shared — and all the memories still waiting to be made.",
];

function Index() {
  const [showIntro, setShowIntro] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("gallery_intro_seen")) {
      setShowIntro(false);
    }
  }, []);

  const [unlocked, setUnlocked] = useState<Set<number>>(() => new Set());
  const [bonusUnlocked, setBonusUnlocked] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<
    (Memory & { position: number | string }) | null
  >(null);

  const bonusSectionRef = useRef<HTMLDivElement>(null);
  const allTwelveUnlocked = unlocked.size === memories.length;

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // Tab title synchronisation
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (unlocked.size === 0) {
      document.title = "Someone made this for you.";
    } else if (unlocked.size < memories.length) {
      document.title = `${unlocked.size} / ${memories.length} unlocked · Our Story`;
    } else {
      document.title = "All unlocked ✨ · Someone made this for you.";
    }
  }, [unlocked.size]);

  // Unlock memory handler
  const unlockMemory = (index: number) => {
    setUnlocked((current) => {
      if (current.has(index)) return current;
      const next = new Set(current);
      next.add(index);
      return next;
    });
    playUnlockChime();
  };

  // Scroll to bonus card when all 12 are completed
  useEffect(() => {
    if (allTwelveUnlocked) {
      const timer = window.setTimeout(() => {
        bonusSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 700);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [allTwelveUnlocked]);

  // Encouragement milestone computation
  const milestoneMessage = useMemo(() => {
    if (unlocked.size >= 12) return encouragementMilestones[12];
    if (unlocked.size >= 8) return encouragementMilestones[8];
    if (unlocked.size >= 4) return encouragementMilestones[4];
    return null;
  }, [unlocked.size]);

  // Handle intro dismissal
  const handleBegin = () => {
    setShowIntro(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("gallery_intro_seen", "true");
    }
  };

  // Handle replay
  const handleReplay = () => {
    setUnlocked(new Set());
    setBonusUnlocked(false);
    setSelectedMemory(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle keepsake download
  const handleSaveKeepsake = () => {
    const revealedImages = memories
      .filter((_, idx) => unlocked.has(idx))
      .map((m) => m.image);
    if (bonusUnlocked) {
      revealedImages.push(bonusMemory.image);
    }
    // Fallback if none or few unlocked
    const imagesToSave = revealedImages.length > 0 ? revealedImages : memories.map((m) => m.image);
    void downloadKeepsake(imagesToSave, "Our Treasured Memories");
  };

  const progressPercent = Math.round((unlocked.size / memories.length) * 100);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background pb-32 text-foreground">
      {/* Opening Moment Intro Screen (Gated once per session) */}
      {showIntro && (
        <IntroOverlay
          name={recipientName}
          count={memories.length}
          onBegin={handleBegin}
        />
      )}

      {/* Full-screen Memory Dialog */}
      <MemoryDialog
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
      />

      {/* Ambient background soundtrack & particles */}
      <BackgroundMusic />
      <div className="ambient-field" aria-hidden="true">
        {Array.from({ length: 22 }, (_, index) => (
          <span key={index} />
        ))}
      </div>

      {/* Sticky Progress Bar Header */}
      <div className="sticky top-0 z-30 flex flex-col items-center px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div
          className="relative flex min-w-64 max-w-xs flex-col items-center overflow-hidden rounded-full border border-gallery-line bg-background/90 px-6 py-2.5 shadow-gallery backdrop-blur-xl transition-all"
          aria-live="polite"
        >
          {/* Progress fill bar background */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/10 via-primary/25 to-primary/35 transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />

          <div className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gallery-paper">
              {unlocked.size} / {memories.length} Memories Unlocked
            </span>
          </div>

          {/* Micro progress line on bottom border of pill */}
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gallery-line/50">
            <div
              className="h-full bg-primary transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Milestone Encouragement Line */}
        {milestoneMessage && (
          <div className="mt-2.5 animate-note-fade">
            <div className="rounded-full border border-primary/35 bg-card/90 px-4 py-1 text-[0.75rem] font-medium text-gallery-paper shadow-md backdrop-blur-md">
              {milestoneMessage}
            </div>
          </div>
        )}
      </div>

      {/* Hero Header */}
      <header className="mx-auto max-w-4xl px-5 pb-10 pt-12 text-center sm:pb-14 sm:pt-16">
        <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-primary">
          A collection made for you
        </p>
        <h1 className="font-display text-5xl leading-[0.95] font-medium text-gallery-paper sm:text-7xl">
          Beneath the silver,
          <br />our story waits.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          Scratch to uncover each moment. Tap any revealed photo to read a personal note from that day.
        </p>
      </header>

      {/* Grid of 12 Memories */}
      <section
        className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:gap-7"
        aria-label="Twelve hidden memories"
      >
        {memories.map((memory, index) => (
          <ScratchCard
            key={`${memory.image}-${index}`}
            image={memory.image}
            caption={memory.caption}
            note={memory.note}
            date={memory.date}
            index={index}
            unlocked={unlocked.has(index)}
            onUnlock={() => unlockMemory(index)}
            onSelect={() =>
              setSelectedMemory({
                ...memory,
                position: index + 1,
              })
            }
          />
        ))}
      </section>

      {/* Hidden 13th Card (Bonus Memory) */}
      {allTwelveUnlocked && (
        <section
          ref={bonusSectionRef}
          className="mx-auto mt-16 max-w-md px-4 text-center animate-note-rise-static"
          aria-label="Secret bonus memory"
        >
          <div className="mb-6 flex flex-col items-center">
            <div className="flex size-11 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary shadow-lg">
              <Gift className="size-5 animate-pulse" />
            </div>
            <h2 className="mt-3 font-display text-3xl text-gallery-paper sm:text-4xl">
              One more memory...
            </h2>
            <p className="mt-1 text-xs uppercase tracking-widest text-primary">
              The one I saved for last
            </p>
          </div>

          <ScratchCard
            image={bonusMemory.image}
            caption={bonusMemory.caption}
            note={bonusMemory.note}
            date={bonusMemory.date}
            index={12}
            bonus={true}
            unlocked={bonusUnlocked}
            onUnlock={() => {
              setBonusUnlocked(true);
              playUnlockChime();
            }}
            onSelect={() =>
              setSelectedMemory({
                ...bonusMemory,
                position: "Secret Memory",
              })
            }
          />
        </section>
      )}

      {/* Finale: Drifting Collage & Typewritten Love Letter */}
      {allTwelveUnlocked && (
        <Finale
          images={[
            ...memories.map((m) => m.image),
            bonusUnlocked ? bonusMemory.image : (memories[0]?.image ?? ""),
          ]}
          lines={FINALE_LINES}
          reducedMotion={reducedMotion}
          onReplay={handleReplay}
          onSave={handleSaveKeepsake}
        />
      )}

      {/* Gentle Footer quote */}
      {!allTwelveUnlocked && (
        <footer className="mx-auto max-w-2xl px-6 pb-6 pt-20 text-center">
          <p className="font-display text-2xl italic text-muted-foreground">
            Some moments are worth uncovering twice.
          </p>
        </footer>
      )}
    </main>
  );
}
