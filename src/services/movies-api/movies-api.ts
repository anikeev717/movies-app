import { format } from 'date-fns';

import defaultImg from '../../assets/img/movie-item-default-image.jpg';
import type * as types from '../../types/type';

export class MoviesApi {
  static apiBase: string = 'https://api.themoviedb.org/3/';

  // eslint-disable-next-line class-methods-use-this
  async getResources<ResponseType>(url: string): Promise<ResponseType> {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch data from ${url} Received status ${res.status}`);
    }

    const body = await res.json();
    return body;
  }

  getMovies = async (query: string, targetPage: number = 1): Promise<types.GetMovies> => {
    const res = await this.getResources<types.FetchedMovies>(
      `${MoviesApi.apiBase}search/movie?query=${query}&page=${targetPage}&api_key=212baee80b6d1a4ea49153a261625eeb`
    );
    const movies = {
      elements: this.transformMoviesList(res.results),
      currentPage: res.page,
      totalElements: res.total_results,
    };
    return movies;
  };

  getRatedMovies = async (guestSessionId: string, targetPage: number = 1): Promise<types.GetMovies> => {
    const res = await this.getResources<types.FetchedMovies>(
      `${MoviesApi.apiBase}guest_session/${guestSessionId}/rated/movies?page=${targetPage}&api_key=212baee80b6d1a4ea49153a261625eeb`
    );
    const ratedMovies = {
      elements: this.transformMoviesList(res.results),
      currentPage: res.page,
      totalElements: res.total_results,
    };
    return ratedMovies;
  };

  async getGenresList(): Promise<types.GetGenres> {
    const res = await this.getResources<types.FetchedGenres>(
      `${MoviesApi.apiBase}genre/movie/list?api_key=212baee80b6d1a4ea49153a261625eeb`
    );
    const genresArr = res.genres;
    const genresMap = genresArr.map((e) => [e.id, e.name]);
    const genresList = Object.fromEntries(genresMap);
    return genresList;
  }

  async createGuestSession(): Promise<types.GetGuestSession> {
    const res = await this.getResources<types.FetchedGuestSession>(
      `${MoviesApi.apiBase}authentication/guest_session/new?api_key=212baee80b6d1a4ea49153a261625eeb`
    );
    return { success: res.success, guestSessionId: res.guest_session_id, expiresAt: res.expires_at };
  }

  static addRate = async (guestSessionId: string, movieId: number, rate: number): Promise<types.GetResponse> => {
    const options: {
      method: string;
      headers: {
        accept: string;
        'Content-Type': string;
      };
      body: string;
    } = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: rate }),
    };
    const res = await fetch(
      `${MoviesApi.apiBase}movie/${movieId}/rating?guest_session_id=${guestSessionId}&api_key=212baee80b6d1a4ea49153a261625eeb`,
      options
    );
    if (!res.ok) {
      throw new Error(`Could not fetch data. Received status ${res.status}, ${options.body}`);
    }
    const body = await res.json();
    return body;
  };

  imgBase: string = 'https://image.tmdb.org/t/p/w500';
  // imgBase = 'https://image.tmdb.org/t/p/original';

  transformMoviesList(moviesArr: types.FetchedMovieItem[]): types.GetMovieItem[] {
    const transformMoviesArr = moviesArr.map((movieItem) => this.transformMovieData(movieItem));
    return transformMoviesArr;
  }

  static transformRate(rate: number): string {
    const transformedRate = rate.toString();
    return transformedRate.includes('.') ? transformedRate.slice(0, 3) : `${transformedRate}.0`;
  }

  static chooseRateColor(rate: number): string {
    let color;
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

  transformMovieData = ({ id, title, overview, ...item }: types.FetchedMovieItem) => {
    const movie = {
      id,
      title,
      overview,
      date: item.release_date ? format(new Date(item.release_date), 'MMMM d, yyyy') : 'Date not specified',
      src: item.poster_path ? `${this.imgBase}${item.poster_path}` : defaultImg,
      rateValue: MoviesApi.transformRate(item.vote_average),
      rateColor: MoviesApi.chooseRateColor(item.vote_average),
      rating: item.rating || 0,
      genres: item.genre_ids.slice(0, 2),
    };
    return movie;
  };
}
