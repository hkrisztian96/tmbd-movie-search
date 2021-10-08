import { Movie } from "./Movie";

export type SearchMoviesResponse = {
  data: SearchMovies;
}

type SearchMovies = {
  searchMovies: Movie[];
}