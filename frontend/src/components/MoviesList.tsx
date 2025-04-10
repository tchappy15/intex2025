import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { useNavigate } from 'react-router-dom';
import { fetchMoviesFiltered } from '../api/api';
import InfiniteScroll from 'react-infinite-scroll-component';
import './MoviesList.css';

function MoviesList({
  selectedGenre,
  searchTitle,
  selectedType,
}: {
  selectedGenre: string;
  selectedType: string;
  searchTitle: string;
}) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadMovies = async () => {
    setLoading(true);
    try {
      const data = await fetchMoviesFiltered(
        pageSize,
        pageNum,
        selectedGenre,
        searchTitle,
        selectedType
      );

      setMovies((prev) =>
        pageNum === 1 ? data.movies : [...prev, ...data.movies]
      );
      setTotalItems(data.totalCount);
    } catch (err) {
      console.error('Error loading movies:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Reset on filter change
    setPageNum(1);
    setMovies([]);
  }, [selectedGenre, searchTitle, selectedType]);

  useEffect(() => {
    loadMovies();
  }, [pageNum]);

  const hasMore = movies.length < totalItems;

  return (
    <>
      <div className="movie-scroll">
        <InfiniteScroll
          dataLength={movies.length}
          next={() => setPageNum((prev) => prev + 1)}
          hasMore={hasMore}
          loader={
            <p style={{ textAlign: 'center', color: 'white', marginTop: '20px' }}>
              Loading more movies...
            </p>
          }
          endMessage={
            <p style={{ textAlign: 'center', color: 'gray', marginTop: '20px' }}>
              You've reached the end!
            </p>
          }
        >
          {movies.map((movie) => (
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
                className="movie-thumbnail"
                src={`/images/movieThumbnails/${movie.title}.jpg`}
                alt={movie.title}
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder.jpg';
                }}
              />
              <div className="movie-overlay">
                <h2 className="card-title">{movie.title}</h2>
                <p>
                  <strong>Year:</strong> {movie.release_year}
                </p>
                <p>
                  <strong>Duration:</strong> {movie.duration}
                </p>
                <p>
                  <strong>Rating:</strong> {movie.rating}
                </p>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
}

export default MoviesList;
