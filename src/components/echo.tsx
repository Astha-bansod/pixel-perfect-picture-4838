import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Menu, Pause, Play, Search, Volume2, VolumeX, X } from "lucide-react";
import { formatDate, formatTime, type Episode, type Podcast } from "@/data/podcasts";
import { usePlayer, useSaved } from "@/lib/player";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/library", label: "Library" },
  { to: "/studio", label: "Studio" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-7 items-end gap-[3px]">
        {[0.5, 1, 0.7, 0.9].map((h, i) => (
          <span key={i} className="w-[3px] rounded-full bg-gradient-primary" style={{ height: `${h * 100}%` }} />
        ))}
      </span>
      <span className="font-display text-2xl tracking-tight">EchoNova</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            Log in
          </Link>
          <Link to="/signup" className="rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
            Start listening
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-5 py-3 md:hidden">
          {[...NAV, { to: "/login", label: "Log in" } as const, { to: "/signup", label: "Sign up" } as const].map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-muted-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SearchBar({ value, onChange, autoFocus }: { value: string; onChange: (v: string) => void; autoFocus?: boolean }) {
  return (
    <label className="flex items-center gap-3 rounded-full border border-input bg-card/70 px-5 py-3 backdrop-blur focus-within:border-primary">
      <Search className="h-4 w-4 text-muted-foreground" />
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search shows, creators, ideas…"
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      {value && (
        <button onClick={() => onChange("")} aria-label="Clear search">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </label>
  );
}

export function Chip({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm transition",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function PodcastCard({ p, index = 0 }: { p: Podcast; index?: number }) {
  return (
    <Link
      to="/podcast/$id"
      params={{ id: p.id }}
      className="group animate-rise block"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img src={p.cover} alt={p.title} loading="lazy" width={816} height={816} className="aspect-square w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-background/70 px-3 py-1 text-xs backdrop-blur">{p.category}</span>
      </div>
      <h3 className="mt-3 font-display text-2xl leading-tight">{p.title}</h3>
      <p className="text-sm text-muted-foreground">{p.creator}</p>
    </Link>
  );
}

export function PlayButton({ track, size = "md" }: { track: Episode & { podcast: Podcast }; size?: "md" | "lg" }) {
  const { track: cur, playing, play } = usePlayer();
  const active = cur?.id === track.id && playing;
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        play(track);
      }}
      aria-label={active ? "Pause" : "Play"}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition hover:scale-105",
        size === "lg" ? "h-14 w-14" : "h-10 w-10",
      )}
    >
      {active ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
    </button>
  );
}

export function EpisodeRow({ e, showShow }: { e: Episode & { podcast: Podcast }; showShow?: boolean }) {
  const { track } = usePlayer();
  return (
    <div className={cn("flex items-center gap-4 rounded-2xl border border-transparent p-3 transition hover:border-border hover:bg-card/60", track?.id === e.id && "border-primary/40 bg-accent/40")}>
      <PlayButton track={e} />
      {showShow && <img src={e.podcast.cover} alt="" loading="lazy" className="h-12 w-12 rounded-lg object-cover" />}
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {showShow ? e.podcast.title : `Episode ${e.number}`} · {formatDate(e.published)}
        </p>
        <p className="truncate font-semibold">{e.title}</p>
        <p className="truncate text-sm text-muted-foreground">{e.summary}</p>
      </div>
      <span className="hidden text-sm tabular-nums text-muted-foreground sm:block">{formatTime(e.durationSec)}</span>
    </div>
  );
}

export function SaveButton({ id }: { id: string }) {
  const { saved, toggleSaved } = useSaved();
  const on = saved.includes(id);
  return (
    <button onClick={() => toggleSaved(id)} className="flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm hover:border-primary">
      <Heart className={cn("h-4 w-4", on && "fill-primary text-primary")} /> {on ? "Saved" : "Save"}
    </button>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-border px-6 py-14 text-center">
      <p className="font-display text-3xl">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function DemoBadge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex rounded-full border border-primary/40 bg-accent/50 px-3 py-1 text-xs text-primary-glow">{children}</span>;
}

export function PlayerBar() {
  const { track, playing, position, volume, toggle, seek, setVolume } = usePlayer();
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-popover/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4">
        {track ? (
          <>
            <img src={track.podcast.cover} alt="" className="h-12 w-12 rounded-lg object-cover" />
            <div className="hidden w-48 min-w-0 sm:block">
              <p className="truncate text-sm font-semibold">{track.title}</p>
              <p className="truncate text-xs text-muted-foreground">{track.podcast.title}</p>
            </div>
            <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
              {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
            </button>
            <div className="flex flex-1 items-center gap-3">
              <span className="w-12 text-right text-xs tabular-nums text-muted-foreground">{formatTime(position)}</span>
              <input type="range" min={0} max={track.durationSec} value={position} onChange={(e) => seek(Number(e.target.value))} className="w-full accent-primary" aria-label="Seek" />
              <span className="w-12 text-xs tabular-nums text-muted-foreground">{formatTime(track.durationSec)}</span>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <button onClick={() => setVolume(volume ? 0 : 0.8)} aria-label="Mute">
                {volume ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-24 accent-primary" aria-label="Volume" />
            </div>
            <span className="hidden lg:block"><DemoBadge>Demo playback</DemoBadge></span>
          </>
        ) : (
          <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-end gap-1 h-5">
              {[0, 1, 2, 3].map((i) => <span key={i} className="w-1 h-full rounded bg-muted-foreground/40" />)}
              <span className="ml-3">Nothing playing — pick an episode to start.</span>
            </span>
            <DemoBadge>Demo player · no audio files yet</DemoBadge>
          </div>
        )}
      </div>
    </div>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-7xl px-5 pb-32 pt-10">{children}</main>;
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-primary-glow">{eyebrow}</p>
        <h2 className="font-display text-4xl md:text-5xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
