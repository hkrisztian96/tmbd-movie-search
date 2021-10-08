import "../scss/movietable.scoped.scss"

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useInjected } from "..";
import { SearchState } from "../enums/SearchState";
import { Movie } from "../types/Movie";

export const MovieTable = observer(() => {
  const { movieService, movieStore } = useInjected();
  const { searchState } = movieStore;
  const [movies, setMovies] = useState<Omit<Movie, "similar">[] | undefined>(undefined);

  useEffect(() => {
    switch (searchState) {
      case SearchState.BASIC:
        setMovies(movieStore.movies);
        break;
      case SearchState.RELATED:
        setMovies(movieStore.relatedMovies.get());
        break;
    }
  }, [searchState, movieStore.movies]);

  async function onClickMovieTitle(movieId: string, movieName: string) {
    movieStore.openMovieId = movieId;
    await movieService.loadWikiData(movieName);
    movieStore.panelOpen = true;
    await movieService.loadImdbData(movieName);
  }

  return (
    <>
      {movies && movies.length !== 0
        ? <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Overview</TableCell>
                  <TableCell>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movies!.map((movie) => (
                  <TableRow key={movie.id}>
                    <TableCell
                      className="movie-title"
                      component="th"
                      scope="row"
                      onClick={() => onClickMovieTitle(movie.id, movie.name)}
                    >
                      {movie.name}
                    </TableCell>
                    <TableCell>{movie.overview}</TableCell>
                    <TableCell align="right">{movie.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          : <>{movies ? <h2>No Movies found :(</h2> : <div/>}</>
      }
    </>
  );
});