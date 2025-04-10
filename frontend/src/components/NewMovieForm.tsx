import { useState } from 'react';
import { GENRES } from '../constants/genres';
import { addMovie } from '../api/api';
import { MOVIE_RATINGS } from '../constants/movieMPAARatings';
import { TV_RATINGS } from '../constants/tvMPAARatings';
import { COUNTRIES } from '../constants/countries';
import './NewMovieForm.css';

interface NewMovieFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewMovieForm: React.FC<NewMovieFormProps> = ({ onSuccess, onCancel }) => {
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [release_year, setReleaseYear] = useState<number>(2024);
  const [rating, setRating] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cast, setCast] = useState('');
  const [country, setCountry] = useState('');

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!type || !title || !country || !rating || !duration) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setLoading(true);
    setError(null);

    // Create the genre payload with all possible genres to match API expectations
    const genrePayload = GENRES.reduce((acc, genre) => {
      acc[genre] = selectedGenres.includes(genre) ? 1 : 0;
      return acc;
    }, {} as Record<string, number>);

    // Format duration exactly as in the working version
    const durationStr = String(duration);
    const formattedDuration =
      type === 'Movie'
        ? `${durationStr} min`
        : `${durationStr} Season${durationStr === '1' ? '' : 's'}`;

    // Create a complete movie object with all expected fields
    const newMovie = {
      type,
      title,
      director,
      cast,
      country,
      release_year,
      rating,
      duration: formattedDuration,
      description,
      ...genrePayload // Spread in all genre fields
    };

    try {
      await addMovie(newMovie);
      onSuccess();
    } catch (err) {
      console.error('Error adding movie:', err);
      setError('Failed to add movie.');
    } finally {
      setLoading(false);
    }
  };

  const ratings = type === 'Movie' ? MOVIE_RATINGS : type === 'TV Show' ? TV_RATINGS : [];

  return (
    <form onSubmit={handleSubmit} className="new-movie-form">
      <h2 className="new-movie-title">Add New {type || 'Item'}</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div>
        <label className="required">Type</label>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setRating('');
            setDuration('');
          }}
          required
        >
          <option value="">-- Select Type --</option>
          <option value="Movie">Movie</option>
          <option value="TV Show">TV Show</option>
        </select>
      </div>

      <fieldset disabled={!type}>
        <div>
          <label className="required">Title</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label>Director</label>
          <input 
            value={director} 
            onChange={(e) => setDirector(e.target.value)} 
          />
        </div>

        <div>
          <label>Cast</label>
          <textarea 
            value={cast} 
            onChange={(e) => setCast(e.target.value)} 
          />
        </div>

        <div>
          <label className="required">Country</label>
          <select 
            value={country} 
            onChange={(e) => setCountry(e.target.value)} 
            required
          >
            <option value="">-- Select Country --</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="required">Release Year</label>
          <input
            type="number"
            value={release_year}
            onChange={(e) => setReleaseYear(parseInt(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="required">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value="">-- Select Rating --</option>
            {ratings.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="required">
            Duration ({type === 'Movie' ? 'min' : 'Season(s)'})
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>

        <div>
          <label>Select Genres:</label>
          <div className="new-genre-checkboxes max-h-48 overflow-y-scroll">
            {GENRES.map((genre) => (
              <label key={genre}>
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                />
                {genre.replace(/([a-z])([A-Z])/g, '$1 $2')}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      <div className="new-movie-buttons">
        <button
          type="submit"
          disabled={loading || !type}
          className="new-save-button"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="new-cancel-button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NewMovieForm;