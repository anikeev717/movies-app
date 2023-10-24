import React from 'react';

import { MoviesAppConsumer } from '../movies-app-context/movies-app-context';
import { MoviesList } from '../movies-list/movies-list';

export const MoviesRatedListPage: React.FC<Record<string, never>> = () => {
  return (
    <MoviesAppConsumer>
      {({ updateRatedMoviesList, guestSessionId }): JSX.Element => (
        <div className="search">
          <MoviesList text={guestSessionId} findMovies={updateRatedMoviesList} />
        </div>
      )}
    </MoviesAppConsumer>
  );
};
