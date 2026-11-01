import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, PODCASTS, allEpisodes } from "@/data/podcasts";
import { EpisodeRow, PlayButton, PodcastCard, SearchBar, SectionTitle } from "@/components/echo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EchoNova — Podcasts worth staying up for" },
      { name: "description", content: "Stream curated tech, science, culture and story podcasts on EchoNova." },
      { property: "og:title", content: "EchoNova — Podcasts worth staying up for" },
      { property: "og:description", content: "Stream curated tech, science, culture and story podcasts on EchoNova." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = PODCASTS[3]!;
  const latest = allEpisodes().slice(0, 5);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <section className="grain relative overflow-hidden bg-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-[1.2fr_1fr] md:py-24">
          <div className="animate-rise">
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-primary-glow">Issue Nº 11 · Late-night listening</p>
            <h1 className="font-display text-6xl leading-[0.95] md:text-8xl">
              Voices worth <em className="text-gradient">staying up</em> for.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Hand-picked shows on ideas, craft and curiosity — streamed beautifully, without the noise.
            </p>
            <form
              className="mt-8 max-w-md"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/explore", search: { q } });
              }}
            >
              <SearchBar value={q} onChange={setQ} />
            </form>
          </div>

          <Link to="/podcast/$id" params={{ id: featured.id }} className="group relative block animate-rise" style={{ animationDelay: "150ms" }}>
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-primary opacity-30 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card">
              <img src={featured.cover} alt={featured.title} width={816} height={816} className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="flex items-center gap-4 p-5">
                <PlayButton track={{ ...featured.episodes[0], podcast: featured }} size="lg" />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-primary-glow">Featured · {featured.category}</p>
                  <p className="font-display text-3xl">{featured.title}</p>
                  <p className="truncate text-sm text-muted-foreground">{featured.tagline}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-20 px-5 pb-32 pt-16">
        <section>
          <SectionTitle
            eyebrow="Trending this week"
            title="On everyone's headphones"
            action={<Link to="/explore" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">See all <ArrowRight className="h-4 w-4" /></Link>}
          />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {PODCASTS.map((p, i) => <PodcastCard key={p.id} p={p} index={i} />)}
          </div>
        </section>

        <section className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <SectionTitle eyebrow="Fresh drops" title="Latest episodes" />
            <div className="space-y-1">
              {latest.map((e) => <EpisodeRow key={e.id} e={e} showShow />)}
            </div>
          </div>
          <div>
            <SectionTitle eyebrow="Browse" title="Categories" />
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((c, i) => (
                <Link
                  key={c}
                  to="/explore"
                  search={{ category: c }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition hover:border-primary"
                >
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  <p className="mt-6 font-display text-2xl">{c}</p>
                  <span className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-gradient-primary opacity-0 blur-2xl transition group-hover:opacity-60" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
