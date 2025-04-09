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

// Get movies with pagination and optional multi-genre filter
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

// Get movies with pagination and single genre filter
export async function fetchMoviesFiltered(
  pageSize: number,
  pageNum: number,
  selectedGenre: string,
  searchTitle: string,
  selectedType: string
): Promise<FetchMoviesResponse> {
  const params = new URLSearchParams();
  params.append('pageSize', pageSize.toString());
  params.append('pageNum', pageNum.toString());

  if (selectedGenre) params.append('genre', selectedGenre);
  if (searchTitle) params.append('title', searchTitle);
  if (selectedType) params.append('type', selectedType);

  const url = `${API_BASE_URL}/Movies/GetMovies?${params.toString()}`;

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

// Register a new user with full form data
export async function registerUser(formData: any) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    credentials: 'include', // Keep this for cookie-based auth
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  return response; // Return full response to check .ok and get error text if needed
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
  // Convert 0/1 genre flags to true/false booleans
  const booleanGenres = Object.fromEntries(
    Object.entries(newMovie).map(([key, value]) => [
      key,
      value === 1 ? true : value === 0 ? false : value
    ])
  );

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Movies/AddMovie`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(booleanGenres) // FLAT object, not wrapped
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to add movie: ${message}`);
  }
}


export async function updateMovie(movieId: string, updatedMovie: Partial<Movie>): Promise<void> {
  // Convert 0/1 to booleans for genres
  const booleanGenres = Object.fromEntries(
    Object.entries(updatedMovie).map(([key, value]) => [
      key,
      value === 1 ? true : value === 0 ? false : value
    ])
  );

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Movies/UpdateMovie/${movieId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(booleanGenres) // flat, not wrapped
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to update movie: ${message}`);
  }
}

