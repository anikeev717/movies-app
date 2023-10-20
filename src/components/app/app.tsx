import React from 'react';
import { debounce } from 'lodash';
import { Tabs, Alert } from 'antd';

import './app.css';

import { MoviesAppProvider } from '../movies-app-context/movies-app-context';
import { MoviesSearchPage } from '../movies-search-page/movies-search-page';
import { MoviesRatedListPage } from '../movies-rated-list-page/movies-rated-list-page';
import { MoviesApi } from '../../services/movies-api/movies-api';
import { NetworkStatus } from '../network-status/network-status';
import { GetGenres, GetMovieItem } from '../../types/type';

type AppState = {
  guestSessionId: string;
  genresList: GetGenres;
  error: boolean;
  loading: boolean;
  network: boolean;
  requestLine: string;
  elements: GetMovieItem[];
  totalElements: number;
  currentPage: number;
  localRating: { [key: string]: number };
};

export interface Context extends AppState {
  rateMovie: (guestSessionId: string, id: number, value: number) => Promise<void>;
  updateMoviesList: (guestSessionId: string, targetPage?: number) => void;
  updateRatedMoviesList: (guestSessionId: string, targetPage?: number) => void;
}

export class App extends React.Component<Record<string, never>, AppState> {
  movApi = new MoviesApi();

  updateMoviesList = debounce((text: string, targetPage?: number): void => {
    this.setState({ loading: true, error: false });
    this.movApi
      .getMovies(text, targetPage)
      .then(({ elements, totalElements, currentPage }) => {
        this.setState({
          elements,
          totalElements,
          currentPage,
          loading: false,
          requestLine: text,
        });
      })
      .catch(this.onError);
  }, 500);

  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      guestSessionId: '',
      genresList: {},
      error: false,
      loading: false,
      network: true,
      requestLine: '',
      elements: [],
      totalElements: 0,
      currentPage: 1,
      localRating: {},
    };
  }

  componentDidMount(): void {
    this.movApi
      .createGuestSession()
      .then(({ guestSessionId }) => this.setState({ guestSessionId }))
      .catch(this.onError);

    this.movApi
      .getGenresList()
      .then((genresList) => this.setState({ genresList }))
      .catch(this.onError);
  }

  onError = (): void => {
    this.setState({ error: true, loading: false });
  };

  networkSetState = (): void => {
    this.setState((prev) => ({
      network: !prev.network,
    }));
  };

  rateMovie = async (guestSessionId: string, id: number, value: number): Promise<void> => {
    try {
      await MoviesApi.addRate(guestSessionId, id, value);
      const { localRating } = this.state;
      const updateLocalRating = JSON.parse(JSON.stringify(localRating));
      updateLocalRating[id] = value;
      this.setState({ localRating: updateLocalRating });
    } catch {
      this.onError();
    }
  };

  readonly updateRatedMoviesList = (guestSessionId: string, targetPage?: number): void => {
    this.setState({ loading: true, error: false });
    this.movApi
      .getRatedMovies(guestSessionId, targetPage)
      .then(({ elements, totalElements, currentPage }) => {
        this.setState({
          elements,
          totalElements,
          currentPage,
          loading: false,
        });
      })
      .catch(this.onError);
  };

  render() {
    const { guestSessionId, error, requestLine } = this.state;
    const context: Context = {
      rateMovie: this.rateMovie,
      updateMoviesList: this.updateMoviesList,
      updateRatedMoviesList: this.updateRatedMoviesList,
      ...this.state,
    };
    if (error)
      return <Alert message="Ошибка" description="Произошла ошибка запроса к серверу!" type="error" showIcon />;
    return (
      <MoviesAppProvider value={context}>
        <div className="app">
          <Tabs
            defaultActiveKey="1"
            onChange={(key) => {
              if (key === '2') {
                this.updateRatedMoviesList(guestSessionId);
              } else this.updateMoviesList(requestLine);
            }}
            centered
            items={[
              {
                label: 'Search',
                key: '1',
                children: <MoviesSearchPage />,
              },
              {
                label: 'Rated',
                key: '2',
                children: <MoviesRatedListPage />,
              },
            ]}
          />
          <NetworkStatus networkSetState={this.networkSetState} />
        </div>
      </MoviesAppProvider>
    );
  }
}
