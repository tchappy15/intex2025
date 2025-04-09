//import React from 'react';
import './MovieRow.css';
import { Link } from 'react-router-dom';

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
          <Link
            to={`/movies/${movie.title}/${movie.movieId}`}
            key={movie.movieId}
            className="movie-link"
          >
            <div className="movie-poster-card">
              <img
                src={movie.posterUrl || '/images/placeholder.jpg'}
                alt={movie.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    '/images/placeholder.jpg';
                }}
              />
              <p className="movie-title">{movie.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MovieRow;
