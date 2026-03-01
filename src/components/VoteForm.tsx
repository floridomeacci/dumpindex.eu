"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const EUROPEAN_CITIES = [
  "Aarhus", "Aberdeen", "Ajaccio", "Alicante", "Almería", "Amsterdam", "Andorra la Vella", "Ankara",
  "Antwerp", "Arnhem", "Athens", "Augsburg",
  "Baku", "Barcelona", "Bari", "Basel", "Bath", "Belfast", "Belgrade", "Bergen", "Berlin",
  "Bern", "Bilbao", "Birmingham", "Bologna", "Bonn", "Bordeaux", "Braga", "Bratislava",
  "Bremen", "Brno", "Bruges", "Brussels", "Bucharest", "Budapest", "Burgas", "Bursa",
  "Cagliari", "Cardiff", "Catania", "Charleroi", "Chișinău", "Clermont-Ferrand", "Cluj-Napoca",
  "Cologne", "Copenhagen", "Cork", "Craiova", "Córdoba",
  "Debrecen", "Dortmund", "Dresden", "Dublin", "Düsseldorf",
  "Edinburgh", "Eindhoven", "Essen", "Espoo",
  "Faro", "Florence", "Frankfurt", "Funchal",
  "Galway", "Gdańsk", "Geneva", "Genoa", "Ghent", "Gibraltar", "Glasgow", "Gothenburg",
  "Granada", "Graz", "Groningen",
  "Hague", "Hamburg", "Hannover", "Helsinki", "Heraklion",
  "Innsbruck", "Istanbul", "Izmir",
  "Karlsruhe", "Katowice", "Kaunas", "Kharkiv", "Košice", "Kraków", "Kyiv",
  "La Valletta", "Las Palmas", "Lausanne", "Leeds", "Leicester", "Leipzig", "Liège",
  "Lille", "Limassol", "Limerick", "Linz", "Lisbon", "Liverpool", "Ljubljana",
  "Łódź", "London", "Lublin", "Luxembourg City", "Lviv", "Lyon",
  "Madrid", "Málaga", "Malmö", "Manchester", "Mannheim", "Mariupol", "Marseille",
  "Metz", "Milan", "Minsk", "Monaco", "Montpellier", "Moscow", "Munich", "Murcia",
  "Nantes", "Naples", "Newcastle", "Nice", "Nicosia", "Niš", "Nürnberg",
  "Odesa", "Oporto", "Oslo", "Ostrava", "Oxford",
  "Palermo", "Palma de Mallorca", "Paris", "Patras", "Pécs", "Pisa", "Plovdiv", "Plzeň",
  "Podgorica", "Porto", "Poznań", "Prague", "Pristina",
  "Rennes", "Reykjavik", "Riga", "Rome", "Rotterdam", "Rouen",
  "Saint Petersburg", "Salzburg", "San Marino", "Santander", "Sarajevo", "Seville",
  "Sheffield", "Skopje", "Sofia", "Split", "Stockholm", "Strasbourg", "Stuttgart",
  "Tallinn", "Tampere", "Tbilisi", "Tenerife", "The Hague", "Thessaloniki", "Timișoara",
  "Tirana", "Torino", "Toulouse", "Trieste", "Tromsø", "Turku",
  "Utrecht",
  "Valencia", "Valladolid", "Varna", "Vatican City", "Venice", "Verona", "Vienna",
  "Vilnius", "Vitoria-Gasteiz",
  "Warsaw", "Waterford", "Wrocław",
  "Yerevan",
  "Zagreb", "Zaragoza", "Zurich",
];

const COOLDOWN_KEY = "dumpindex_vote_ts";
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

function getCooldownRemaining(): number {
  const ts = localStorage.getItem(COOLDOWN_KEY);
  if (!ts) return 0;
  const diff = Number(ts) + COOLDOWN_MS - Date.now();
  return diff > 0 ? diff : 0;
}

