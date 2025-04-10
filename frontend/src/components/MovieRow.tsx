//import React from 'react';
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
      <div className="movie-scroll">
        {movies.map((movie) => (
          <div
            className="movie-poster-card"
            key={movie.movieId}
            onClick={() =>
              navigate(
                `/movie/${encodeURIComponent(movie.title)}/${movie.movieId}`
              )
            }
            style={{ cursor: 'pointer' }}
          >
            <img
              src={movie.posterUrl || '/images/placeholder.jpg'}
              alt={movie.title}
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder.jpg';
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
