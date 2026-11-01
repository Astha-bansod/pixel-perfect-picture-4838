import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ImagePlus, Music } from "lucide-react";
import { CATEGORIES } from "@/data/podcasts";
import { DemoBadge, PageShell } from "@/components/echo";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Creator Studio — EchoNova" },
      { name: "description", content: "Prepare a new podcast with title, artwork and media files." },
      { property: "og:title", content: "Creator Studio — EchoNova" },
      { property: "og:description", content: "Prepare a new podcast with title, artwork and media files." },
    ],
  }),
  component: Studio,
});

function useObjectUrl(file: File | null) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) return setUrl(null);
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return url;
}

function Studio() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [media, setMedia] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const coverUrl = useObjectUrl(cover);
  const mediaUrl = useObjectUrl(media);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (title.trim().length < 3) er["title"] = "Title needs at least 3 characters";
    if (desc.trim().length < 20) er["desc"] = "Description needs at least 20 characters";
    if (!category) er["category"] = "Choose a category";
    if (!media) er["media"] = "Select an audio or video file";
    setErrors(er);
    setDone(Object.keys(er).length === 0);
  };

  const input = "mt-1 w-full rounded-xl border border-input bg-card px-4 py-3 outline-none focus:border-primary";
  const err = (k: string) => errors[k] && <span className="mt-1 block text-xs text-destructive">{errors[k]}</span>;

  return (
    <PageShell>
      <p className="text-xs uppercase tracking-[0.25em] text-primary-glow">For creators</p>
      <h1 className="font-display text-6xl md:text-7xl">Creator Studio</h1>
      <div className="mt-3"><DemoBadge>Demo · files stay on your device, nothing is uploaded</DemoBadge></div>

      <form onSubmit={submit} noValidate className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <label className="block"><span className="text-sm text-muted-foreground">Podcast title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} placeholder="e.g. Late Night Logic" />{err("title")}</label>
          <label className="block"><span className="text-sm text-muted-foreground">Description</span>
            <textarea rows={5} value={desc} onChange={(e) => setDesc(e.target.value)} className={input} placeholder="What's your show about?" />{err("desc")}</label>
          <label className="block"><span className="text-sm text-muted-foreground">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={input}>
              <option value="">Select…</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>{err("category")}</label>

          <label className="block cursor-pointer rounded-2xl border border-dashed border-border p-6 transition hover:border-primary">
            <input type="file" accept="audio/*,video/*" className="sr-only" onChange={(e) => setMedia(e.target.files?.[0] ?? null)} />
            <div className="flex items-center gap-4">
              <Music className="h-6 w-6 text-primary-glow" />
              <div>
                <p className="font-semibold">{media ? media.name : "Choose audio or video file"}</p>
                <p className="text-sm text-muted-foreground">{media ? `${(media.size / 1024 / 1024).toFixed(1)} MB · ${media.type || "unknown type"}` : "MP3, WAV, M4A, MP4"}</p>
              </div>
            </div>
            {mediaUrl && media?.type.startsWith("audio") && <audio controls src={mediaUrl} className="mt-4 w-full" />}
            {mediaUrl && media?.type.startsWith("video") && <video controls src={mediaUrl} className="mt-4 w-full rounded-xl" />}
          </label>
          {err("media")}

          <button className="rounded-full bg-gradient-primary px-8 py-3 font-semibold text-primary-foreground shadow-glow">Publish (demo)</button>
          {done && <p className="rounded-xl border border-primary/40 bg-accent/40 p-3 text-sm">Looks great! Publishing is a demo — your show will go live once a backend is connected.</p>}
        </div>

        <label className="block cursor-pointer">
          <span className="text-sm text-muted-foreground">Cover image</span>
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => setCover(e.target.files?.[0] ?? null)} />
          <div className="mt-1 flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-dashed border-border bg-card transition hover:border-primary">
            {coverUrl ? <img src={coverUrl} alt="Cover preview" className="h-full w-full object-cover" /> : (
              <div className="text-center text-muted-foreground"><ImagePlus className="mx-auto h-8 w-8" /><p className="mt-2 text-sm">Square, 1400px+</p></div>
            )}
          </div>
          {cover && <p className="mt-2 truncate text-sm">{cover.name}</p>}
          <p className="mt-4 font-display text-3xl">{title || "Your show title"}</p>
          <p className="text-sm text-muted-foreground">{category || "Category"}</p>
        </label>
      </form>
    </PageShell>
  );
}
