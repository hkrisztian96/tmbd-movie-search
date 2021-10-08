import { Button, Input } from "@material-ui/core";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { ChangeEvent } from "react";
import { useInjected } from "..";
import { LoadingType } from "../stores/LoadingStore";
import { InputError } from "../enums/InputError";

export const MovieSearchForm = observer(() => {
  const { loadingStore, movieService, movieStore } = useInjected();
  const { searchInputError, searchInputText } = movieStore;
  const isLoading: boolean = loadingStore.isLoading(LoadingType.SEARCH_MOVIES);

  const onClickSearch = async () => {
    await movieService.loadMovies();
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const inputValue: string = e.target.value;
    if (inputValue) {
      if (movieStore.searchInputError === InputError.INVALID) {
        movieStore.searchInputError = undefined;
      }
    }
    movieStore.searchInputText = e.target.value;
  }

  return (
    <>
      <Input
        type="text"
        defaultValue={searchInputText}
        placeholder="Movie title..."
        onChange={onInputChange}
        error={!!searchInputError}
        disabled={isLoading}
      />
      <Button variant="text" onClick={onClickSearch}>Search</Button>
      {searchInputError === InputError.INVALID && <span>Invalid input!</span>}
    </>
  );
});