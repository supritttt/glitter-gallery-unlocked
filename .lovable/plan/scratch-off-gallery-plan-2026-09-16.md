# Scratch-Off Gallery Plan

## Experience
- Replace the blank page with a premium charcoal gallery using the provided memory photos, repeated to fill twelve slots where needed.
- Keep a compact sticky progress counter centered at the top while the photo grid scrolls beneath it.
- Give every photo a metallic silver canvas coating with subtle glitter, a numbered label, and a tactile scratch cursor.

## Interaction
- Support mouse, pen, and touch scratching through pointer events and circular brush strokes.
- Prevent accidental scrolling only after a scratch gesture begins, while normal swipes outside the active canvas continue to scroll.
- Measure cleared pixels after each stroke; at 60%, mark that memory once, fade the coating away, and update the counter.
- At twelve unlocked memories, fire a confetti burst and slide a heartfelt final note into view.

## Responsive finish
- Use a single-column mobile gallery and a wider multi-column desktop grid with stable photo proportions.
- Respect reduced-motion preferences and make unlocked states, progress text, and touch targets accessible.
- Add page-specific title and sharing metadata, then verify compilation and the full interaction in desktop and mobile-sized previews.

## Technical details
- Implement the scratch surface as a focused reusable React canvas component using destination-out compositing.
- Define all palette, typography, texture, and motion values as semantic tokens in the global design system.
- Use a lightweight canvas confetti package only for the completion burst.
