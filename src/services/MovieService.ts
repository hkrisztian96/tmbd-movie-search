import { AxiosInstance, AxiosResponse } from "axios-jsonp-pro";
import { LoadingType } from "../stores/LoadingStore";
import { MovieStore } from "../stores/MovieStore";
import { InputError } from "../enums/InputError";
import { Movie } from "../types/Movie";
import { SearchMoviesResponse } from "../types/SearchMoviesResponse";
import { LoadingService } from "./LoadingService";
import { WikipediaResponse } from "../types/WikipediaResponse";
import { ImdbMovieSuggestionData } from "../types/ImdbMovieSuggestionData";
import { ErrorHandlerService } from "./ErrorHandlerService";
import { IMDB_SUGGEST_URL, IMDB_TITLE_URL, MOVIE_SANDBOX_URL, WIKIPEDIA_REST_URL, WIKIPEDIA_WIKI_URL, WIKITEXT_TO_HTML_URL } from "../utils/Url";

export class MovieService {
  constructor(
    private readonly axios: AxiosInstance,
    private readonly movieStore: MovieStore,
    private readonly loadingService: LoadingService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  public loadMovies = async () => {
    const loadMovieAction = async () => {
      const { searchInputText } = this.movieStore;
      if (!searchInputText) {
        this.movieStore.searchInputError = InputError.INVALID;
        return;
      }
      const response: AxiosResponse<SearchMoviesResponse> | null =
        await this.errorHandlerService.callRequest(async () => await this.axios.post<SearchMoviesResponse>(MOVIE_SANDBOX_URL, {
        operationName: "SearchMovies",
        // tslint:disable-next-line: max-line-length
        query: 'query SearchMovies { searchMovies(query: "' + searchInputText + '") { id name overview score similar { id name overview score } } }',
        variables: {},
      }));
      if (response) {
        const movies: Movie[] = response.data.data.searchMovies; // Odd, but this is the structure that axios and the rest response gives you
        this.movieStore.movies = movies;
      } else {
        this.movieStore.movies = undefined;
      }
    };

    await this.loadingService.withLoading(LoadingType.SEARCH_MOVIES, loadMovieAction);
  }

  public loadWikiData = async (movieName: string) => {
    const loadWikiDataAction = async () => {
      const wikiResponse: AxiosResponse<WikipediaResponse> | null = await this.errorHandlerService.callRequest(async () =>
        await this.axios.get<WikipediaResponse>(WIKIPEDIA_REST_URL + movieName),
        (error, defaultErrorHandler) => {
          if (error.response.status !== 404) { // Do nothing on 404, no wikipedia page exists for the movie
            defaultErrorHandler();
          }
        }
      );
      if (wikiResponse) {
        const wikitext = wikiResponse.data.source;
        this.movieStore.wikipediaParagraph = await this.wikitextToHtml(wikitext);
        this.movieStore.wikipediaUrl = WIKIPEDIA_WIKI_URL + movieName;
      } else {
        this.movieStore.wikipediaParagraph = undefined;
        this.movieStore.wikipediaUrl = undefined;
      }
    };

    await this.loadingService.withLoading(LoadingType.SEARCH_MOVIES, loadWikiDataAction);
  }

  public loadImdbData = async (movieName: string) => {
    const movieNameWithoutSpace = movieName.replace(/\s/g, "").replace(/[^\w\s]/gi, '');
    this.addJsonpCallbackToWindow(movieName, movieNameWithoutSpace);
    await this.errorHandlerService.callRequest(async () =>
      await this.axios.jsonp(IMDB_SUGGEST_URL + movieName[0].toLowerCase() + "/" + movieNameWithoutSpace + ".json", {timeout: 500}),
      (error, defaultErrorHandler) => {
        if (error.toString() !== "Error: Request timed out") { // BAD WORKAROUND: Do nothing in case of jsonp callback timeout
          this.movieStore.imdbUrl = undefined;
          defaultErrorHandler();
        }
      }
    );
  }

  private addJsonpCallbackToWindow(movieName: string, movieNameWithoutSpace: string) {
    const windowAsAny = window as any;
    windowAsAny[`imdb$${movieNameWithoutSpace}`] = (data: ImdbMovieSuggestionData) => {
      const suggestedMovies = data.d;
      if (!suggestedMovies) {
        this.movieStore.imdbUrl = undefined;
        return;
      }
      const movie = suggestedMovies.find((suggestedMovie: any) => suggestedMovie.l.length === movieName.length); // Find the same movie by title
      if (movie) {
        this.movieStore.imdbUrl = IMDB_TITLE_URL + movie.id;
      } else {
        this.movieStore.imdbUrl = undefined;
      }
    };
  }

  private async wikitextToHtml(wikitext: string): Promise<string> {
    const response: AxiosResponse<string> | null = await this.errorHandlerService.callRequest(async () =>
      await this.axios.post<string>(WIKITEXT_TO_HTML_URL, {
        wikitext,
        body_only: true,
        stash: false,
      }),
    );
    return response ? response.data : await new Promise((resolve) => resolve("Cannot convert wikitext to html."));
  }
}