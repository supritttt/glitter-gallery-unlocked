let sharedContext: AudioContext | null = null;

function getContext() {
  if (typeof window === "undefined") return null;
  const AudioContextConstructor = window.AudioContext;
  if (!AudioContextConstructor) return null;
  sharedContext = sharedContext ?? new AudioContextConstructor();
  if (sharedContext.state === "suspended") void sharedContext.resume();
  return sharedContext;
}

/** Soft harmonic chime played each time a memory is unlocked. */
export function playUnlockChime() {
  const context = getContext();
  if (!context) return;
  const start = context.currentTime;
  // A warm ethereal major triad chime: E5, G#5, B5, E6
  const notes = [659.25, 830.61, 987.77, 1318.51];
  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    const at = start + index * 0.08;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.08, at + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.95);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(at);
    oscillator.stop(at + 1.0);
  });
}

/** Draws every revealed photo into one image file the user can keep. */
export async function downloadKeepsake(images: string[], title: string) {
  const columns = 2;
  const cell = 520;
  const gap = 28;
  const padding = 52;
  const headerHeight = 184;
  const rows = Math.ceil(images.length / columns);
  const canvas = document.createElement("canvas");
  const photoHeight = cell * 1.18;
  canvas.width = padding * 2 + columns * cell + (columns - 1) * gap;
  canvas.height = padding * 2 + headerHeight + rows * photoHeight + (rows - 1) * gap + 154;
  const context = canvas.getContext("2d");
  if (!context) return;

  // Warm scrapbook background
  context.fillStyle = "#241923";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const backgroundGlow = context.createRadialGradient(
    canvas.width * 0.5,
    canvas.height * 0.08,
    20,
    canvas.width * 0.5,
    canvas.height * 0.08,
    canvas.width * 0.72,
  );
  backgroundGlow.addColorStop(0, "rgba(255, 190, 177, 0.18)");
  backgroundGlow.addColorStop(1, "rgba(36, 25, 35, 0)");
  context.fillStyle = backgroundGlow;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Double scrapbook frame
  context.strokeStyle = "rgba(255, 218, 188, 0.55)";
  context.lineWidth = 3;
  context.strokeRect(22, 22, canvas.width - 44, canvas.height - 44);
  context.strokeStyle = "rgba(218, 175, 95, 0.35)";
  context.lineWidth = 1;
  context.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

  // Header ornaments and title
  context.fillStyle = "#ffd3c2";
  context.textAlign = "center";
  context.font = "500 25px 'Manrope', sans-serif";
  context.fillText("A LITTLE COLLECTION OF", canvas.width / 2, 78);
  context.fillStyle = "#fff1e7";
  context.font = "600 58px 'Cormorant Garamond', Georgia, serif";
  context.fillText(title, canvas.width / 2, 132);
  context.fillStyle = "#e8a838";
  context.font = "500 21px 'Manrope', sans-serif";
  context.fillText("made with love, saved forever", canvas.width / 2, 166);

  const drawHeart = (x: number, y: number, scale: number) => {
    context.save();
    context.translate(x, y);
    context.scale(scale, scale);
    context.beginPath();
    context.moveTo(0, 10);
    context.bezierCurveTo(-26, -7, -18, -25, 0, -12);
    context.bezierCurveTo(18, -25, 26, -7, 0, 10);
    context.fillStyle = "#e8a838";
    context.fill();
    context.restore();
  };
  drawHeart(88, 106, 1.1);
  drawHeart(canvas.width - 88, 106, 1.1);

  const loaded = await Promise.all(
    images.map(
      (source) =>
        new Promise<HTMLImageElement | null>((resolve) => {
          const image = new Image();
          image.crossOrigin = "anonymous";
          image.onload = () => resolve(image);
          image.onerror = () => {
            // Fallback without crossOrigin in case CORS header isn't present
            const fallback = new Image();
            fallback.onload = () => resolve(fallback);
            fallback.onerror = () => resolve(null);
            fallback.src = source;
          };
          image.src = source;
        }),
    ),
  );

  loaded.forEach((image, index) => {
    if (!image) return;
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = padding + column * (cell + gap);
    const y = padding + headerHeight + row * (photoHeight + gap);
    const height = photoHeight;
    const scale = Math.max(cell / image.width, height / image.height);
    const width = image.width * scale;
    const drawHeight = image.height * scale;

    context.save();
    context.beginPath();
    // Rounded photo frame with a soft paper border
    context.fillStyle = "rgba(255, 241, 231, 0.94)";
    const r = 22;
    context.beginPath();
    context.moveTo(x + r, y - 8);
    context.arcTo(x + cell + 8, y - 8, x + cell + 8, y + height + 8, r);
    context.arcTo(x + cell + 8, y + height + 8, x - 8, y + height + 8, r);
    context.arcTo(x - 8, y + height + 8, x - 8, y - 8, r);
    context.arcTo(x - 8, y - 8, x + cell + 8, y - 8, r);
    context.closePath();
    context.fill();

    context.moveTo(x + r, y);
    context.arcTo(x + cell, y, x + cell, y + height, r);
    context.arcTo(x + cell, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + cell, y, r);
    context.closePath();
    context.clip();

    try {
      context.drawImage(image, x + (cell - width) / 2, y + (height - drawHeight) / 2, width, drawHeight);
    } catch {
      // Ignored if tainted
    }
    context.restore();

    // Warm border around each picture
    context.strokeStyle = "rgba(255, 211, 194, 0.7)";
    context.lineWidth = 2;
    context.strokeRect(x, y, cell, height);
  });

  // Scrapbook footer
  context.fillStyle = "#fff1e7";
  context.textAlign = "center";
  context.font = "500 38px 'Cormorant Garamond', Georgia, serif";
  context.fillText("Our sweetest little memories", canvas.width / 2, canvas.height - 90);

  context.fillStyle = "rgba(255, 211, 194, 0.9)";
  context.font = "500 18px 'Manrope', sans-serif";
  context.letterSpacing = "3px";
  context.fillText("SOME MOMENTS ARE WORTH KEEPING", canvas.width / 2, canvas.height - 52);

  try {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("Could not create keepsake image");

    const filename = "our-love-story.png";
    const file = new File([blob], filename, { type: "image/png" });
    const canShareFile =
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] });

    if (canShareFile) {
      await navigator.share({
        files: [file],
        title: title,
        text: "Our love story",
      });
      return;
    }

    const link = document.createElement("a");
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return;
    console.error("Failed to share keepsake image", err);
  }
}
