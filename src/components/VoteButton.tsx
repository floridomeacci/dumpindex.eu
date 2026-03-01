"use client";

import { useState } from "react";

interface VoteButtonProps {
  submissionId: string;
  initialVotes: number;
}

export default function VoteButton({ submissionId, initialVotes }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleVote() {
    if (hasVoted || isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });
      if (res.ok) {
        setVotes((v) => v + 1);
        setHasVoted(true);
      }
    } catch (error) {
      console.error("Vote failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={hasVoted || isLoading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
        hasVoted
          ? "bg-lime-500/20 text-lime-400 cursor-default"
          : "bg-zinc-800 text-zinc-300 hover:bg-lime-500/20 hover:text-lime-400 hover:scale-105 active:scale-95 cursor-pointer"
      }`}
    >
      <span>{hasVoted ? "🤮" : "🤢"}</span>
      <span>{votes}</span>
    </button>
  );
}
