import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  genre: string;
}

const InfiniteMovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [genre, setGenre] = useState('');
  const [search, setSearch] = useState('');
  const pageSize = 10;

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`/movies/GetMovies`, {
        params: {
          pageNum,
          pageSize,
          genre,
          title: search,
        },
      });

      const newMovies = response.data.movies;

      setMovies((prev) => [...prev, ...newMovies]);
      setHasMore(newMovies.length === pageSize);
      setPageNum((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
      setHasMore(false);
    }
  };

  const handleFilterChange = () => {
    setPageNum(1);
    setHasMore(true);
    setMovies([]);

    setTimeout(() => {
      fetchMovies();
    }, 0);
  };

  useEffect(() => {
    fetchMovies(); // initial load
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-between">
        <input
          type="text"
          placeholder="Search by title..."
          className="border p-2 rounded w-full sm:w-1/2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleFilterChange();
          }}
        />
        <select
          className="border p-2 rounded w-full sm:w-1/3"
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
            handleFilterChange();
          }}
        >
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          {/* Add more genres */}
        </select>
      </div>

      <InfiniteScroll
        dataLength={movies.length}
        next={fetchMovies}
        hasMore={hasMore}
        loader={<p className="text-center text-white">Loading more movies...</p>}
        endMessage={
          <p className="text-center text-gray-500">No more movies to load.</p>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <div key={movie.id} className="border p-4 rounded shadow">
              <h3 className="font-bold">{movie.title}</h3>
              <p className="text-sm text-gray-600">{movie.genre}</p>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default InfiniteMovieList;
