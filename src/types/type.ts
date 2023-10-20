export type GetResponse = {
  [key: string]: unknown;
};

export type FetchedMovies = {
  page: number;
  results: FetchedMovieItem[];
  total_results: number;
  [key: string]: unknown;
};

export type GetMovies = {
  elements: GetMovieItem[];
  currentPage: number;
  totalElements: number;
};

export type FetchedMovieItem = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  rating: number;
  genre_ids: number[];
  [key: string]: unknown;
};

export type GetMovieItem = {
  id: number;
  title: string;
  overview: string;
  date: string;
  src: string;
  rateValue: string;
  rateColor: string;
  rating: number;
  genres: number[];
};

export type FetchedGenres = {
  genres: { id: number; name: string }[];
};

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
