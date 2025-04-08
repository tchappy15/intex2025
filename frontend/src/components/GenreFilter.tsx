import { useEffect, useState } from 'react';
import './GenreFilter.css';
import { fetchGenres } from '../api/api'; // Assuming you have some CSS for styling

function GenreFilter({
  selectedGenres,
  setSelectedGenres,
}: {
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
}) {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
        setSelectedGenres(data);
      } catch (error) {
        console.error('Error fetching genre types', error);
      }
    };
    fetchData();

    fetchGenres();
  }, [setSelectedGenres]);

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedGenres = selectedGenres.includes(target.value)
      ? selectedGenres.filter((x) => x !== target.value)
      : [...selectedGenres, target.value];

    setSelectedGenres(updatedGenres);
  }

  return (
    <div className="genre-filter">
      <h5>Genre Types</h5>
      <div className="genre-list">
        {genres.map((c) => (
          <div key={c} className="genre-item">
            <input
              type="checkbox"
              id={c}
              name={c}
              value={c}
              className="genre-checkbox"
              onChange={handleCheckboxChange}
              checked={selectedGenres.includes(c)}
            />
            <label htmlFor={c}>{c}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GenreFilter;
