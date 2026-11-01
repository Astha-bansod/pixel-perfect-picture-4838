import c1 from "@/assets/cover-1.jpg";
import c2 from "@/assets/cover-2.jpg";
import c3 from "@/assets/cover-3.jpg";
import c4 from "@/assets/cover-4.jpg";
import c5 from "@/assets/cover-5.jpg";
import c6 from "@/assets/cover-6.jpg";

export type Episode = {
  id: string;
  podcastId: string;
  number: number;
  title: string;
  summary: string;
  durationSec: number;
  published: string;
};

export type Podcast = {
  id: string;
  title: string;
  creator: string;
  category: Category;
  cover: string;
  tagline: string;
  description: string;
  listeners: string;
  rating: number;
  episodes: Episode[];
};

export const CATEGORIES = [
  "Technology",
  "Science",
  "Culture",
  "Business",
  "Wellness",
  "Stories",
] as const;
export type Category = (typeof CATEGORIES)[number];

function eps(podcastId: string, titles: [string, string, number][]): Episode[] {
  return titles.map(([title, summary, min], i) => ({
    id: `${podcastId}-e${titles.length - i}`,
    podcastId,
    number: titles.length - i,
    title,
    summary,
    durationSec: min * 60 + 17 * i,
    published: new Date(Date.UTC(2026, 9, 28 - i * 6)).toISOString(),
  }));
}

export const PODCASTS: Podcast[] = [
  {
    id: "signal-and-noise",
    title: "Signal & Noise",
    creator: "Priya Raman",
    category: "Technology",
    cover: c1,
    tagline: "The people quietly rebuilding the internet.",
    description:
      "Long-form conversations with engineers, founders and researchers about the systems that shape how we live online — from open-source maintainers to chip designers.",
    listeners: "128K",
    rating: 4.9,
    episodes: eps("signal-and-noise", [
      ["The Last Mile of the Web", "Why latency still matters in a 5G world.", 48],
      ["Open Source Is Tired", "Maintainer burnout and what funding can fix.", 52],
      ["Inside a Chip Fab", "A rare tour of how silicon is actually made.", 41],
      ["Compilers, Explained Kindly", "A gentle walk through how code becomes machine.", 37],
    ]),
  },
  {
    id: "night-desert",
    title: "Night Desert",
    creator: "Omar Haddad",
    category: "Stories",
    cover: c2,
    tagline: "Fiction for the hour after midnight.",
    description:
      "Serialized audio fiction recorded in a single take. Each season follows a new traveller across an imagined desert, told slowly, meant for headphones and dim rooms.",
    listeners: "86K",
    rating: 4.8,
    episodes: eps("night-desert", [
      ["The Salt Road", "A caravan that never arrives.", 28],
      ["Lanterns", "Light, and what it reveals.", 31],
      ["Two Moons", "A rumour becomes a map.", 26],
    ]),
  },
  {
    id: "the-green-room",
    title: "The Green Room",
    creator: "Ananya & Dev",
    category: "Culture",
    cover: c3,
    tagline: "Musicians, before they walk on stage.",
    description:
      "Intimate backstage interviews with independent artists from Mumbai to Berlin about craft, failure and the songs that almost didn't happen.",
    listeners: "64K",
    rating: 4.7,
    episodes: eps("the-green-room", [
      ["Writing in a Second Language", "Lyrics that cross borders.", 44],
      ["The Bedroom Producer", "Making records on a laptop.", 39],
      ["Stage Fright Is Data", "Using nerves as an instrument.", 35],
    ]),
  },
  {
    id: "mind-circuit",
    title: "Mind Circuit",
    creator: "Dr. Kavya Iyer",
    category: "Science",
    cover: c4,
    tagline: "Neuroscience meets machine learning.",
    description:
      "A neuroscientist talks with AI researchers about memory, attention and whether machines can ever truly learn the way we do.",
    listeners: "152K",
    rating: 4.9,
    episodes: eps("mind-circuit", [
      ["What Is a Thought?", "Starting from the very beginning.", 56],
      ["Attention, Twice", "Brains, transformers, and the word they share.", 49],
      ["Sleep Is Training", "How the brain rehearses at night.", 45],
      ["The Forgetting Curve", "Why losing memories is a feature.", 42],
    ]),
  },
  {
    id: "after-hours-capital",
    title: "After Hours Capital",
    creator: "Rohan Mehta",
    category: "Business",
    cover: c5,
    tagline: "Startups, money and the late-night decisions.",
    description:
      "Founders and investors unpack the choices made after the office lights go off — fundraising, layoffs, pivots and the rare big win.",
    listeners: "97K",
    rating: 4.6,
    episodes: eps("after-hours-capital", [
      ["The Pivot That Saved Us", "Three founders, one hard turn.", 38],
      ["Bootstrapped to Profit", "Growing without outside money.", 41],
      ["Reading a Term Sheet", "Line by line, in plain words.", 47],
    ]),
  },
  {
    id: "slow-bloom",
    title: "Slow Bloom",
    creator: "Meera Joshi",
    category: "Wellness",
    cover: c6,
    tagline: "Gentle practices for a loud world.",
    description:
      "Short, unhurried episodes on rest, attention and small habits. Part guided reflection, part conversation with people who've learned to slow down.",
    listeners: "73K",
    rating: 4.8,
    episodes: eps("slow-bloom", [
      ["Ten Minutes of Nothing", "A guided pause.", 12],
      ["Walking Without a Phone", "Notes from a month offline.", 22],
      ["The Art of Rest", "Rest is not the reward — it's the work.", 18],
    ]),
  },
];

export const getPodcast = (id: string) => PODCASTS.find((p) => p.id === id);

export const allEpisodes = () =>
  PODCASTS.flatMap((p) => p.episodes.map((e) => ({ ...e, podcast: p }))).sort(
    (a, b) => b.published.localeCompare(a.published),
  );

export function filterPodcasts(list: Podcast[], query: string, category: Category | "All") {
  const q = query.trim().toLowerCase();
  return list.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (!q ||
        p.title.toLowerCase().includes(q) ||
        p.creator.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)),
  );
}

export function formatTime(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${r}` : `${m}:${r}`;
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
