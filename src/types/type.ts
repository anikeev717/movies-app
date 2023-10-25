export type GetResponse = {
  [key: string]: unknown;
};

interface MovieBase {
  id: number;
  title: string;
  overview: string;
  rating: number;
}

export type RateColor = '#E90000' | '#E97E00' | '#E9D100' | '#66E900';

export type GetResourcesMethod = 'json' | 'blob';

export type GetMoviesMethod = 'search' | 'rated';

export interface AddRateRequestOptions {
  method: string;
  headers: {
    accept: string;
    'Content-Type': string;
  };
  body: string;
}

export interface FetchedMovieItem extends MovieBase {
  release_date: string;
  poster_path: string;
  vote_average: number;
  genre_ids: number[];
  [key: string]: unknown;
}

export type FetchedMovies = {
  page: number;
  results: FetchedMovieItem[];
  total_results: number;
  [key: string]: unknown;
};

export interface GetMovieItem extends MovieBase {
  date: string;
  src: string;
  rateValue: string;
  rateColor: string;
  genres: number[];
}

export type GetMovies = {
  elements: GetMovieItem[];
  currentPage: number;
  totalElements: number;
};

export type FetchedGenresItem = { id: number; name: string };

export type FetchedGenresArray = FetchedGenresItem[];

export type FetchedGenres = {
  genres: FetchedGenresArray;
};

export type GetGenresItem = [number, string];

export type GetGenres = {
  [key: string]: string;
};

export type FetchedGuestSession = {
  success: boolean;
  guest_session_id: string;
  expires_at: string;
};

export type GetGuestSession = {
  success: boolean;
  guestSessionId: string;
  expiresAt: string;
};
