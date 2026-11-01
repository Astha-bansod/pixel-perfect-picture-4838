import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { getPodcast } from "@/data/podcasts";
import { EpisodeRow, PageShell, PlayButton, SaveButton } from "@/components/echo";

export const Route = createFileRoute("/podcast/$id")({
  loader: ({ params }) => {
    const podcast = getPodcast(params.id);
    if (!podcast) throw notFound();
    return { podcast };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.podcast;
    const title = p ? `${p.title} by ${p.creator} — EchoNova` : "Show not found — EchoNova";
    const description = p?.tagline ?? "This show could not be found.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <h1 className="font-display text-5xl">Show not found</h1>
      <Link to="/explore" className="mt-4 inline-block text-primary-glow">Back to Explore</Link>
    </PageShell>
  ),
  component: PodcastPage,
});

function PodcastPage() {
  const { podcast: p } = Route.useLoaderData();
  return (
    <>
      <section className="grain relative overflow-hidden">
        <img src={p.cover} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[320px_1fr] md:items-end">
          <img src={p.cover} alt={p.title} width={816} height={816} className="aspect-square w-full max-w-xs rounded-3xl object-cover shadow-glow" />
          <div className="animate-rise">
            <p className="text-xs uppercase tracking-[0.25em] text-primary-glow">{p.category}</p>
            <h1 className="font-display text-6xl leading-none md:text-8xl">{p.title}</h1>
            <p className="mt-3 text-lg">by {p.creator}</p>
            <p className="mt-4 max-w-2xl text-muted-foreground">{p.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <PlayButton track={{ ...p.episodes[0], podcast: p }} size="lg" />
              <SaveButton id={p.id} />
              <span className="flex items-center gap-1 text-sm text-muted-foreground"><Star className="h-4 w-4 fill-primary-glow text-primary-glow" /> {p.rating} · {p.listeners} listeners</span>
            </div>
          </div>
        </div>
      </section>
      <PageShell>
        <h2 className="mb-4 font-display text-4xl">{p.episodes.length} episodes</h2>
        <div className="space-y-1">
          {p.episodes.map((e) => <EpisodeRow key={e.id} e={{ ...e, podcast: p }} />)}
        </div>
      </PageShell>
    </>
  );
}
