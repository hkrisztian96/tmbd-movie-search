export type Movie = {
  id: string;
  name: string;
  overview: string;
  score: number;
  similar: Omit<Movie, "similar">[];
}