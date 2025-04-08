import { Movie } from '../types/Movie';

interface FetchMoviesResponse {
  movies: Movie[];
  totalCount: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Ping authorization status
export async function pingAuth() {
  const response = await fetch(`${API_BASE_URL}/pingauth`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Authorization failed');
  return await response.json();
}

// Get available genre types
export async function fetchGenres() {
  const response = await fetch(`${API_BASE_URL}/Movies/GetGenreTypes`, {
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Failed to fetch genres');
  return await response.json();
}

// Get movies with pagination and optional genre filter
export async function fetchMovies(
  pageSize: number,
  pageNum: number,
  selectedGenres: string[]
): Promise<FetchMoviesResponse> {
  const genreParams = selectedGenres
    .map((cont) => `genres=${encodeURIComponent(cont)}`)
    .join('&');

  const url = `${API_BASE_URL}/Movies/GetMovies?pageSize=${pageSize}&pageNum=${pageNum}${
    selectedGenres.length ? `&${genreParams}` : ''
  }`;

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Failed to fetch movies');

  const data = await response.json();
  return {
    movies: data.movies,
    totalCount: data.totalNumMovies,
  };
}

// Logout the user
export async function logoutUser() {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.ok;
}

// Login the user
export async function loginUser(
  email: string,
  password: string,
  remember: boolean
) {
  const loginUrl = remember
    ? `${API_BASE_URL}/login?useCookies=true`
    : `${API_BASE_URL}/login?useSessionCookies=true`;

  const response = await fetch(loginUrl, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const contentLength = response.headers.get('content-length');
  const data =
    contentLength && parseInt(contentLength) > 0 ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || 'Invalid email or password.');
  }

  return data;
}

// Register a new user
export async function registerUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    credentials: 'include', // This is key for cookies
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: email, password }),
  });

  return response.ok;
}


export async function deleteMovie(movieId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/Movies/DeleteMovie/${movieId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete movie');
  }
}

export async function addMovie(newMovie: Partial<Movie>): Promise<void> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Movies/AddMovie`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newMovie)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to add movie: ${message}`);
  }
}


export async function updateMovie(movieId: string, updatedMovie: Partial<Movie>): Promise<void> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Movies/UpdateMovie/${movieId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedMovie)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to update movie: ${message}`);
  }
}

