"use client";

import { useState, useEffect, useCallback } from "react";
import TrashChart from "@/components/TrashChart";
import VoteForm from "@/components/VoteForm";

const FALLBACK_CITIES = [
  { city: "Naples", score: 94 },
  { city: "Amsterdam", score: 91 },
  { city: "Marseille", score: 87 },
  { city: "Athens", score: 82 },
  { city: "Rome", score: 79 },
  { city: "Bucharest", score: 76 },
  { city: "Paris", score: 73 },
  { city: "Palermo", score: 69 },
  { city: "Brussels", score: 65 },
  { city: "Sofia", score: 62 },
  { city: "Barcelona", score: 58 },
  { city: "Belgrade", score: 55 },
  { city: "Istanbul", score: 53 },
  { city: "Catania", score: 50 },
  { city: "Lisbon", score: 48 },
  { city: "Manchester", score: 45 },
  { city: "Thessaloniki", score: 43 },
  { city: "Charleroi", score: 40 },
  { city: "Berlin", score: 38 },
  { city: "Madrid", score: 35 },
  { city: "Lviv", score: 33 },
  { city: "Tirana", score: 30 },
  { city: "Skopje", score: 28 },
  { city: "Dublin", score: 25 },
  { city: "Warsaw", score: 22 },
  { city: "Bratislava", score: 19 },
];

function parseData(data: unknown): { city: string; score: number }[] {
  let raw: { city: string; score: number }[] = [];

  const d = data as Record<string, unknown>;
  if (Array.isArray(data) && data.length > 0 && (data[0] as Record<string, unknown>).city && (data[0] as Record<string, unknown>).score != null) {
    raw = data as { city: string; score: number }[];
  } else if (d?.city && Array.isArray(d.city)) {
    const dirtLevels: number[] = d.dirtLevel && Array.isArray(d.dirtLevel) ? (d.dirtLevel as number[]) : [];
    const counts: Record<string, number> = {};
    for (let i = 0; i < (d.city as string[]).length; i++) {
      const name = (d.city as string[])[i];
      const weight = Number(dirtLevels[i]) || 1;
      counts[name] = (counts[name] || 0) + weight;
    }
    raw = Object.entries(counts)
      .map(([city, score]) => ({ city, score }))
      .sort((a, b) => b.score - a.score);
  }

  if (raw.length > 0) {
    const max = Math.max(...raw.map((c) => c.score));
    return raw.map((c) => ({
      city: c.city,
      score: max > 0 ? Math.round((c.score / max) * 100) : 0,
    }));
  }
  return [];
}

export default function Home() {
  const [cities, setCities] = useState(FALLBACK_CITIES);

  const refreshData = useCallback(() => {
    fetch("https://n8nfjm.org/webhook/getdumps")
      .then((res) => res.json())
      .then((data) => {
        const parsed = parseData(data);
        if (parsed.length > 0) setCities(parsed);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <div className="min-h-screen sm:h-screen flex flex-col items-center justify-center sm:justify-start px-4 pt-12 pb-6 sm:py-6 select-none">
      <h1 className="text-4xl sm:text-6xl font-black text-center tracking-tight mb-1 text-white">
        <span style={{ color: "#ef4444" }}>DUMP</span><span style={{ color: "#003399" }}>INDEX.EU</span>
      </h1>
      <p className="text-zinc-500 text-sm mb-4">
        The top 25 dirtiest cities in Europe, ranked.
      </p>

      <div className="w-full max-w-6xl h-[500px] sm:h-auto sm:flex-1 sm:min-h-0 select-none" style={{ outline: 'none' }}>
        <TrashChart data={cities} />
      </div>

      <div className="w-full pt-4 pb-2">
        <VoteForm onVoted={refreshData} />
      </div>
    </div>
  );
}