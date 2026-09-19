export type Memory = {
  image: string;
  /** Short line under the card. */
  caption: string;
  /** Longer personal note shown in the full-screen view — edit freely. */
  note: string;
  /** Anything you like: a month, a place, an inside joke. */
  date: string;
};

export const memories: Memory[] = [
  {
    image: "/photos/1.jpeg",
    caption: "A little mirror moment",
    note: "You were just checking the light, and I was quietly deciding this was my favourite version of you.",
    date: "A slow afternoon",
  },
  {
    image: "/photos/2.jpeg",
    caption: "Elegance in every reflection",
    note: "Some people dress up for the room. You walk in and the room adjusts to you.",
    date: "Getting ready",
  },
  {
    image: "/photos/3.jpeg",
    caption: "Silver saree, city lights",
    note: "The whole street was lit up and somehow you were still the brightest thing in the frame.",
    date: "That evening out",
  },
  {
    image: "/photos/4.jpeg",
    caption: "A moonlit walk to remember",
    note: "We didn't say much on that walk. We didn't need to — that's when I knew.",
    date: "Late night",
  },
  {
    image: "/photos/5.jpeg",
    caption: "Lost in the garden lights",
    note: "You stopped to look at the fairy lights like it was the first time anyone had hung them.",
    date: "The little garden",
  },
  {
    image: "/photos/6.jpeg",
    caption: "A perfect evening glow",
    note: "Golden hour tried its best and still couldn't outshine your smile here.",
    date: "Sunset",
  },
  {
    image: "/photos/7.jpeg",
    caption: "Nails, rings, and a little sparkle",
    note: "The details you fuss over are the details I notice most.",
    date: "Before we left",
  },
  {
    image: "/photos/8.jpeg",
    caption: "Dancing beneath the blue light",
    note: "You danced like nobody was filming, and thankfully somebody was.",
    date: "The party",
  },
  {
    image: "/photos/9.jpeg",
    caption: "A quiet moment after the celebration",
    note: "Loud nights are fun, but this quiet minute with you is the one I kept.",
    date: "After midnight",
  },
  {
    image: "/photos/10.jpeg",
    caption: "Wrapped in color and confidence",
    note: "Confidence looks good on everyone. On you it looks effortless.",
    date: "The festive day",
  },
  {
    image: "/photos/11.jpeg",
    caption: "That smile in the mirror",
    note: "I've seen this smile a hundred times and it still reorganises my whole day.",
    date: "Another ordinary day",
  },
  {
    image: "/photos/12.jpeg",
    caption: "One more night under the palms",
    note: "If I could loop one evening forever, it would be this one.",
    date: "One more night",
  },
];

/** The hidden thirteenth card — only appears once all twelve are unlocked. */
export const bonusMemory: Memory = {
  image: "/photos/13.jpeg",
  caption: "One more you didn't know about",
  note: "You found all twelve. Here's the one I was saving — because with you there's always one more memory waiting.",
  date: "The quiet magic",
};

export const recipientName = "Sonakshi";

export const encouragementMilestones: Record<number, string> = {
  4: "A third of the way… every smile tells a story ✨",
  8: "Two thirds uncovered… each moment even brighter than the last 💫",
  12: "All memories found… but wait, a secret memory awaits below 💌",
};

