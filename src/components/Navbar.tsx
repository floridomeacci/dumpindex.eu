"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-lime-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl">🗑️</span>
            <div>
              <span className="text-xl font-black text-lime-400 group-hover:text-lime-300 transition-colors tracking-tight">
                CITYTRASH
              </span>
              <span className="text-xs text-zinc-500">.eu</span>
            </div>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === "/"
                  ? "bg-lime-500/20 text-lime-400"
                  : "text-zinc-400 hover:text-lime-400 hover:bg-zinc-800"
              }`}
            >
              🏆 Ranking
            </Link>
            <Link
              href="/gallery"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname.startsWith("/gallery")
                  ? "bg-lime-500/20 text-lime-400"
                  : "text-zinc-400 hover:text-lime-400 hover:bg-zinc-800"
              }`}
            >
              📸 Gallery
            </Link>
            <Link
              href="/submit"
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all bg-lime-500 text-zinc-900 hover:bg-lime-400 hover:scale-105 active:scale-95`}
            >
              + Submit Trash
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
