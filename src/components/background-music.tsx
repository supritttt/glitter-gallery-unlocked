import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";

// The uploaded track plays exactly as-is, softly behind the page.
const PLAYBACK_RATE = 1;
const VOLUME = 0.28;
const TRACK_URL = "/music/background.mp3";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const playAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  useEffect(() => {
    const audio = new Audio(TRACK_URL);
    audio.loop = true;
    audio.preservesPitch = true;
    audio.playbackRate = PLAYBACK_RATE;
    audio.volume = VOLUME;
    audioRef.current = audio;

    // Autoplay is best-effort; browsers often require a first tap.
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => undefined);

    const onFirstGesture = () => {
      if (audio.paused) playAudio();
      window.removeEventListener("pointerdown", onFirstGesture);
    };
    const onStartMusic = () => playAudio();
    window.addEventListener("pointerdown", onFirstGesture);
    window.addEventListener("start-background-music", onStartMusic);

    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("start-background-music", onStartMusic);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      playAudio();
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
