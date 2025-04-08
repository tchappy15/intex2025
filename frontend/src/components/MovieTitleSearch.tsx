import { useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';
import './MovieTitleSearch.css';

function MovieTitleSearch({
  searchTitle,
  setSearchTitle,
}: {
  searchTitle: string;
  setSearchTitle: (title: string) => void;
}) {
  const debouncedSetSearchTitle = useMemo(() => debounce(setSearchTitle, 300), [setSearchTitle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTitle(e.target.value);
  };

  const handleClear = () => {
    setSearchTitle('');
  };

  useEffect(() => {
    return () => {
      debouncedSetSearchTitle.cancel();
    };
  }, [debouncedSetSearchTitle]);

  return (
    <div className="movie-search">
      <label htmlFor="title-search" className="form-label mb-0">
        Search by Title:
      </label>
      <input
        type="text"
        id="title-search"
        className="form-control pe-5"
        placeholder="Enter movie title..."
        value={searchTitle}
        onChange={handleChange}
      />
      {searchTitle && (
        <button
          type="button"
          className="clear-btn"
          onClick={handleClear}
          aria-label="Clear title"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default MovieTitleSearch;
