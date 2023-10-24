import React from 'react';

import { MoviesAppConsumer } from '../movies-app-context/movies-app-context';
import { MoviesSearchForm } from '../movies-search-form/movies-search-form';
import { MoviesList } from '../movies-list/movies-list';

export const MoviesSearchPage: React.FC<Record<string, never>> = () => (
  <MoviesAppConsumer>
    {({ requestLine, updateMoviesList }): JSX.Element => {
      return (
        <div className="search">
          <MoviesSearchForm />
          <MoviesList text={requestLine} findMovies={updateMoviesList} />
        </div>
      );
    }}
  </MoviesAppConsumer>
);
