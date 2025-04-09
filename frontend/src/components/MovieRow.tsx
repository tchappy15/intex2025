import './MovieRow.css';

interface Movie {
  movieId: string;
  title: string;
  posterUrl?: string; // Add more fields if needed
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

function MovieRow({ title, movies }: MovieRowProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-row">
      <h2 className="row-title">{title}</h2>
      <div className="movie-scroll">
        {movies.map((movie) => (
          <div className="movie-poster-card" key={movie.movieId}>
            <img
              src={movie.posterUrl || '/images/placeholder.jpg'}
              alt={movie.title}
            />
            <p className="movie-title">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieRow;
