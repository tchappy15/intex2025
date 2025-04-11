import './MovieRow.css';
import { useNavigate } from 'react-router-dom';

interface Movie {
  movieId: string;
  title: string;
  posterUrl?: string;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

function MovieRow({ title, movies }: MovieRowProps) {
  const navigate = useNavigate();

  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-row">
      <h2 className="row-title">{title}</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div
            onClick={() =>
              navigate(
                `/movie/${encodeURIComponent(movie.title)}/${movie.movieId}`
              )
            }
            className="movie-poster-card"
            style={{ cursor: 'pointer' }}
            key={movie.movieId}
          >
            <img
              loading="lazy"
              src={movie.posterUrl || '/images/placeholder.jpg'}
              alt={movie.title}
              className="movie-thumbnail"
              onError={(e) => {
                e.currentTarget.src = 
                  'https://cinenicheposters0215.blob.core.windows.net/movie-posters/Bee Movie.jpg';
              }}
            />
            <p className="movie-title">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieRow;
