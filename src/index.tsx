import Axios, { AxiosInstance } from "axios-jsonp-pro";
import * as React from "react";
import { Context, createContext, useContext } from "react";
import * as ReactDOM from "react-dom";
import "regenerator-runtime/runtime";
import { Movies } from "./components/Movies";
import { ErrorHandlerService } from "./services/ErrorHandlerService";
import { LoadingService } from "./services/LoadingService";
import { MovieService } from "./services/MovieService";
import { ErrorStore } from "./stores/ErrorStore";
import { LoadingStore } from "./stores/LoadingStore";
import { MovieStore } from "./stores/MovieStore";
import { Injected } from "./types/Injected";

export function createInjected(): Injected {
  const axios: AxiosInstance = Axios.create({
    baseURL: "http://localhost:8090/",
  });
  const errorStore: ErrorStore = new ErrorStore();
  const errorHandlerService: ErrorHandlerService = new ErrorHandlerService(errorStore);
  const loadingStore: LoadingStore = new LoadingStore();
  const loadingService: LoadingService = new LoadingService(loadingStore);
  const movieStore: MovieStore = new MovieStore();
  const movieService: MovieService = new MovieService(axios, movieStore, loadingService, errorHandlerService);

  return {
    axios,
    errorStore,
    errorHandlerService,
    loadingStore,
    loadingService,
    movieStore,
    movieService,
  };
}

export const injectedContext: Context<Injected> = createContext<Injected>(null!);

export function useInjected(): Injected {
  return useContext(injectedContext);
}

document.addEventListener("DOMContentLoaded", () => {
  const injected = createInjected();
  ReactDOM.render(
    <injectedContext.Provider value={injected}>
      <Movies/>
    </injectedContext.Provider>,
    document.getElementById("app"),
  );
});