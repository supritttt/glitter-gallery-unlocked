import { useCallback, useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";

import track from "@/assets/idk-how.mp3.asset.json";

// The song plays at its original speed (tempo = 1) while the pitch is dropped
// a couple of semitones, so the vocals sound deep/slowed without dragging the beat.
const PITCH_SEMITONES = -2;
const VOLUME = 0.22;

export function BackgroundMusic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const shifterRef = useRef<
    import("soundtouchjs").PitchShifter | null
  >(null);
  const [playing, setPlaying] = useState(false);

  const setup = useCallback(async (): Promise<AudioContext | null> => {
    let disposed = false;
    const ctx = new AudioContext();
    try {
      const response = await fetch(track.url);
      const raw = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(raw);
      if (disposed) return null;

      const { PitchShifter } = await import("soundtouchjs");
      if (disposed) return null;

      const shifter = new PitchShifter(ctx, audioBuffer, 16384);
      shifter.tempo = 1;
      shifter.pitchSemitones = PITCH_SEMITONES;
      // Loop seamlessly: jump back to the start when the song finishes.
      shifter.on("play", (data) => {
        if (data && data.percentagePlayed >= 100) {
          shifter.percentagePlayed = 0;
        }
      });

      const gain = ctx.createGain();
      gain.gain.value = VOLUME;
      shifter.connect(gain);
      gain.connect(ctx.destination);

      ctxRef.current = ctx;
      shifterRef.current = shifter;
      return ctx;
    } catch (error) {
      void ctx.close().catch(() => undefined);
      if (!disposed) throw error;
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const tryPlay = () => {
      void setup()
        .then((ctx) => {
          if (!ctx || cancelled) return;
          return ctx.resume().then(
            () => {
              if (!cancelled) setPlaying(true);
            },
            () => undefined
          );
        })
        .catch(() => undefined);
    };

    // Autoplay is best-effort; browsers often require a first tap.
    tryPlay();

    const onFirstGesture = () => {
      if (ctxRef.current?.state !== "running") tryPlay();
      window.removeEventListener("pointerdown", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture);

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", onFirstGesture);
      shifterRef.current?.disconnect();
      shifterRef.current = null;
      void ctxRef.current?.close().catch(() => undefined);
      ctxRef.current = null;
    };
  }, [setup]);

  const toggle = () => {
    const ctx = ctxRef.current;
    if (!ctx || !shifterRef.current) return;
    if (ctx.state === "running") {
      void ctx.suspend().then(
        () => setPlaying(false),
        () => undefined
      );
    } else {
      void ctx.resume().then(
        () => setPlaying(true),
        () => undefined
      );
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pause background music" : "Play background music"}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 inline-flex size-11 items-center justify-center rounded-full border border-gallery-line bg-background/85 text-primary shadow-gallery backdrop-blur-xl transition-colors hover:bg-card"
    >
      {playing ? <Music className="size-4 animate-pulse" aria-hidden="true" /> : <VolumeX className="size-4" aria-hidden="true" />}
    </button>
  );
}
