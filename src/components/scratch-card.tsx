import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Check, Sparkles } from "lucide-react";

type ScratchCardProps = {
  image: string;
  index: number;
  unlocked: boolean;
  onUnlock: () => void;
};

type Point = { x: number; y: number };

const UNLOCK_THRESHOLD = 0.6;

function cssToken(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function ScratchCard({ image, index, unlocked, onUnlock }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const checkedAtRef = useRef(0);
  const [isFading, setIsFading] = useState(false);

  const paintCoating = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || unlocked) return;
    const bounds = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(bounds.width * ratio));
    canvas.height = Math.max(1, Math.round(bounds.height * ratio));

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    const silverDark = cssToken("--scratch-shadow");
    const silver = cssToken("--scratch-silver");
    const silverLight = cssToken("--scratch-highlight");
    const glitter = cssToken("--scratch-glitter");
    const ink = cssToken("--scratch-ink");
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, silverDark);
    gradient.addColorStop(0.3, silverLight);
    gradient.addColorStop(0.58, silver);
    gradient.addColorStop(0.82, silverLight);
    gradient.addColorStop(1, silverDark);
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    let seed = index * 9_973 + 17;
    const random = () => {
      seed = (seed * 16_807) % 2_147_483_647;
      return seed / 2_147_483_647;
    };
    context.fillStyle = glitter;
    for (let i = 0; i < 760; i += 1) {
      const radius = (0.35 + random() * 1.5) * ratio;
      context.beginPath();
      context.arc(random() * canvas.width, random() * canvas.height, radius, 0, Math.PI * 2);
      context.fill();
    }

    context.fillStyle = ink;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `600 ${Math.round(11 * ratio)}px Manrope, sans-serif`;
    context.fillText("SCRATCH TO REVEAL", canvas.width / 2, canvas.height / 2 - 4 * ratio);
    context.font = `400 ${Math.round(9 * ratio)}px Manrope, sans-serif`;
    context.fillText(`MEMORY ${String(index + 1).padStart(2, "0")}`, canvas.width / 2, canvas.height / 2 + 15 * ratio);
  }, [index, unlocked]);

  useEffect(() => {
    paintCoating();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(paintCoating);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [paintCoating]);

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
    if (!drawingRef.current || unlocked) return;
    const canvas = event.currentTarget;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const lastPoint = lastPointRef.current;
    if (!context || !lastPoint) return;
    const nextPoint = pointFromEvent(event);
    context.globalCompositeOperation = "destination-out";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = Math.max(38, canvas.width * 0.115);
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(nextPoint.x, nextPoint.y);
    context.stroke();
    lastPointRef.current = nextPoint;

    const now = performance.now();
    if (now - checkedAtRef.current > 140) {
      checkedAtRef.current = now;
      if (calculateCleared(context, canvas) >= UNLOCK_THRESHOLD) {
        drawingRef.current = false;
        setIsFading(true);
        window.setTimeout(onUnlock, 430);
      }
    }
  };

  const stopDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false;
    lastPointRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <article className="group relative aspect-[4/5] overflow-hidden rounded-card border border-gallery-line bg-card shadow-gallery">
      <img
        src={image}
        alt={`Revealed memory ${index + 1}`}
        loading={index > 2 ? "lazy" : "eager"}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gallery-scrim px-4 pb-4 pt-14">
        <span className="font-display text-xl text-gallery-paper">Memory {String(index + 1).padStart(2, "0")}</span>
        {unlocked && (
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-success text-success-foreground" aria-label="Unlocked">
            <Check className="size-4" strokeWidth={2} />
          </span>
        )}
      </div>
      {!unlocked && (
        <canvas
          ref={canvasRef}
          aria-label={`Scratch memory ${index + 1} to reveal it`}
          className={`absolute inset-0 h-full w-full touch-none cursor-crosshair transition-opacity duration-500 ${isFading ? "pointer-events-none opacity-0" : "opacity-100"}`}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            drawingRef.current = true;
            lastPointRef.current = pointFromEvent(event);
          }}
          onPointerMove={scratchTo}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          onContextMenu={(event) => event.preventDefault()}
        />
      )}
      {!unlocked && !isFading && (
        <div className="pointer-events-none absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border border-gallery-foil-line bg-gallery-foil/70 text-gallery-ink backdrop-blur-sm">
          <Sparkles className="size-3.5" aria-hidden="true" />
        </div>
      )}
    </article>
  );
}