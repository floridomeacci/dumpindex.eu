import Link from "next/link";
import { getSubmissionsByCity, getCityRankings } from "@/lib/db";
import VoteButton from "@/components/VoteButton";

export const dynamic = "force-dynamic";

interface CityPageProps {
  params: Promise<{ city: string }>;
}

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  const cityName = decodeURIComponent(city);
  const submissions = await getSubmissionsByCity(cityName);
  const rankings = await getCityRankings();
  const cityRanking = rankings.find(
    (r) => r.city.toLowerCase() === cityName.toLowerCase()
  );
  const rank = rankings.findIndex(
    (r) => r.city.toLowerCase() === cityName.toLowerCase()
  );

  const displayName = cityRanking?.city || cityName.charAt(0).toUpperCase() + cityName.slice(1);
  const country = cityRanking?.country || "";

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/gallery"
            className="text-zinc-500 hover:text-lime-400 text-sm transition-colors mb-4 inline-block"
          >
            ← Back to Gallery
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-zinc-100">
                📍 {displayName}
              </h1>
              {country && (
                <p className="text-zinc-500 text-lg mt-1">{country}</p>
              )}
            </div>

            {cityRanking && (
              <div className="flex items-center gap-6 bg-zinc-900 rounded-2xl border border-zinc-800 p-4 sm:p-5">
                <div className="text-center">
                  <div className="text-3xl font-black text-lime-400">
                    #{rank + 1}
                  </div>
                  <div className="text-xs text-zinc-600">rank</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-zinc-100">
                    {cityRanking.score}
                  </div>
                  <div className="text-xs text-zinc-600">trash pts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-zinc-100">
                    {cityRanking.totalSubmissions}
                  </div>
                  <div className="text-xs text-zinc-600">photos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-zinc-100">
                    {cityRanking.totalVotes}
                  </div>
                  <div className="text-xs text-zinc-600">votes</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submissions Grid */}
        {submissions.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <span className="text-6xl">🤷</span>
            <p className="text-zinc-400 mt-4 text-lg">
              No submissions found for {displayName}.
            </p>
            <Link
              href="/submit"
              className="inline-block mt-6 px-6 py-3 bg-lime-500 text-zinc-900 font-bold rounded-xl hover:bg-lime-400 transition-colors"
            >
              Be the first to submit!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((sub) => (
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
                    <span className="font-bold text-zinc-100">
                      📍 {sub.city}
                    </span>
                    <VoteButton submissionId={sub.id} initialVotes={sub.votes} />
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {sub.caption}
                  </p>
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

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-zinc-500 mb-4">
            Got more evidence? Help {displayName} climb the rankings!
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center px-6 py-3 bg-lime-500 text-zinc-900 font-bold rounded-xl hover:bg-lime-400 hover:scale-105 active:scale-95 transition-all"
          >
            📸 Add More Trash
          </Link>
        </div>
      </div>
    </div>
  );
}
