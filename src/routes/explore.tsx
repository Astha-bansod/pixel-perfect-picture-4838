import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { CATEGORIES, PODCASTS, filterPodcasts, type Category } from "@/data/podcasts";
import { Chip, EmptyState, PageShell, PodcastCard, SearchBar } from "@/components/echo";

const searchSchema = z.object({
  q: z.string().optional().catch(undefined),
  category: z.enum(["All", ...CATEGORIES]).optional().catch(undefined),
});

export const Route = createFileRoute("/explore")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Explore podcasts — EchoNova" },
      { name: "description", content: "Discover podcasts by category or search across shows and creators." },
      { property: "og:title", content: "Explore podcasts — EchoNova" },
      { property: "og:description", content: "Discover podcasts by category or search across shows and creators." },
    ],
  }),
  component: Explore,
});

function Explore() {
  const { q = "", category = "All" } = Route.useSearch();
  const navigate = useNavigate({ from: "/explore" });
  const [query, setQuery] = useState(q);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => navigate({ search: (s) => ({ ...s, q: query || undefined }), replace: true }), 200);
    return () => clearTimeout(t);
  }, [query, navigate]);

  const results = filterPodcasts(PODCASTS, query, category as Category | "All");

  return (
    <PageShell>
      <p className="text-xs uppercase tracking-[0.25em] text-primary-glow">Discover</p>
      <h1 className="font-display text-6xl md:text-7xl">Explore</h1>
      <div className="mt-8 max-w-xl">
        <SearchBar value={query} onChange={setQuery} autoFocus />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <Chip key={c} active={category === c} onClick={() => navigate({ search: (s) => ({ ...s, category: c === "All" ? undefined : c }) })}>
            {c}
          </Chip>
        ))}
      </div>

      <p className="mt-10 mb-5 text-sm text-muted-foreground">{loading ? "Loading shows…" : `${results.length} show${results.length === 1 ? "" : "s"}`}</p>

      {loading ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square animate-pulse rounded-2xl bg-muted" />
              <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : results.length ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p, i) => <PodcastCard key={p.id} p={p} index={i} />)}
        </div>
      ) : (
        <EmptyState
          title="No shows found"
          body="Try a different word or clear the category filter."
          action={<Chip onClick={() => { setQuery(""); navigate({ search: {} }); }}>Reset filters</Chip>}
        />
      )}
    </PageShell>
  );
}
