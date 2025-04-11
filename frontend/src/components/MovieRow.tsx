import './MovieRow.css';
import { useNavigate } from 'react-router-dom';
// import { Movie } from '../types/Movie'; 


interface PartialMovie {
  movieId: string;
  title: string;
  posterUrl?: string;
  release_year?: number;
  duration?: string;
  rating?: string;
}


interface MovieRowProps {
  title: string;
  movies: PartialMovie[];
  showDetails?: boolean;
}

export function sanitizeTitle(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[<>:"/\\|?*'’!.,()&]/g, "") // remove punctuation
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
}



function MovieRow({ title, movies, showDetails = true }: MovieRowProps) {
  const navigate = useNavigate();

  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-row">
      <h2 className="row-title">{title}</h2>
      <div className="movie-grid">
        {movies.map((movie) => {
          const cleanTitle = sanitizeTitle(movie.title);
          return (
            <div
              onClick={() =>
                navigate(
                  `/movie/${encodeURIComponent(movie.title)}/${movie.movieId}`
                )
              }
              className="movie-card"
              key={movie.movieId}
            >
            <img
              loading="lazy"
              src={`https://cinenicheposters0215.blob.core.windows.net/movie-posters/${cleanTitle}.jpg`} // movie.posterUrl || '/images/placeholder.jpg'
              alt={movie.title}
              className="movie-thumbnail"
              onError={(e) => {
                e.currentTarget.src = 
                  'https://cinenicheposters0215.blob.core.windows.net/movie-posters/Bee Movie.jpg';
              }}
            />
            {showDetails && (
            <div className="movie-overlay">
              <h2 className="card-title">{movie.title}</h2>
              <p><strong>Year:</strong> {movie.release_year}</p>
              <p><strong>Duration:</strong> {movie.duration}</p>
              <p><strong>Rating:</strong> {movie.rating}</p>
            </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}

export default MovieRow;
