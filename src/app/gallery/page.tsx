import Link from "next/link";
import { getSubmissions, getCityRankings } from "@/lib/db";
import VoteButton from "@/components/VoteButton";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const submissions = await getSubmissions();
  const rankings = await getCityRankings();
  const sortedSubmissions = [...submissions].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-zinc-100">
            🖼️ Trash Gallery
          </h1>
          <p className="mt-3 text-zinc-400 text-lg">
            A curated collection of Europe&apos;s finest urban decay
          </p>
        </div>

        {/* City filter chips */}
        {rankings.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {rankings.map((city) => (
              <Link
                key={`${city.city}-${city.country}`}
                href={`/gallery/${encodeURIComponent(city.city.toLowerCase())}`}
                className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-full text-sm text-zinc-300 hover:border-lime-500/50 hover:text-lime-400 hover:bg-lime-500/5 transition-all"
              >
                📍 {city.city}
                <span className="ml-1 text-zinc-600">({city.totalSubmissions})</span>
              </Link>
            ))}
          </div>
        )}

        {sortedSubmissions.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <span className="text-6xl">📷</span>
            <p className="text-zinc-400 mt-4 text-lg">
              No submissions yet. Be the first to document the filth!
            </p>
            <Link
              href="/submit"
              className="inline-block mt-6 px-6 py-3 bg-lime-500 text-zinc-900 font-bold rounded-xl hover:bg-lime-400 transition-colors"
            >
              Submit a photo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all group"
              >
                <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-br from-zinc-800 to-zinc-900 group-hover:scale-105 transition-transform">
                    🗑️
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Link
                      href={`/gallery/${encodeURIComponent(sub.city.toLowerCase())}`}
                      className="font-bold text-zinc-100 hover:text-lime-400 transition-colors"
                    >
                      📍 {sub.city}, {sub.country}
                    </Link>
                    <VoteButton submissionId={sub.id} initialVotes={sub.votes} />
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">{sub.caption}</p>
                  <p className="text-zinc-600 text-xs mt-3">
                    {new Date(sub.submittedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
