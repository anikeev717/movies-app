import React from 'react';
import { Pagination } from 'antd';

import { MoviesAppConsumer } from '../movies-app-context/movies-app-context';
import { MoviesSearchForm } from '../movies-search-form/movies-search-form';
import { MoviesList } from '../movies-list/movies-list';
import { NonDataItem } from '../non-data-item/non-data-item';

export const MoviesSearchPage: React.FC<Record<string, never>> = () => (
  <MoviesAppConsumer>
    {({ totalElements, currentPage, requestLine, updateMoviesList }): JSX.Element => {
      return (
        <div className="search">
          <MoviesSearchForm />
          <MoviesList />
          <NonDataItem />
          <Pagination
            defaultPageSize={20}
            showSizeChanger={false}
            defaultCurrent={1}
            total={totalElements}
            current={currentPage}
            onChange={(targetPage) => updateMoviesList(requestLine, targetPage)}
            hideOnSinglePage
          />
        </div>
      );
    }}
  </MoviesAppConsumer>
);
