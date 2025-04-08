import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { useNavigate } from 'react-router-dom';
import { fetchMoviesFiltered } from '../api/api';
import Pagination from './Pagination';

function MoviesList({
  selectedGenre,
  searchTitle,
}: {
  selectedGenre: string;
  searchTitle: string;
}) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMoviesFiltered(pageSize, pageNum, selectedGenre, searchTitle);
        setMovies(data.movies); // lowercase 'movies' comes from your fetch function return
        setTotalItems(data.totalCount); // rename to totalCount to match your fetch function
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      } catch (err) {
        console.error('Error loading movies:', err);
      }
    };

    loadMovies();
  }, [pageSize, pageNum, selectedGenre, searchTitle]);

  return (
    <>
      {movies.map((movie) => (
        <div id="movieCard" className="card" key={movie.movieId}>
          <h2 className="card-title">{movie.title}</h2>
          <div className="card-body">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Type:</strong> {movie.type}
              </li>
              <li className="list-group-item">
                <strong>Release Year:</strong> {movie.release_year}
              </li>
              <li className="list-group-item">
                <strong>Director:</strong> {movie.director || 'N/A'}
              </li>
              <li className="list-group-item">
                <strong>Cast:</strong> {movie.cast || 'N/A'}
              </li>
              <li className="list-group-item">
                <strong>Country:</strong> {movie.country || 'N/A'}
              </li>
              <li className="list-group-item">
                <strong>Duration:</strong> {movie.duration}
              </li>
              <li className="list-group-item">
                <strong>Rating:</strong> {movie.rating}
              </li>
              <li className="list-group-item">
                <strong>Description:</strong> {movie.description}
              </li>
            </ul>

            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/movie/${movie.title}/${movie.movieId}`)}
            >
              View More
            </button>
          </div>
        </div>
      ))}

      <Pagination
        pageNum={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </>
  );
}

export default MoviesList;
