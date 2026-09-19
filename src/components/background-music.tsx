import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";

import track from "@/assets/idk-how.mp3.asset.json";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(track.url);
    audio.loop = true;
    audio.volume = 0.22;
    // Slowed-down, soft background feel (slowed + reverb style).
    audio.playbackRate = 0.82;
    if ("preservesPitch" in audio) audio.preservesPitch = false;
    audioRef.current = audio;

    const tryPlay = () => {
      void audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => undefined);
    };
    tryPlay();

    const onFirstGesture = () => {
      if (audio.paused) tryPlay();
      window.removeEventListener("pointerdown", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture);

    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().then(() => setPlaying(true)).catch(() => undefined);
    } else {
      audio.pause();
      setPlaying(false);
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
