import { promises as fs } from "fs";
import path from "path";
import { Submission, CityRanking } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "submissions.json");

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

export async function getSubmissions(): Promise<Submission[]> {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

export async function addSubmission(submission: Submission): Promise<void> {
  const submissions = await getSubmissions();
  submissions.push(submission);
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
}

export async function voteForSubmission(id: string): Promise<boolean> {
  const submissions = await getSubmissions();
  const submission = submissions.find((s) => s.id === id);
  if (!submission) return false;
  submission.votes += 1;
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
  return true;
}

export async function getCityRankings(): Promise<CityRanking[]> {
  const submissions = await getSubmissions();
  const cityMap = new Map<string, { country: string; submissions: Submission[] }>();

  for (const sub of submissions) {
    const key = `${sub.city.toLowerCase()}|${sub.country}`;
    if (!cityMap.has(key)) {
      cityMap.set(key, { country: sub.country, submissions: [] });
    }
    cityMap.get(key)!.submissions.push(sub);
  }

  const rankings: CityRanking[] = [];
  for (const [key, data] of cityMap.entries()) {
    const city = key.split("|")[0];
    const totalVotes = data.submissions.reduce((sum, s) => sum + s.votes, 0);
    const totalSubmissions = data.submissions.length;
    const score = totalVotes + totalSubmissions * 2;

    const topSubmission = data.submissions.sort((a, b) => b.votes - a.votes)[0];

    rankings.push({
      city: city.charAt(0).toUpperCase() + city.slice(1),
      country: data.country,
      totalSubmissions,
      totalVotes,
      score,
      topImage: topSubmission?.imageUrl || null,
    });
  }

  return rankings.sort((a, b) => b.score - a.score);
}

export async function getSubmissionsByCity(city: string): Promise<Submission[]> {
  const submissions = await getSubmissions();
  return submissions
    .filter((s) => s.city.toLowerCase() === city.toLowerCase())
    .sort((a, b) => b.votes - a.votes);
}
