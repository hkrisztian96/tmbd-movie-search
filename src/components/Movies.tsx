import { observer } from "mobx-react-lite";
import * as React from "react";
import { useInjected } from "..";
import { SearchState } from "../enums/SearchState";
import { LoadingType } from "../stores/LoadingStore";
import { BackButtonToBasicSearch } from "./BackButtonToBasicSearch";
import { MovieDetailPanel } from "./MovieDetailPanel";
import { MovieSearchForm } from "./MovieSearchForm";
import { MovieTable } from "./MovieTable";
import { PageLoader } from "./PageLoader";
import { Error } from "./Error";
import { Typography } from "@material-ui/core";

export const Movies = observer(() => {
  const { loadingStore, movieStore } = useInjected();
  const { searchState } = movieStore;
  const isLoading: boolean = loadingStore.isLoading(LoadingType.SEARCH_MOVIES);
  return (
    <div>
      {isLoading && <PageLoader/>}
      <Error/>
      <Typography variant="h3" align="center">TMBD Movie Search</Typography>
      {searchState === SearchState.BASIC && <MovieSearchForm/>}
      {searchState === SearchState.RELATED && <BackButtonToBasicSearch/>}
      <MovieTable/>
      <MovieDetailPanel/>
    </div>
  );
});