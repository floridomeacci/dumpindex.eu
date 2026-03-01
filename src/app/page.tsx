"use client";

import { useState, useEffect } from "react";
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

export default function Home() {
  const [cities, setCities] = useState(FALLBACK_CITIES);

  useEffect(() => {
    fetch("https://n8nfjm.org/webhook/getdumps")
      .then((res) => res.json())
      .then((data) => {
        let raw: { city: string; score: number }[] = [];

        // Format 1: array of { city, score } objects
        if (Array.isArray(data) && data.length > 0 && data[0].city && data[0].score != null) {
          raw = data;
        }
        // Format 2: { city: ["Amsterdam", "Naples", ...] } — count votes per city
        else if (data?.city && Array.isArray(data.city)) {
          const counts: Record<string, number> = {};
          for (const name of data.city) {
            counts[name] = (counts[name] || 0) + 1;
          }
          raw = Object.entries(counts)
            .map(([city, score]) => ({ city, score }))
            .sort((a, b) => b.score - a.score);
        }

        if (raw.length > 0) {
          const max = Math.max(...raw.map((c) => c.score));
          const normalized = raw.map((c) => ({
            city: c.city,
            score: max > 0 ? Math.round((c.score / max) * 100) : 0,
          }));
          setCities(normalized);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen sm:h-screen flex flex-col items-center justify-center sm:justify-start px-4 pt-12 pb-6 sm:py-6">
      <h1 className="text-4xl sm:text-6xl font-black text-center tracking-tight mb-1 text-white">
        <span style={{ color: "#ef4444" }}>DUMPINDEX</span>.EU
      </h1>
      <p className="text-zinc-500 text-sm mb-4">
        The dirtiest cities in Europe, ranked.
      </p>

      <div className="w-full max-w-6xl h-[500px] sm:h-auto sm:flex-1 sm:min-h-0">
        <TrashChart data={cities} />
      </div>

      <div className="w-full pt-4 pb-2">
        <VoteForm />
      </div>
    </div>
  );
}