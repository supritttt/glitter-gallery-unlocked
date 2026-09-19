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
    caption: "Blue by the sea",
    note: "The wind found your hair, the waves found the shore, and somehow the whole beach became your backdrop.",
    date: "By the water",
  },
  {
    image: "/photos/2.jpeg",
    caption: "Between the books",
    note: "You made a quiet corner of the bookshelves feel like the most beautiful room in the world.",
    date: "At the bookshelves",
  },
  {
    image: "/photos/3.jpeg",
    caption: "Silver in the mirror",
    note: "A mirror, a silver saree, and that look that makes even an ordinary moment feel worth keeping.",
    date: "A soft reflection",
  },
  {
    image: "/photos/4.jpeg",
    caption: "Through the tiled tunnel",
    note: "You turned back in the middle of the walkway, and the whole pattern behind you looked made for that moment.",
    date: "On the way somewhere",
  },
  {
    image: "/photos/5.jpeg",
    caption: "A hand full of sparkle",
    note: "Your rings, your little details, and those iridescent nails deserved their own close-up.",
    date: "A little detail",
  },
  {
    image: "/photos/6.jpeg",
    caption: "A shopping-day selfie",
    note: "Even under store lights and surrounded by signs, you still made the frame feel completely yours.",
    date: "Out for the day",
  },
  {
    image: "/photos/7.jpeg",
    caption: "That secret smile",
    note: "The light was low, but your smile still found a way to stay with me.",
    date: "A quiet night",
  },
  {
    image: "/photos/8.jpeg",
    caption: "Dancing in the garden light",
    note: "You brought your own rhythm to the night and made the garden feel like a little stage.",
    date: "Under the lights",
  },
  {
    image: "/photos/9.jpeg",
    caption: "Reaching for a story",
    note: "Among all those books, you were still the story I kept looking at.",
    date: "An afternoon of books",
  },
  {
    image: "/photos/10.jpeg",
    caption: "Dinner and warm light",
    note: "The room was full of people, but your quiet smile was the part of the evening I remember most.",
    date: "Around the dinner table",
  },
  {
    image: "/photos/11.jpeg",
    caption: "Sunlight through the trees",
    note: "Caught in a pocket of sunlight, you looked like you had stepped into your own secret little world.",
    date: "A bright afternoon",
  },
  {
    image: "/photos/12.jpeg",
    caption: "Black and gold in the mirror",
    note: "The gold border, the mirror, and that pose made this feel like a scene from a storybook.",
    date: "Getting ready",
  },
];

/** The hidden thirteenth card — only appears once all twelve are unlocked. */
export const bonusMemory: Memory = {
  image: "/photos/13.jpeg",
  caption: "Under the city lights",
  note: "The final secret: one more beautiful frame of you out in the world, exactly where you belong.",
  date: "The last little adventure",
};

export const recipientName = "Sonakshi";
export const creatorName = "Suprit";

export const encouragementMilestones: Record<number, string> = {
  4: "A third of the way… every smile tells a story ✨",
  8: "Two thirds uncovered… each moment even brighter than the last 💫",
  12: "All memories found… but wait, a secret memory awaits below 💌",
};

