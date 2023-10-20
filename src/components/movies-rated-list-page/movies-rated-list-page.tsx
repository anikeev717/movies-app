import React from 'react';
import { Pagination } from 'antd';

import { MoviesAppConsumer } from '../movies-app-context/movies-app-context';
import { MoviesList } from '../movies-list/movies-list';
import { NonDataItem } from '../non-data-item/non-data-item';

export const MoviesRatedListPage: React.FC<Record<string, never>> = () => {
  return (
    <MoviesAppConsumer>
      {({ totalElements, currentPage, updateRatedMoviesList, guestSessionId }): JSX.Element => (
        <div className="search">
          <MoviesList />
          <NonDataItem />
          <Pagination
            defaultPageSize={20}
            showSizeChanger={false}
            defaultCurrent={1}
            total={totalElements}
            current={currentPage}
            onChange={(targetPage) => updateRatedMoviesList(guestSessionId, targetPage)}
            hideOnSinglePage
          />
        </div>
      )}
    </MoviesAppConsumer>
  );
};
