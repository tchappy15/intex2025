import { useState } from 'react';
import { GENRES } from '../constants/genres';
import { addMovie } from '../api/api';
import { MOVIE_RATINGS } from '../constants/movieMPAARatings';
import { TV_RATINGS } from '../constants/tvMPAARatings';
import { COUNTRIES } from '../constants/countries';


interface NewMovieFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewMovieForm: React.FC<NewMovieFormProps> = ({ onSuccess, onCancel }) => {
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [release_year, setrelease_year] = useState<number>(2024);
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
    setLoading(true);
    setError(null);

    const genrePayload = GENRES.reduce((acc, genre) => {
      acc[genre] = selectedGenres.includes(genre) ? 1 : 0;
      return acc;
    }, {} as Record<string, number>);

    const formattedDuration =
        type === 'Movie'
            ? `${duration} min`
            : `${duration} Season${duration === '1' ? '' : 's'}`;

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
      ...genrePayload,
    };

    try {
      await addMovie(newMovie);
      onSuccess();
    } catch (err) {
      setError('Failed to add movie.');
    } finally {
      setLoading(false);
    }
  };

  const ratings = type === 'Movie' ? MOVIE_RATINGS : type === 'TV Show' ? TV_RATINGS : [];

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-4">
      <h2 className="text-lg font-semibold mb-4">Add New {type || 'Item'}</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="mb-2">
        <label className="block font-medium">Type</label>
        <select
          className="border px-2 py-1 w-full"
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

      <fieldset disabled={!type} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            className="border px-2 py-1 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Director</label>
          <input
            className="border px-2 py-1 w-full"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Cast</label>
          <textarea
            className="border px-2 py-1 w-full"
            value={cast}
            onChange={(e) => setCast(e.target.value)}
          />
        </div>

        <div>
            <label className="block font-medium">Country</label>
            <select
                className="border px-2 py-1 w-full"
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
          <label className="block font-medium">Release Year</label>
          <input
            type="number"
            className="border px-2 py-1 w-full"
            value={release_year}
            onChange={(e) => setrelease_year(parseInt(e.target.value))}
          />
        </div>

        <div>
          <label className="block font-medium">Rating</label>
          <select
            className="border px-2 py-1 w-full"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value="">-- Select Rating --</option>
            {ratings.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">
            Duration ({type === 'Movie' ? 'min' : 'Season(s)'})
          </label>
          <input
            type="number"
            className="border px-2 py-1 w-full"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            className="border px-2 py-1 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Select Genres:</label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-scroll border p-2 rounded">
            {GENRES.map((genre) => (
              <label key={genre} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                  className="mr-2"
                />
                {genre}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={loading || !type}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NewMovieForm;
