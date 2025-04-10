import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { GENRES } from '../constants/genres';
import { updateMovie } from '../api/api';
import { MOVIE_RATINGS } from '../constants/movieMPAARatings';
import { TV_RATINGS } from '../constants/tvMPAARatings';
import './EditMovieForm.css'

interface EditMovieFormProps {
  movie: Movie;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditMovieForm: React.FC<EditMovieFormProps> = ({
  movie,
  onSuccess,
  onCancel,
}) => {
  const [type, setType] = useState(movie.type || '');
  const [title, setTitle] = useState(movie.title);
  const [director, setDirector] = useState(movie.director);
  const [release_year, setrelease_year] = useState(movie.release_year);
  const [rating, setRating] = useState(movie.rating);
  const [duration, setDuration] = useState(() => {
    const numberOnly = movie.duration?.match(/\d+/)?.[0];
    return numberOnly ?? '';
  });
  const [description, setDescription] = useState(movie.description);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialGenres = GENRES.filter(
      (genre) => Boolean((movie as any)[genre.charAt(0).toLowerCase() + genre.slice(1)])
    );
    setSelectedGenres(initialGenres);
  }, [movie]);

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

    const formattedDuration =
      type === 'Movie'
        ? `${duration} min`
        : `${duration} Season${duration === '1' ? '' : 's'}`;

    const updatedMovie = {
      movieId: movie.movieId,
      type,
      title,
      director,
      release_year,
      rating,
      duration: formattedDuration,
      description,
      ...genrePayload,
    };

    try {
      await updateMovie(movie.movieId, updatedMovie);
      onSuccess();
    } catch (err) {
      setError('Failed to update movie.');
    } finally {
      setLoading(false);
    }
  };

  const ratings = type === 'Movie' ? MOVIE_RATINGS : type === 'TV Show' ? TV_RATINGS : [];

  return (
    <form onSubmit={handleSubmit} className="edit-movie-form">
      <h2 className="edit-movie-title">Edit {type || 'Item'}</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div>
        <label className="block font-medium">Type *</label>
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
          <div className="genre-checkboxes max-h-48 overflow-y-scroll">
            {GENRES.map((genre) => (
              <label key={genre} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                  className="mr-2"
                />
                {genre.replace(/([a-z])([A-Z])/g, '$1 $2')}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      <div className="edit-movie-buttons">
        <button
          type="submit"
          disabled={loading || !type}
          className="save-button"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cancel-button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditMovieForm;
