import { NextResponse } from "next/server";
import { getCityRankings } from "@/lib/db";

export async function GET() {
  try {
    const rankings = await getCityRankings();
    return NextResponse.json(rankings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
