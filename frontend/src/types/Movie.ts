export interface Movie {
    movieId: string;
    type: string;
    title: string;
    director: string;
    cast: string;
    country: string;
    release_year: number;
    rating: string;
    duration: string;
    description: string;
    genres: string[]; // simplified genre handling
  }
  