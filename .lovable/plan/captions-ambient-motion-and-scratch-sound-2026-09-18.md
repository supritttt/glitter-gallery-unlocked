# Captions, Ambient Motion, and Scratch Sound

## Experience
- Add a short caption beneath each photo card, revealed with the memory and supplied from one easy-to-edit list.
- Add restrained animated light and star-like texture behind the gallery without distracting from the photos.
- Play a soft, continuous scratch texture only while the user is actively scratching.

## Interaction and accessibility
- Generate the scratch sound in the browser so no external account or audio file is needed.
- Start audio only after a user gesture, vary it slightly with movement, and stop it immediately on release, cancellation, unlock, or unmount.
- Keep vertical mobile scrolling unchanged and respect reduced-motion preferences for the background.

## Technical details
- Extend each memory item with a caption and pass it to the reusable card.
- Use the Web Audio API with filtered noise for a lightweight tactile sound.
- Define the background movement and colors through the existing design tokens and CSS utilities.
- Verify the page compiles and test scratching, scrolling, captions, and animation in the preview.
