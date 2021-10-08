import { Button } from "@material-ui/core";
import * as React from "react";
import { useInjected } from "..";
import { SearchState } from "../enums/SearchState";

export const BackButtonToBasicSearch = () => {
  const { movieStore } = useInjected();

  async function onClickBack() {
    movieStore.searchState = SearchState.BASIC;
  }

  return (
    <>
      <Button variant="text" onClick={onClickBack}>Back to search</Button>
    </>
  );
}