import React from 'react';

import { MoviesAppConsumer } from '../movies-app-context/movies-app-context';
import { MovieItem } from '../movie-item/movie-item';

export const MoviesList: React.FC<Record<string, never>> = () => {
  return (
    <MoviesAppConsumer>
      {({ elements, totalElements, loading, error, network }) => {
        const willData = !(loading || error || !network || !totalElements);

        const moviesItems = elements.map((movie) => {
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
