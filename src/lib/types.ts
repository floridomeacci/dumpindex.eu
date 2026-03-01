export interface Submission {
  id: string;
  city: string;
  country: string;
  imageUrl: string;
  caption: string;
  submittedAt: string;
  votes: number;
}

export interface CityRanking {
  city: string;
  country: string;
  totalSubmissions: number;
  totalVotes: number;
  score: number;
  topImage: string | null;
}

export const EUROPEAN_COUNTRIES = [
  "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan",
  "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria",
  "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia",
  "Finland", "France", "Georgia", "Germany", "Greece",
  "Hungary", "Iceland", "Ireland", "Italy", "Kazakhstan",
  "Kosovo", "Latvia", "Lithuania", "Luxembourg",
  "Malta", "Moldova", "Monaco", "Montenegro",
  "Netherlands", "North Macedonia", "Norway",
  "Poland", "Portugal", "Romania", "Russia",
  "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain",
  "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom",
  "Vatican City"
] as const;
