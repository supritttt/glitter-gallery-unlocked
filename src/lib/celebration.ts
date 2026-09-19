let sharedContext: AudioContext | null = null;

function getContext() {
  if (typeof window === "undefined") return null;
  const AudioContextConstructor = window.AudioContext;
  if (!AudioContextConstructor) return null;
  sharedContext = sharedContext ?? new AudioContextConstructor();
  if (sharedContext.state === "suspended") void sharedContext.resume();
  return sharedContext;
}

/** Soft two-note chime played each time a memory is unlocked. */
export function playUnlockChime() {
  const context = getContext();
  if (!context) return;
  const start = context.currentTime;
  [880, 1_318.5].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    const at = start + index * 0.11;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.09, at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.9);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(at);
    oscillator.stop(at + 0.95);
  });
}

/** Draws every revealed photo into one image file the user can keep. */
export async function downloadKeepsake(images: string[], title: string) {
  const columns = 3;
  const cell = 480;
  const gap = 18;
  const padding = 40;
  const rows = Math.ceil(images.length / columns);
  const canvas = document.createElement("canvas");
  canvas.width = padding * 2 + columns * cell + (columns - 1) * gap;
  canvas.height = padding * 2 + rows * (cell * 1.25) + (rows - 1) * gap + 120;
  const context = canvas.getContext("2d");
  if (!context) return;

  context.fillStyle = "#16181d";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const loaded = await Promise.all(
    images.map(
      (source) =>
        new Promise<HTMLImageElement | null>((resolve) => {
          const image = new Image();
          image.crossOrigin = "anonymous";
          image.onload = () => resolve(image);
          image.onerror = () => resolve(null);
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
    context.rect(x, y, cell, height);
    context.clip();
    context.drawImage(image, x + (cell - width) / 2, y + (height - drawHeight) / 2, width, drawHeight);
    context.restore();
  });

  context.fillStyle = "#e8d9b5";
  context.textAlign = "center";
  context.font = "500 46px Georgia, serif";
  context.fillText(title, canvas.width / 2, canvas.height - 56);

  const link = document.createElement("a");
  link.download = "our-memories.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
