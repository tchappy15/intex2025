import MovieRow from '../components/MovieRow';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import { addRating, fetchMovieById } from '../api/api';
import './OneMoviePage.css';

// Import the UserContext directly (you may need to export it from AuthorizeView.tsx)
// If it's not exported, we'll use the ref approach instead
// import { UserContext } from '../components/AuthorizeView';

function OneMoviePage() {
  const navigate = useNavigate();
  const { title, movieId } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [contentRecs, setContentRecs] = useState([]);
  const [collabRecs, setCollabRecs] = useState([]);

  // Fetch content-based recommendations
  useEffect(() => {
    if (!movieId) return;

    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/recommendations/movie/${movieId}`
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const posters = data.map((rec: any) => ({
          movieId: rec.recommendedId || rec.movieId || rec.title,
          title: rec.recommendedTitle || rec.title,
          posterUrl: `/images/movieThumbnails/${encodeURIComponent(rec.recommendedTitle || rec.title)}.jpg`,
        }));

        setContentRecs(posters);
      })
      .catch(() => setContentRecs([]));
  }, [movieId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [movieId]);

  // Fetch collaborative recommendations
  useEffect(() => {
    if (!title) return;

    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/recommendations/similar/${encodeURIComponent(title)}`
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        console.log('📦 Clean Collab Recs:', data); // debug log

        const posters = data.map((rec: any) => ({
          movieId: rec.title, // Use title as fallback ID
          title: rec.title,
          posterUrl: `/images/movieThumbnails/${encodeURIComponent(rec.title)}.jpg`,
        }));
        setCollabRecs(posters);
      })
      .catch(() => setCollabRecs([]));
  }, [title]);

  // Safely extract email from DOM

  // Use a more reliable approach to get the email
  useEffect(() => {
    // Create a function to check for the email
    const checkForEmail = () => {
      const emailEl = document.getElementById('user-email-container');
      if (emailEl && emailEl.textContent) {
        const email = emailEl.textContent.trim();
        if (email) {
          setUserEmail(email);
          console.log('✅ Email captured:', email);
          return true; // Successfully got email
        }
      }
      return false; // Didn't get email yet
    };

    // Try immediately
    if (checkForEmail()) return;

    // If not successful, set up an interval to check
    const interval = setInterval(() => {
      if (checkForEmail()) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleRatingSubmit = async () => {
    if (rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }

    if (!userEmail) {
      alert('User email is not available. Please try again in a moment.');
      console.error('User email not available for rating submission');
      return;
    }

    console.log('Submitting rating:', {
      movieId: movieId,
      rating: rating,
      user_email: userEmail,
    });

    try {
      await addRating(movieId!, rating, userEmail);
      alert('Rating submitted!');
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Error submitting rating.');
    }
  };

  if (!title || !movieId) {
    throw new Error('Missing required route parameters');
  }

  return (
    <div className="one-movie-page">
      <AuthorizeView>
        {/* Hidden email container that we can reference */}
        <div id="user-email-container" style={{ display: 'none' }}>
          <AuthorizedUser value="email" />
        </div>

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
                <li>
                  <strong>Type:</strong> {movie.type}
                </li>
                <li>
                  <strong>Release Year:</strong> {movie.release_year}
                </li>
                <li>
                  <strong>Director:</strong> {movie.director || 'N/A'}
                </li>
                <li>
                  <strong>Cast:</strong> {movie.cast || 'N/A'}
                </li>
                <li>
                  <strong>Country:</strong> {movie.country || 'N/A'}
                </li>
                <li>
                  <strong>Duration:</strong> {movie.duration}
                </li>
                <li>
                  <strong>Rating:</strong> {movie.rating}
                </li>
                <li>
                  <strong>Description:</strong> {movie.description}
                </li>
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
          <p style={{ color: 'white' }}>Loading movie...</p>
        )}

        {(contentRecs?.length > 0 || collabRecs?.length > 0) && (
          <div className="recommendations mt-5">
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
