import { computed, makeObservable, observable } from "mobx";
import { InputError } from "../enums/InputError";
import { SearchState } from "../enums/SearchState";
import { Movie } from "../types/Movie";

export class MovieStore {
  public searchInputText: string | undefined = undefined;

  public searchInputError: InputError | undefined = undefined;

  public movies: Movie[] | undefined = undefined;

  public openMovieId: string | undefined = undefined;

  public wikipediaParagraph: string | undefined = undefined;

  public wikipediaUrl: string | undefined = undefined;

  public imdbUrl: string | undefined = undefined;

  public searchState: SearchState = SearchState.BASIC;

  public panelOpen: boolean = false;

  constructor() {
    makeObservable(this, {
      searchInputText: observable,
      searchInputError: observable,
      movies: observable,
      openMovieId: observable,
      wikipediaParagraph: observable,
      wikipediaUrl: observable,
      imdbUrl: observable,
      searchState: observable,
      panelOpen: observable,
    });
  }

  public relatedMovies = computed((): Omit<Movie, "similar">[] | undefined => {
    return this.movies!.find(movie => movie.id === this.openMovieId)?.similar;
  });
}