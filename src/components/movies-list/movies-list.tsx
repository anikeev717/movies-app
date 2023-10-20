import React from 'react';

import { MoviesAppConsumer } from '../movies-app-context/movies-app-context';
import { MovieItem } from '../movie-item/movie-item';

export const MoviesList: React.FC<Record<string, never>> = () => {
  return (
    <MoviesAppConsumer>
      {({ elements, totalElements, loading, error, network }) => {
        const willData: boolean = !(loading || error || !network || !totalElements);

        const moviesItems: JSX.Element[] = elements.map((movie): JSX.Element => {
          const { id } = movie;
          return (
            <li className="card" key={id}>
              <MovieItem {...movie} />
            </li>
          );
        });

        const moviesList: JSX.Element | null = willData ? <ul className="container">{moviesItems}</ul> : null;
        return moviesList;
      }}
    </MoviesAppConsumer>
  );
};
