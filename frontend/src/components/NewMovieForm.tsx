import { useState } from 'react';
import { GENRES } from '../constants/genres';
import { addMovie } from '../api/api';
import { RATINGS } from '../constants/ratings';

interface NewMovieFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewMovieForm: React.FC<NewMovieFormProps> = ({ onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [release_year, setrelease_year] = useState<number>(2024);
  const [rating, setRating] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const genrePayload = GENRES.reduce(
      (acc, genre) => {
        acc[genre] = selectedGenres.includes(genre) ? 1 : 0;
        return acc;
      },
      {} as Record<string, number>
    );

    const newMovie = {
      title,
      director,
      Release_Year: release_year,
      rating,
      duration,
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

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-4">
      <h2 className="text-lg font-semibold mb-4">Add New Movie</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="mb-2">
        <label className="block font-medium">Title</label>
        <input
          className="border px-2 py-1 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium">Director</label>
        <input
          className="border px-2 py-1 w-full"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium">Release Year</label>
        <input
          type="number"
          className="border px-2 py-1 w-full"
          value={release_year}
          onChange={(e) => setrelease_year(parseInt(e.target.value))}
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium">Rating</label>
        <select
          className="border px-2 py-1 w-full"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="">-- Select Rating --</option>
          {RATINGS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="block font-medium">Duration</label>
        <input
          className="border px-2 py-1 w-full"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium">Description</label>
        <textarea
          className="border px-2 py-1 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-4">
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

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
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
