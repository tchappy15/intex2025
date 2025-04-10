import MovieRow from '../components/MovieRow';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AuthorizeView from '../components/AuthorizeView';
import Logout from '../components/Logout';
import { addRating, fetchMovieById } from '../api/api';
import MovieRow from '../components/MovieRow';

function OneMoviePage() {
  const navigate = useNavigate();
  const { title, movieId } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [contentRecs, setContentRecs] = useState([]);
  const [collabRecs, setCollabRecs] = useState([]);

  useEffect(() => {
    if (!movieId) return;

    fetchMovieById(movieId)
      .then(setMovie)
      .catch((err) => console.error('Failed to load movie:', err));

    fetch(`${import.meta.env.VITE_API_BASE_URL}/recommendations/movie/${movieId}`)
      .then((res) => {
        if (!res.ok) throw new Error('No content recs found');
        return res.json();
      })
      .then((data) => {
        const posters = data.map((m: any) => ({
          ...m,
          posterUrl: `/images/movieThumbnails/${m.title}.jpg`,
        }));
        setContentRecs(posters);
      })
      .catch(() => setContentRecs([]));
  }, [movieId]);

  // Fetch content-based recommendations
  useEffect(() => {
    if (!movieId) return;

    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/recommendations/movie/${movieId}`
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const posters = data.map((rec: any) => ({
          movieId: rec.recommended_id || rec.movieId || rec.title,
          title: rec.recommended_title || rec.title,
          posterUrl: `/images/movieThumbnails/${encodeURIComponent(rec.recommended_title || rec.title)}.jpg`,
        }));
        setContentRecs(posters);
      })
      .catch(() => setContentRecs([]));
  }, [movieId]);

  // Fetch collaborative recommendations
  useEffect(() => {
    if (!title) return;

    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/recommendations/similar/${encodeURIComponent(title)}`
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const posters = data.map((rec: any) => ({
          movieId: rec.recommended_id || rec.movieId || rec.title,
          title: rec.recommended_title || rec.title,
          posterUrl: `/images/movieThumbnails/${encodeURIComponent(rec.recommended_title || rec.title)}.jpg`,
        }));
        setCollabRecs(posters);
      })
      .catch(() => setCollabRecs([]));
  }, [title]);

  // Safely extract email from DOM

  useEffect(() => {
    const interval = setInterval(() => {
      const emailElement = document.getElementById('user-email');
      if (emailElement) {
        const email = emailElement.textContent?.trim();
        if (email) {
          setUserEmail(email);
          clearInterval(interval);
        }
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleRatingSubmit = async () => {
    if (rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }

    try {
      await addRating(movieId!, rating, userEmail);
      alert('Rating submitted!');
    } catch (err) {
      console.error(err);
      alert('Error submitting rating.');
    }
  };

  if (!title || !movieId) {
    throw new Error('Missing required route parameters');
  }

  return (
    <div className="one-movie-page">
      <AuthorizeView>
        <div className="page-header">
          <button onClick={() => navigate('/movies')}>Go Back</button>
          <Logout>
            <button>Logout</button>
          </Logout>
        </div>

        <h1>{title}</h1>

        {movie ? (
          <div className="card">
            <div className="poster" />
            <div className="movie-info">
              <ul>
                <li><strong>Type:</strong> {movie.type}</li>
                <li><strong>Release Year:</strong> {movie.release_year}</li>
                <li><strong>Director:</strong> {movie.director || 'N/A'}</li>
                <li><strong>Cast:</strong> {movie.cast || 'N/A'}</li>
                <li><strong>Country:</strong> {movie.country || 'N/A'}</li>
                <li><strong>Duration:</strong> {movie.duration}</li>
                <li><strong>Rating:</strong> {movie.rating}</li>
                <li><strong>Description:</strong> {movie.description}</li>
              </ul>

              <div className="rating-section">
                <h4>Rate this movie</h4>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${rating >= star || hoverRating >= star ? 'filled' : ''}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      ★
                    </span>
                  ))}
                  <button onClick={handleRatingSubmit}>Submit Rating</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading movie...</p>
        )}

        <button
          className="btn btn-secondary mt-3"
          onClick={() => navigate('/movies')}
        >
          Go Back
        </button>
        {(contentRecs.length > 0 || collabRecs.length > 0) && (
          <div className="recommendations mt-5">
            <h3 style={{ color: 'white' }}>Recommended for You</h3>
            {contentRecs.length > 0 && (
              <MovieRow
                title="You Might Also Like (Content-Based)"
                movies={contentRecs}
              />
            )}
            {collabRecs.length > 0 && (
              <MovieRow
                title="Users Also Watched (Collaborative Filtering)"
                movies={collabRecs}
              />
            )}
          </div>
        )}

      </AuthorizeView>
    </div>
  );
}

export default OneMoviePage;
