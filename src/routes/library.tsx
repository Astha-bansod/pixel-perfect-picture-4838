import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PODCASTS } from "@/data/podcasts";
import { usePlayer, useSaved } from "@/lib/player";
import { Chip, EmptyState, EpisodeRow, PageShell, PodcastCard } from "@/components/echo";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "My Library — EchoNova" },
      { name: "description", content: "Your saved podcasts, listening history and uploads." },
      { property: "og:title", content: "My Library — EchoNova" },
      { property: "og:description", content: "Your saved podcasts, listening history and uploads." },
    ],
  }),
  component: Library,
});

const TABS = ["Saved", "History", "My uploads"] as const;

function Library() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Saved");
  const { saved } = useSaved();
  const { history } = usePlayer();
  const savedShows = PODCASTS.filter((p) => saved.includes(p.id));
  const cta = (to: "/explore" | "/studio", label: string) => (
    <Link to={to} className="rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground">{label}</Link>
  );

  return (
    <PageShell>
      <p className="text-xs uppercase tracking-[0.25em] text-primary-glow">Yours</p>
      <h1 className="font-display text-6xl md:text-7xl">My Library</h1>
      <div className="mt-6 flex gap-2">
        {TABS.map((t) => <Chip key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Chip>)}
      </div>
      <div className="mt-10">
        {tab === "Saved" && (savedShows.length ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">{savedShows.map((p, i) => <PodcastCard key={p.id} p={p} index={i} />)}</div>
        ) : <EmptyState title="Nothing saved yet" body="Tap Save on any show to keep it here." action={cta("/explore", "Explore shows")} />)}
        {tab === "History" && (history.length ? (
          <div className="space-y-1">{history.map((e) => <EpisodeRow key={e.id} e={e} showShow />)}</div>
        ) : <EmptyState title="No listening history" body="Episodes you play this session will appear here." action={cta("/explore", "Find something to play")} />)}
        {tab === "My uploads" && <EmptyState title="No uploads yet" body="Shows you publish from Creator Studio will live here once a backend is connected." action={cta("/studio", "Open Creator Studio")} />}
      </div>
    </PageShell>
  );
}
