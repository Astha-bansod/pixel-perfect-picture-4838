import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Episode, Podcast } from "@/data/podcasts";

type Track = Episode & { podcast: Podcast };

type PlayerState = {
  track: Track | null;
  playing: boolean;
  position: number;
  volume: number;
  play: (t: Track) => void;
  toggle: () => void;
  seek: (s: number) => void;
  setVolume: (v: number) => void;
  history: Track[];
};

const Ctx = createContext<PlayerState | null>(null);

/**
 * Demo player: no audio files ship with this version, so playback is simulated
 * with a timer that advances the seek bar. Swap in an <audio> element later.
 */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const [track, setTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [history, setHistory] = useState<Track[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing || !track) return;
    timer.current = setInterval(() => {
      setPosition((p) => {
        if (p + 1 >= track.durationSec) {
          setPlaying(false);
          return track.durationSec;
        }
        return p + 1;
      });
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, track]);

  const play = (t: Track) => {
    if (track?.id === t.id) return setPlaying((p) => !p);
    setTrack(t);
    setPosition(0);
    setPlaying(true);
    setHistory((h) => [t, ...h.filter((x) => x.id !== t.id)].slice(0, 12));
  };

  return (
    <Ctx.Provider
      value={{
        track,
        playing,
        position,
        volume,
        history,
        play,
        toggle: () => track && setPlaying((p) => !p),
        seek: (s) => setPosition(Math.max(0, Math.min(s, track?.durationSec ?? 0))),
        setVolume,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function usePlayer() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePlayer must be used inside PlayerProvider");
  return c;
}

/** Saved podcasts, kept in memory for the demo session. */
const SavedCtx = createContext<{ saved: string[]; toggleSaved: (id: string) => void } | null>(null);
export function SavedProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>(["mind-circuit", "night-desert"]);
  return (
    <SavedCtx.Provider
      value={{
        saved,
        toggleSaved: (id) =>
          setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
      }}
    >
      {children}
    </SavedCtx.Provider>
  );
}
export function useSaved() {
  const c = useContext(SavedCtx);
  if (!c) throw new Error("useSaved must be used inside SavedProvider");
  return c;
}
