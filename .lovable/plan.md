# Make the gallery unforgettable

A few additions that turn the scratch-off page from a nice gift into something she'll want to show people. Pick any mix — each one stands alone.

## 1. A personal note on every memory (biggest impact)
Right now each photo gets a one-line caption. Add a second, longer line underneath — a real sentence from you about that day. Tapping an unlocked photo opens it full-screen with the photo, the date, and your note.

## 2. Opening moment
Before the grid, a short full-screen intro: her name, a line like "12 memories. Scratch to remember.", and a "Begin" button that fades away into the gallery. Sets the tone instead of dropping straight into a grid.

## 3. Progress that feels alive
- The counter fills like a bar as she unlocks more.
- Every 4th unlock shows a small line of encouragement ("A third of the way…").
- A soft chime and a gentle glow pulse on each unlock.

## 4. A better finale
The ending currently slides a note up. Instead: the photos gather into a slow drifting collage behind a typed-out letter that writes itself line by line, confetti, and a "Replay" button.

## 5. Small touches that get noticed
- Golden dust particles that follow her finger while scratching.
- Long-press a photo to peek 10% underneath, then it re-frosts.
- The page title changes to "7 / 12 unlocked" in the browser tab.
- A hidden 13th card that only appears after all 12 are done.
- "Save as keepsake" button that downloads the finished collage as one image.

## 6. Make it feel like a gift
A share-ready cover: when the link is sent to her on WhatsApp/Instagram, it previews with a custom image and the line "Someone made this for you."

## Technical notes
- Full-screen memory view: a dialog component over the existing card, reading from the same `memories` array (adds `note` and `date` fields).
- Intro screen: state in the index route, gated so it only shows once per visit.
- Particles and glow: canvas overlay in the existing scratch component, reduced-motion respected.
- Typed letter: character-interval effect, skipped entirely under reduced motion.
- Keepsake export: draw the revealed photos to an offscreen canvas and trigger a PNG download.
- Tab title and link preview: route `head()` metadata.
