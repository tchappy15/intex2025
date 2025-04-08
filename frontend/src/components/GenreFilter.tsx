import { useEffect, useState } from 'react';
import { fetchGenres } from '../api/api';
import './GenreFilter.css';

function GenreFilter({
  selectedGenre,
  setSelectedGenre,
}: {
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
}) {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genre types', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
  };

  return (
    <div className="genre-filter mb-3">
      <label htmlFor="genre-select" className="form-label">
        Filter by Genre:
      </label>
      <select
        id="genre-select"
        className="form-select"
        value={selectedGenre}
        onChange={handleChange}
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
}

export default GenreFilter;
