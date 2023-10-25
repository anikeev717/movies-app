import React from 'react';
import { debounce } from 'lodash';
import { Tabs, Alert } from 'antd';

import './app.css';

import { MoviesAppProvider } from '../movies-app-context/movies-app-context';
import { MoviesApi } from '../../services/movies-api/movies-api';
import { GetGenres, GetMovieItem, GetResourcesMethod } from '../../types/type';
import { MoviesList } from '../movies-list/movies-list';
import { MoviesSearchForm } from '../movies-search-form/movies-search-form';

type LocalRating = { [key: string]: number };

interface AppState {
  guestSessionId: string;
  genresList: GetGenres;
  error: boolean;
  loading: boolean;
  network: boolean;
  requestLine: string;
  elements: GetMovieItem[];
  totalElements: number;
  currentPage: number;
  localRating: LocalRating;
  activePage: string;
}

export interface Context extends AppState {
  rateMovie: (guestSessionId: string, id: number, value: number) => Promise<void>;
  updateSearch: (requestLine: string, targetPage?: number) => void;
  updateRated: (guestSessionId: string, targetPage?: number) => void;
  getResources: (url: string, method?: GetResourcesMethod) => Promise<ResponseType>;
}

export class App extends React.Component<Record<string, never>, AppState> {
  movApi = new MoviesApi();

  updateSearch = debounce((text: string, targetPage?: number): void => {
    this.findMovies(text, 'search', targetPage);
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
      activePage: '1',
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

    this.networkStatus();
  }

  componentDidUpdate(prevProps: Readonly<Record<string, never>>, prevState: Readonly<AppState>): void {
    const { network, activePage } = this.state;
    if (prevState.network === false && network === true) {
      this.updateActivePage(activePage);
    }
  }

  componentDidCatch(): void {
    this.onError();
  }

  onError = (): void => {
    this.setState({ error: true, loading: false });
  };

  networkStatus = (): void => {
    window.ononline = (): void => {
      this.networkSetState();
    };
    window.onoffline = (): void => {
      this.networkSetState();
    };
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
      const updateLocalRating: LocalRating = JSON.parse(JSON.stringify(localRating));
      updateLocalRating[id] = value;
      this.setState({ localRating: updateLocalRating });
    } catch {
      this.onError();
    }
  };

  findMovies = (text: string, type: 'search' | 'rated', page?: number): void => {
    this.setState({ loading: true, error: false });
    this.movApi
      .getMovies(text, type, page)
      .then(({ elements, totalElements, currentPage }) => {
        this.setState({
          elements,
          totalElements,
          currentPage,
          loading: false,
        });
        if (type === 'search') this.setState({ requestLine: text });
      })
      .catch(this.onError);
  };

  updateRated = (guestSessionId: string, targetPage?: number): void => {
    this.findMovies(guestSessionId, 'rated', targetPage);
  };

  updateActivePage = (activePage: string) => {
    const { requestLine, guestSessionId } = this.state;
    if (activePage === '1') {
      this.updateSearch(requestLine);
    } else {
      this.updateRated(guestSessionId);
    }
  };

  render() {
    const { error, requestLine, guestSessionId } = this.state;
    const context: Context = {
      rateMovie: this.rateMovie,
      updateSearch: this.updateSearch,
      updateRated: this.updateRated,
      getResources: this.movApi.getResources,
      ...this.state,
    };
    if (error)
      return (
        <div className="main-alert">
          <Alert message="Error" description="A server request error occurred!" type="error" showIcon />;
        </div>
      );
    return (
      <MoviesAppProvider value={context}>
        <div className="app">
          <Tabs
            defaultActiveKey="1"
            onChange={(activePage: string): void => {
              this.updateActivePage(activePage);
              this.setState({ activePage });
            }}
            centered
            items={[
              {
                label: 'Search',
                key: '1',
                children: (
                  <div className="page">
                    <MoviesSearchForm findMovies={this.updateSearch} />
                    <MoviesList text={requestLine} findMovies={this.updateSearch} />
                  </div>
                ),
              },
              {
                label: 'Rated',
                key: '2',
                children: (
                  <div className="page">
                    <MoviesList text={guestSessionId} findMovies={this.updateRated} />
                  </div>
                ),
              },
            ]}
          />
        </div>
      </MoviesAppProvider>
    );
  }
}
