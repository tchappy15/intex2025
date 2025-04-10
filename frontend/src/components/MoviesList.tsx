import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { useNavigate } from 'react-router-dom';
import { fetchMoviesFiltered } from '../api/api';
// import Pagination from './Pagination';
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
  const [, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);

      try {
        let data;

        if (showRecommendedOnly) {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/movies/with-recommendations`,
            {
              credentials: 'include',
            }
          );

          const json = await res.json();
          data = { movies: json, totalCount: json.length };
        } else {
          data = await fetchMoviesFiltered(
            pageSize,
            pageNum,
            selectedGenre,
            searchTitle,
            selectedType
          );
        }

        setMovies((prev) => {
          return pageNum === 1 ? data.movies : [...prev, ...data.movies];
        });

        setTotalItems(data.totalCount);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      } catch (err) {
        console.error('Error loading movies:', err);
      }

      setLoading(false);
    };

    loadMovies();
  }, [
    pageSize,
    pageNum,
    selectedGenre,
    searchTitle,
    selectedType,
    showRecommendedOnly,
  ]);

  useEffect(() => {
    setPageNum(1); // Reset pagination when filters/search change
  }, [selectedGenre, searchTitle, selectedType]);

  useEffect(() => {
    const handleScroll = () => {
      const bottomReached =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (bottomReached && pageNum < totalPages) {
        setPageNum((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pageNum, totalPages]);

  return (
    <>
      {/* ✅ Toggle UI for recommended movies */}
      <div style={{ margin: '20px', textAlign: 'center' }}>
        <label style={{ color: 'white' }}>
          <input
            type="checkbox"
            checked={showRecommendedOnly}
            onChange={() => {
              setShowRecommendedOnly(!showRecommendedOnly);
              setPageNum(1); // Reset pagination
            }}
          />{' '}
          Show Only Movies With Recommendations
        </label>
      </div>

      {/* 🎬 Movie grid */}
      <div className="movie-scroll">
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
                <strong>Year:</strong>
                {movie.release_year}
              </p>
              <p>
                <strong>Duration:</strong>
                {movie.duration}
              </p>
              <p>
                <strong>Rating:</strong>
                {movie.rating}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* <Pagination
        pageNum={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      /> */}

      {loading && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Loading more movies...
        </p>
      )}
    </>
  );
}

export default MoviesList;
