import { AxiosInstance } from "axios-jsonp-pro";
import { ErrorHandlerService } from "../services/ErrorHandlerService";
import { LoadingService } from "../services/LoadingService";
import { MovieService } from "../services/MovieService";
import { ErrorStore } from "../stores/ErrorStore";
import { LoadingStore } from "../stores/LoadingStore";
import { MovieStore } from "../stores/MovieStore";

export type Injected = {
  axios: AxiosInstance;
  errorStore: ErrorStore;
  errorHandlerService: ErrorHandlerService;
  loadingStore: LoadingStore;
  loadingService: LoadingService;
  movieStore: MovieStore;
  movieService: MovieService;
}