import photo01 from "@/assets/SaveClip.App_658498508_18083375588581606_6467128962319141064_n.jpg.asset.json";
import photo02 from "@/assets/SaveClip.App_670966024_18089894888581606_4219233217059532802_n.jpg.asset.json";
import photo03 from "@/assets/SaveClip.App_700419298_18089894870581606_2697602208727002805_n.jpg.asset.json";
import photo04 from "@/assets/SaveClip.App_702093595_18089894879581606_3894618027456060074_n.jpg.asset.json";
import photo05 from "@/assets/SaveClip.App_723491185_18093754157581606_6668784199136083627_n.jpg.asset.json";
import photo06 from "@/assets/SaveClip.App_723988381_18093754202581606_2376780900211667041_n.jpg.asset.json";
import photo07 from "@/assets/SaveClip.App_724092453_18093754187581606_649781097160943115_n.jpg.asset.json";
import photo08 from "@/assets/SaveClip.App_793867456_18105278330581606_920480787757312739_n.jpg.asset.json";
import photo09 from "@/assets/SaveClip.App_795252474_18105278246581606_6601809545290298397_n.jpg.asset.json";
import photo10 from "@/assets/SaveClip.App_802298427_18105936572581606_22816562041446178_n.jpg.asset.json";

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
    image: photo01.url,
    caption: "A little mirror moment",
    note: "You were just checking the light, and I was quietly deciding this was my favourite version of you.",
    date: "A slow afternoon",
  },
  {
    image: photo02.url,
    caption: "Elegance in every reflection",
    note: "Some people dress up for the room. You walk in and the room adjusts to you.",
    date: "Getting ready",
  },
  {
    image: photo03.url,
    caption: "Silver saree, city lights",
    note: "The whole street was lit up and somehow you were still the brightest thing in the frame.",
    date: "That evening out",
  },
  {
    image: photo04.url,
    caption: "A moonlit walk to remember",
    note: "We didn't say much on that walk. We didn't need to — that's when I knew.",
    date: "Late night",
  },
  {
    image: photo05.url,
    caption: "Lost in the garden lights",
    note: "You stopped to look at the fairy lights like it was the first time anyone had hung them.",
    date: "The little garden",
  },
  {
    image: photo06.url,
    caption: "A perfect evening glow",
    note: "Golden hour tried its best and still couldn't outshine your smile here.",
    date: "Sunset",
  },
  {
    image: photo07.url,
    caption: "Nails, rings, and a little sparkle",
    note: "The details you fuss over are the details I notice most.",
    date: "Before we left",
  },
  {
    image: photo08.url,
    caption: "Dancing beneath the blue light",
    note: "You danced like nobody was filming, and thankfully somebody was.",
    date: "The party",
  },
  {
    image: photo09.url,
    caption: "A quiet moment after the celebration",
    note: "Loud nights are fun, but this quiet minute with you is the one I kept.",
    date: "After midnight",
  },
  {
    image: photo10.url,
    caption: "Wrapped in color and confidence",
    note: "Confidence looks good on everyone. On you it looks effortless.",
    date: "The festive day",
  },
  {
    image: photo01.url,
    caption: "That smile in the mirror",
    note: "I've seen this smile a hundred times and it still reorganises my whole day.",
    date: "Another ordinary day",
  },
  {
    image: photo06.url,
    caption: "One more night under the palms",
    note: "If I could loop one evening forever, it would be this one.",
    date: "One more night",
  },
];

/** The hidden thirteenth card — only appears once all twelve are unlocked. */
export const bonusMemory: Memory = {
  image: photo04.url,
  caption: "One more you didn't know about",
  note: "You found all twelve. Here's the one I was saving — because with you there's always one more memory waiting.",
  date: "Just for you",
};
