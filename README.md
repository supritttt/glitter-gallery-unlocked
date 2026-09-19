# Memory Reveal

Build a highly interactive "Scratch-Off Gallery" web page using React and Tailwind CSS.

1. The page should have a premium dark theme (deep slate/charcoal background) with elegant typography.

2. At the top, center a fixed sticky counter that reads: "0 / 12 Memories Unlocked". 

3. Display a responsive grid containing 12 photo card containers. 

4. Each card features an image hidden beneath an HTML5 Canvas overlay. The overlay looks like a sleek, metallic silver scratch-off coating with a subtle glitter texture.

5. When the user clicks and drags (or touches and drags on mobile), it draws transparent paths on the canvas to "scratch away" the silver overlay, revealing the sharp photo underneath.

6. Once 60% of a canvas is cleared, consider that card "Unlocked." The canvas should smoothly fade out completely, and the top counter should increment by 1.

7. Once the counter hits 12/12, trigger a confetti explosion effect and smoothly slide up a hidden, beautiful final message card at the bottom of the screen with a heartfelt note.

8. Make sure the scratch action works flawlessly on mobile touch events without breaking page scrolling. Use placeholder image URLs that I can easily replace.



## Build with Love



- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
