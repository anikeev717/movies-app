import React from 'react';
import { Pagination } from 'antd';

import { NonDataItem } from '../non-data-item/non-data-item';
import { MoviesAppConsumer } from '../movies-app-context/movies-app-context';
import { MovieItem } from '../movie-item/movie-item';

interface MoviesListProps {
  text: string;
  findMovies: (text: string, targetPage?: number | undefined) => void;
}

export const MoviesList: React.FC<MoviesListProps> = ({ findMovies, text }) => {
  return (
    <MoviesAppConsumer>
      {({ elements, totalElements, currentPage, loading, error, network }) => {
        const moviesItems: JSX.Element[] = elements.map((movie): JSX.Element => {
          const { id } = movie;
          return (
            <li className="card" key={id}>
              <MovieItem {...movie} />
            </li>
          );
        });

        const moviesList = (
          <>
            <ul className="container">{moviesItems}</ul>
            <Pagination
              defaultPageSize={20}
              showSizeChanger={false}
              defaultCurrent={1}
              total={totalElements}
              current={currentPage}
              onChange={(targetPage) => findMovies(text, targetPage)}
              hideOnSinglePage
            />
          </>
        );

        const willData: boolean = !(loading || error || !network || !totalElements);
        const content: JSX.Element = willData ? moviesList : <NonDataItem />;

        return content;
      }}
    </MoviesAppConsumer>
  );
};
