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
  const columns = 3;
  const cell = 480;
  const gap = 20;
  const padding = 44;
  const rows = Math.ceil(images.length / columns);
  const canvas = document.createElement("canvas");
  canvas.width = padding * 2 + columns * cell + (columns - 1) * gap;
  canvas.height = padding * 2 + rows * (cell * 1.25) + (rows - 1) * gap + 150;
  const context = canvas.getContext("2d");
  if (!context) return;

  // Background - rich dark charcoal
  context.fillStyle = "#121418";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Outer gold accent frame
  context.strokeStyle = "rgba(218, 175, 95, 0.35)";
  context.lineWidth = 2;
  context.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

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
    const y = padding + row * (cell * 1.25 + gap);
    const height = cell * 1.25;
    const scale = Math.max(cell / image.width, height / image.height);
    const width = image.width * scale;
    const drawHeight = image.height * scale;

    context.save();
    context.beginPath();
    // Rounded photo frame
    const r = 12;
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

    // Subtle border around each picture
    context.strokeStyle = "rgba(255, 255, 255, 0.12)";
    context.lineWidth = 1.5;
    context.strokeRect(x, y, cell, height);
  });

  // Typography header & footer
  context.fillStyle = "#f5eee2";
  context.textAlign = "center";
  context.font = "600 44px 'Cormorant Garamond', Georgia, serif";
  context.fillText(title, canvas.width / 2, canvas.height - 76);

  context.fillStyle = "rgba(218, 175, 95, 0.85)";
  context.font = "500 20px 'Manrope', sans-serif";
  context.letterSpacing = "3px";
  context.fillText("SOME MOMENTS ARE WORTH UNCOVERING TWICE", canvas.width / 2, canvas.height - 40);

  try {
    const link = document.createElement("a");
    link.download = "our-treasured-memories.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("Failed to generate keepsake data URL", err);
  }
}
