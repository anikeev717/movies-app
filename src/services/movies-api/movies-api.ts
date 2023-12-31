import { format } from 'date-fns';

import type * as types from '../../types/type';

export class MoviesApi {
  static apiBase: string = 'https://api.themoviedb.org/3/';

  static apiKey: string = process.env.REACT_APP_API_KEY!;

  // eslint-disable-next-line class-methods-use-this
  async getResources<ResponseType>(url: string, method: types.GetResourcesMethod = 'json'): Promise<ResponseType> {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch data from ${url} Received status ${res.status}`);
    }

    const body: ResponseType = method === 'json' ? await res.json() : await res.blob();
    return body;
  }

  getMovies = async (text: string, type: 'search' | 'rated', targetPage: number = 1): Promise<types.GetMovies> => {
    const url: string =
      type === 'search'
        ? `${MoviesApi.apiBase}search/movie?query=${text}&page=${targetPage}&api_key=${MoviesApi.apiKey}`
        : `${MoviesApi.apiBase}guest_session/${text}/rated/movies?page=${targetPage}&api_key=${MoviesApi.apiKey}`;

    const res: types.FetchedMovies = await this.getResources<types.FetchedMovies>(url);
    const movies: types.GetMovies = {
      elements: this.transformMoviesList(res.results),
      currentPage: res.page,
      totalElements: res.total_results,
    };
    return movies;
  };

  async getGenresList(): Promise<types.GetGenres> {
    const res: types.FetchedGenres = await this.getResources<types.FetchedGenres>(
      `${MoviesApi.apiBase}genre/movie/list?api_key=${MoviesApi.apiKey}`
    );
    const genresArr: types.FetchedGenresArray = res.genres;
    const genresMap = genresArr.map((e: types.FetchedGenresItem): types.GetGenresItem => [e.id, e.name]);
    genresMap.push([-1, 'Genres not specified']);
    const genresList: types.GetGenres = Object.fromEntries(genresMap);
    return genresList;
  }

  async createGuestSession(): Promise<types.GetGuestSession> {
    const res: types.FetchedGuestSession = await this.getResources<types.FetchedGuestSession>(
      `${MoviesApi.apiBase}authentication/guest_session/new?api_key=${MoviesApi.apiKey}`
    );
    return { success: res.success, guestSessionId: res.guest_session_id, expiresAt: res.expires_at };
  }

  static addRate = async (guestSessionId: string, movieId: number, rate: number): Promise<types.GetResponse> => {
    const options: types.AddRateRequestOptions = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: rate }),
    };
    const res = await fetch(
      `${MoviesApi.apiBase}movie/${movieId}/rating?guest_session_id=${guestSessionId}&api_key=${MoviesApi.apiKey}`,
      options
    );
    if (!res.ok) {
      throw new Error(`Could not fetch data. Received status ${res.status}, ${options.body}`);
    }
    const body: types.GetResponse = await res.json();
    return body;
  };

  imgBase: string = 'https://image.tmdb.org/t/p/w300';

  transformMoviesList(moviesArr: types.FetchedMovieItem[]): types.GetMovieItem[] {
    const transformMoviesArr: types.GetMovieItem[] = moviesArr.map(
      (movieItem: types.FetchedMovieItem): types.GetMovieItem => this.transformMovieData(movieItem)
    );
    return transformMoviesArr;
  }

  static transformRate(rate: number): string {
    const transformedRate: string = rate.toString();
    return transformedRate.includes('.') ? transformedRate.slice(0, 3) : `${transformedRate}.0`;
  }

  static chooseRateColor(rate: number): types.RateColor {
    let color: types.RateColor;
    switch (true) {
      case rate < 3:
        color = '#E90000';
        break;
      case rate < 5:
        color = '#E97E00';
        break;
      case rate < 7:
        color = '#E9D100';
        break;
      default:
        color = '#66E900';
    }
    return color;
  }

  transformMovieData = ({ id, title, overview, ...item }: types.FetchedMovieItem): types.GetMovieItem => {
    const movie: types.GetMovieItem = {
      id,
      title,
      overview: overview || `Description of ${title} not specified.`,
      date: item.release_date ? format(new Date(item.release_date), 'MMMM d, yyyy') : 'Date not specified',
      src: item.poster_path ? `${this.imgBase}${item.poster_path}` : '',
      rateValue: MoviesApi.transformRate(item.vote_average),
      rateColor: MoviesApi.chooseRateColor(item.vote_average),
      rating: item.rating || 0,
      genres: item.genre_ids.length ? item.genre_ids.slice(0, 2) : [-1],
    };
    return movie;
  };
}
