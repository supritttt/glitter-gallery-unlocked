import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Check, Eye, Maximize2, Sparkles } from "lucide-react";

type ScratchCardProps = {
  image: string;
  index: number;
  caption: string;
  note?: string;
  date?: string;
  unlocked: boolean;
  bonus?: boolean;
  onUnlock: () => void;
  onSelect?: () => void;
};

type Point = { x: number; y: number };
type ScratchAudio = {
  context: AudioContext;
  source: AudioBufferSourceNode;
  gain: GainNode;
  filter: BiquadFilterNode;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
};

const UNLOCK_THRESHOLD = 0.58;

function cssToken(name: string) {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function ScratchCard({
  image,
  index,
  caption,
  note,
  date,
  unlocked,
  bonus = false,
  onUnlock,
  onSelect,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dustCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const checkedAtRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scratchAudioRef = useRef<ScratchAudio | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  const peekTimerRef = useRef<number | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  // Particles system for golden dust
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const reducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const stopScratchSound = useCallback(() => {
    const scratchAudio = scratchAudioRef.current;
    if (!scratchAudio) return;
    const now = scratchAudio.context.currentTime;
    scratchAudio.gain.gain.cancelScheduledValues(now);
    scratchAudio.gain.gain.setValueAtTime(scratchAudio.gain.gain.value, now);
    scratchAudio.gain.gain.linearRampToValueAtTime(0, now + 0.045);
    scratchAudio.source.stop(now + 0.055);
    scratchAudioRef.current = null;
  }, []);

  const startScratchSound = useCallback(() => {
    if (scratchAudioRef.current) return;
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;
    const context = audioContextRef.current ?? new AudioContextConstructor();
    audioContextRef.current = context;
    if (context.state === "suspended") void context.resume();

    const duration = 0.65;
    const buffer = context.createBuffer(1, Math.floor(context.sampleRate * duration), context.sampleRate);
    const samples = buffer.getChannelData(0);
    let previous = 0;
    for (let i = 0; i < samples.length; i += 1) {
      const noise = Math.random() * 2 - 1;
      previous = previous * 0.72 + noise * 0.28;
      samples[i] = previous * (0.55 + Math.sin(i * 0.19) * 0.12);
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    filter.type = "bandpass";
    filter.frequency.value = 1850;
    filter.Q.value = 0.55;
    gain.gain.value = 0.035;
    source.connect(filter).connect(gain).connect(context.destination);
    source.start();
    scratchAudioRef.current = { context, source, gain, filter };
  }, []);

  // Update and render dust particles
  const updateParticles = useCallback(() => {
    const dustCanvas = dustCanvasRef.current;
    if (!dustCanvas) return;
    const ctx = dustCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);

    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (!p) continue;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04; // gentle gravity
      p.alpha -= 0.024;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowColor = "#f5d77f";
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (particles.length > 0) {
      animFrameRef.current = requestAnimationFrame(updateParticles);
    } else {
      animFrameRef.current = null;
    }
  }, []);

  const spawnDustParticles = useCallback(
    (x: number, y: number) => {
      if (reducedMotion.current) return;
      const dustCanvas = dustCanvasRef.current;
      if (!dustCanvas) return;

      const colors = ["#ffd978", "#ffecb3", "#f7c844", "#ffffff"];
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 1.8;
        particlesRef.current.push({
          x: x + (Math.random() * 8 - 4),
          y: y + (Math.random() * 8 - 4),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          size: 1.2 + Math.random() * 2.2,
          alpha: 0.95,
          color: colors[Math.floor(Math.random() * colors.length)] ?? "#ffd978",
        });
      }

      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(updateParticles);
      }
    },
    [updateParticles],
  );

  const paintCoating = useCallback(() => {
    const canvas = canvasRef.current;
    const dustCanvas = dustCanvasRef.current;
    if (!canvas || unlocked) return;
    const bounds = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(bounds.width * ratio));
    canvas.height = Math.max(1, Math.round(bounds.height * ratio));

    if (dustCanvas) {
      dustCanvas.width = canvas.width;
      dustCanvas.height = canvas.height;
    }

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    const silverDark = cssToken("--scratch-shadow") || "#8a8d94";
    const silver = cssToken("--scratch-silver") || "#bcc0c7";
    const silverLight = cssToken("--scratch-highlight") || "#e8ebef";
    const glitter = cssToken("--scratch-glitter") || "rgba(255,255,255,0.6)";
    const ink = cssToken("--scratch-ink") || "rgba(40,40,45,0.85)";

    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, silverDark);
    gradient.addColorStop(0.28, silverLight);
    gradient.addColorStop(0.55, silver);
    gradient.addColorStop(0.82, silverLight);
    gradient.addColorStop(1, silverDark);
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    let seed = (index + 1) * 9_973 + 17;
    const random = () => {
      seed = (seed * 16_807) % 2_147_483_647;
      return seed / 2_147_483_647;
    };
    context.fillStyle = glitter;
    for (let i = 0; i < 780; i += 1) {
      const radius = (0.35 + random() * 1.5) * ratio;
      context.beginPath();
      context.arc(random() * canvas.width, random() * canvas.height, radius, 0, Math.PI * 2);
      context.fill();
    }

    // Border pattern inside coating
    context.strokeStyle = "rgba(255, 255, 255, 0.25)";
    context.lineWidth = 1.5 * ratio;
    context.strokeRect(10 * ratio, 10 * ratio, canvas.width - 20 * ratio, canvas.height - 20 * ratio);

    context.fillStyle = ink;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `600 ${Math.round(11 * ratio)}px Manrope, sans-serif`;
    context.fillText(bonus ? "BONUS MEMORY" : "SCRATCH TO REVEAL", canvas.width / 2, canvas.height / 2 - 5 * ratio);
    context.font = `400 ${Math.round(9 * ratio)}px Manrope, sans-serif`;
    context.fillText(
      bonus ? "A secret for you" : `MEMORY ${String(index + 1).padStart(2, "0")}`,
      canvas.width / 2,
      canvas.height / 2 + 14 * ratio,
    );
  }, [bonus, index, unlocked]);

  useEffect(() => {
    paintCoating();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(paintCoating);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [paintCoating]);

  useEffect(() => {
    if (unlocked) stopScratchSound();
    return () => {
      stopScratchSound();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [stopScratchSound, unlocked]);

  const pointFromEvent = (event: ReactPointerEvent<HTMLCanvasElement>): Point => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - bounds.left) * (event.currentTarget.width / bounds.width),
      y: (event.clientY - bounds.top) * (event.currentTarget.height / bounds.height),
    };
  };

  const calculateCleared = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;
    const stride = 32;
    for (let i = 3; i < pixels.length; i += stride) {
      total += 1;
      if ((pixels[i] ?? 255) < 40) clear += 1;
    }
    return total === 0 ? 0 : clear / total;
  };

  const scratchTo = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    // If user is scratching, cancel long press peek
    if (pointerStartRef.current) {
      const dist = Math.hypot(
        event.clientX - pointerStartRef.current.x,
        event.clientY - pointerStartRef.current.y,
      );
      if (dist > 8) {
        if (peekTimerRef.current) {
          window.clearTimeout(peekTimerRef.current);
          peekTimerRef.current = null;
        }
        if (isPeeking) setIsPeeking(false);
      }
    }

    if (!drawingRef.current || unlocked) return;
    const canvas = event.currentTarget;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const lastPoint = lastPointRef.current;
    if (!context || !lastPoint) return;
    const nextPoint = pointFromEvent(event);
    const distance = Math.hypot(nextPoint.x - lastPoint.x, nextPoint.y - lastPoint.y);

    // Audio feedback
    const scratchAudio = scratchAudioRef.current;
    if (scratchAudio) {
      const now = scratchAudio.context.currentTime;
      scratchAudio.gain.gain.setTargetAtTime(Math.min(0.075, 0.025 + distance / 1_600), now, 0.025);
      scratchAudio.filter.frequency.setTargetAtTime(Math.min(3_100, 1_450 + distance * 12), now, 0.035);
    }

    // Spawn golden dust particles
    spawnDustParticles(nextPoint.x, nextPoint.y);

    context.globalCompositeOperation = "destination-out";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = Math.max(38, canvas.width * 0.12);
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(nextPoint.x, nextPoint.y);
    context.stroke();
    lastPointRef.current = nextPoint;

    const now = performance.now();
    if (now - checkedAtRef.current > 130) {
      checkedAtRef.current = now;
      if (calculateCleared(context, canvas) >= UNLOCK_THRESHOLD) {
        drawingRef.current = false;
        stopScratchSound();
        setIsFading(true);
        setJustUnlocked(true);
        window.setTimeout(() => {
          onUnlock();
          window.setTimeout(() => setJustUnlocked(false), 1400);
        }, 400);
      }
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    lastPointRef.current = pointFromEvent(event);
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    startScratchSound();

    // Start long-press peek timer
    if (peekTimerRef.current) window.clearTimeout(peekTimerRef.current);
    peekTimerRef.current = window.setTimeout(() => {
      setIsPeeking(true);
    }, 450);
  };

  const stopDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false;
    lastPointRef.current = null;
    pointerStartRef.current = null;
    stopScratchSound();

    if (peekTimerRef.current) {
      window.clearTimeout(peekTimerRef.current);
      peekTimerRef.current = null;
    }
    if (isPeeking) {
      setIsPeeking(false); // smoothly re-frosts
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <figure className="group">
      <article
        onClick={unlocked ? onSelect : undefined}
        className={`relative aspect-[4/5] overflow-hidden rounded-card border bg-card shadow-gallery transition-all duration-500 ${
          unlocked
            ? "cursor-pointer border-gallery-line hover:border-primary/50 hover:shadow-xl"
            : "border-gallery-line"
        } ${justUnlocked ? "glow-unlocked border-primary ring-2 ring-primary/40" : ""}`}
      >
        <img
          src={image}
          alt={unlocked ? caption : `Hidden memory ${index + 1}`}
          loading={index > 2 ? "lazy" : "eager"}
          className={`h-full w-full object-cover transition-transform duration-700 ${
            unlocked ? "group-hover:scale-[1.035]" : ""
          }`}
        />

        {/* Bottom card scrim and title banner */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gallery-scrim px-4 pb-4 pt-14">
          <span className="font-display text-xl text-gallery-paper">
            {bonus ? "Bonus Mystery" : `Memory ${String(index + 1).padStart(2, "0")}`}
          </span>
          {unlocked && (
            <span
              className="inline-flex size-7 items-center justify-center rounded-full bg-success text-success-foreground shadow-sm"
              aria-label="Unlocked"
            >
              <Check className="size-4" strokeWidth={2} />
            </span>
          )}
        </div>

        {/* Unlocked hover hint */}
        {unlocked && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/25 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-card/90 px-3.5 py-1.5 text-xs font-semibold text-gallery-paper shadow-gallery backdrop-blur-md">
              <Maximize2 className="size-3 text-primary" />
              View full memory
            </span>
          </div>
        )}

        {/* Silver Scratch Overlay Canvas */}
        {!unlocked && (
          <canvas
            ref={canvasRef}
            aria-label={`Scratch memory ${index + 1} to reveal it`}
            className={`absolute inset-0 h-full w-full touch-pan-y cursor-crosshair transition-opacity ${
              isFading
                ? "pointer-events-none opacity-0 duration-500"
                : isPeeking
                  ? "opacity-20 duration-300"
                  : "opacity-100 duration-500"
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={scratchTo}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onContextMenu={(event) => event.preventDefault()}
          />
        )}

        {/* Golden dust overlay canvas */}
        {!unlocked && (
          <canvas
            ref={dustCanvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
        )}

        {/* Peeking banner indicator */}
        {isPeeking && !unlocked && (
          <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center animate-note-fade">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-background/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-primary shadow-lg backdrop-blur-md">
              <Eye className="size-3.5 animate-pulse" />
              Peeking · Release to re-frost
            </span>
          </div>
        )}

        {/* Top-right sparkle icon on scratch coating */}
        {!unlocked && !isFading && !isPeeking && (
          <div className="pointer-events-none absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border border-gallery-foil-line bg-gallery-foil/70 text-gallery-ink backdrop-blur-sm">
            <Sparkles className="size-3.5" aria-hidden="true" />
          </div>
        )}
      </article>

      {/* Caption & Personal Note Area */}
      <figcaption className="min-h-16 px-2 pt-3 text-center">
        {unlocked ? (
          <div
            onClick={onSelect}
            className="cursor-pointer group/caption focus:outline-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelect?.();
            }}
          >
            <p className="font-display text-xl text-gallery-paper transition-colors group-hover/caption:text-primary">
              {caption}
            </p>
            {note && (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2 italic">
                "{note}"
              </p>
            )}
            {date && (
              <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-wider text-primary/80">
                {date} · Tap to read note
              </p>
            )}
          </div>
        ) : (
          <div className="transition-opacity duration-300 opacity-60">
            <p className="font-display text-lg text-gallery-paper">
              {bonus ? "A secret bonus memory" : `Memory ${String(index + 1).padStart(2, "0")}`}
            </p>
            <p className="mt-0.5 text-[0.7rem] uppercase tracking-wider text-muted-foreground">
              Scratch or hold to peek
            </p>
          </div>
        )}
      </figcaption>
    </figure>
  );
}