export default function VoteForm() {
  const [email, setEmail] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [cooldown, setCooldown] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  const filtered = cityQuery.length > 0
    ? EUROPEAN_CITIES.filter((c) =>
        c.toLowerCase().includes(cityQuery.toLowerCase())
      ).slice(0, 10)
    : [];

  // Check cooldown & previously voted on mount
  useEffect(() => {
    const prevCity = localStorage.getItem("dumpindex_voted_city");
    if (prevCity) {
      setSelectedCity(prevCity);
      setSubmitted(true);
      return;
    }
    if (getCooldownRemaining() > 0) {
      setCooldown(true);
    }
  }, []);

  // Render Turnstile widget
  const renderTurnstile = useCallback(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return;
    if (turnstileRef.current.hasChildNodes()) return;
    const w = window as unknown as Record<string, unknown>;
    if (typeof w.turnstile === "object" && w.turnstile !== null) {
      const turnstile = w.turnstile as { render: (el: HTMLElement, opts: Record<string, unknown>) => void };
      turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "dark",
        size: "compact",
        callback: (token: string) => setTurnstileToken(token),
      });
    }
  }, []);

  useEffect(() => {
    if (submitted || cooldown) return;
    // If script already loaded
    renderTurnstile();
    // Listen for script load
    window.addEventListener("turnstile-loaded", renderTurnstile);
    return () => window.removeEventListener("turnstile-loaded", renderTurnstile);
  }, [submitted, cooldown, renderTurnstile]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectCity(city: string) {
    setSelectedCity(city);
    setCityQuery(city);
    setShowSuggestions(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Cooldown check
    if (getCooldownRemaining() > 0) {
      setError("You already voted recently. Try again in 24 hours.");
      return;
    }

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!selectedCity) {
      setError("Please select a city from the list.");
      return;
    }

    // POST through our API proxy (handles honeypot, Turnstile, IP)
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          city: selectedCity,
          turnstileToken,
          _website: honeypot, // honeypot field
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Vote failed. Try again.");
        return;
      }
    } catch {
      setError("Network error. Try again.");
      return;
    }

    // Save cooldown + voted city
    localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
    localStorage.setItem("dumpindex_voted_city", selectedCity);
    setSubmitted(true);
  }

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full sm:max-w-2xl mx-auto px-4">
      {!submitted && !cooldown && error && (
        <p className="text-xs text-red-400/70 text-center mb-3">{error}</p>
      )}
      <div className="sm:h-[42px] flex items-center">
        {submitted ? (
          <span className="text-sm font-medium text-zinc-500 tracking-wide uppercase w-full text-center">
            Voted for {selectedCity}
          </span>
        ) : cooldown ? (
          <span className="text-sm font-medium text-zinc-500 tracking-wide uppercase w-full text-center">
            You already voted. Come back in 24h.
          </span>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end w-full">
            {/* On mobile: tappable title that toggles form. On desktop: static label */}
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-sm font-medium text-zinc-500 tracking-wide uppercase whitespace-nowrap self-center sm:pointer-events-none sm:cursor-default cursor-pointer"
            >
              Cast your vote {!expanded && <span className="sm:hidden">▼</span>}
              {expanded && <span className="sm:hidden">▲</span>}
            </button>

            {/* Honeypot — hidden from humans, bots auto-fill it */}
            <input
              type="text"
              name="_website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
            />

            <div className={`flex-1 w-full ${expanded ? "block" : "hidden"} sm:block`}>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-300 text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>

            <div ref={wrapperRef} className={`relative flex-1 w-full ${expanded ? "block" : "hidden"} sm:block`}>
              <input
                id="city"
                type="text"
                placeholder="Type a city..."
                value={cityQuery}
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  setSelectedCity(null);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-300 text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
              />
              {showSuggestions && filtered.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-xl max-h-48 overflow-y-auto">
                  {filtered.map((city) => (
                    <li key={city}>
                      <button
                        type="button"
                        onClick={() => handleSelectCity(city)}
                        className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
                      >
                        {city}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {showSuggestions && cityQuery.length > 0 && filtered.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-600 text-sm">
                  No matching city found.
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`w-full sm:w-auto px-6 py-2.5 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-700 hover:text-white active:scale-[0.98] transition-all cursor-pointer border border-zinc-700 ${expanded ? "block" : "hidden"} sm:block`}
            >
              Vote
            </button>

            {/* Cloudflare Turnstile (renders only if site key is set) */}
            {TURNSTILE_SITE_KEY && <div ref={turnstileRef} />}
          </form>
        )}
      </div>
    </div>
  );
}
