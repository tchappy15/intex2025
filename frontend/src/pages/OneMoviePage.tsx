import MovieRow from '../components/MovieRow'; // If not already imported

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import { addRating, fetchMovieById } from '../api/api';

function OneMoviePage() {
  const navigate = useNavigate();
  const { title, movieId } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [contentRecs, setContentRecs] = useState([]);
  const [collabRecs, setCollabRecs] = useState([]);

  useEffect(() => {
    if (!movieId) return;

    fetchMovieById(movieId)
      .then(setMovie)
      .catch((err) => console.error('Failed to load movie:', err));

    console.log('📦 Fetching content recs for:', movieId);
    console.log('📦 Fetching collab recs for:', movie?.title);

    // Content Filtering
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/recommendations/content/${movieId}`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`No content recs for ${movieId}`);
        return res.json();
      })

      .then((data) => {
        const posters = data.map((m: any) => ({
          ...m,
          posterUrl: `/images/movieThumbnails/${m.title}.jpg`,
        }));
        setContentRecs(posters);
      })
      .catch((err) => console.error('Content-based recs error:', err));
  }, [movieId]);

  // Collaborative Filtering
  useEffect(() => {
    if (!movie?.title) return;

    const encodedTitle = encodeURIComponent(movie.title);

    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/recommendations/collab/${encodedTitle}`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`No collab recs for ${movie?.title}`);
        return res.json();
      })

      .then((data) => {
        const posters = data.map((m: any) => ({
          ...m,
          posterUrl: `/images/movieThumbnails/${m.title}.jpg`,
        }));
        setCollabRecs(posters);
      })
      .catch((err) => console.error('Collaborative recs error:', err));
  }, [movie]);

  // Safely extract email from DOM
  useEffect(() => {
    const interval = setInterval(() => {
      const emailElement = document.getElementById('user-email');
      if (emailElement) {
        const email = emailElement.textContent?.trim();
        if (email) {
          setUserEmail(email);
          console.log('✅ Set user email from DOM:', email);
          clearInterval(interval); // stop polling once set
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

    console.log('Submitting rating:', {
      movieId: movieId,
      rating: rating,
      user_email: userEmail,
    });

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
    <>
      <AuthorizeView>
        <span>
          <Logout>
            <button
              style={{
                position: 'fixed',
                top: '10px',
                left: '20px',
                background: '#f8f9fa',
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                fontSize: '16px',
              }}
            >
              Logout{' '}
              <span id="user-email">
                <AuthorizedUser value="email" />
              </span>
            </button>
          </Logout>
        </span>

        <h1 style={{ color: 'white' }}>{title}</h1>

        {movie ? (
          <div className="card">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Type:</strong> {movie.type}
              </li>
              <li className="list-group-item">
                <strong>Release Year:</strong> {movie.release_year}
              </li>
              <li className="list-group-item">
                <strong>Director:</strong> {movie.director || 'N/A'}
              </li>
              <li className="list-group-item">
                <strong>Cast:</strong> {movie.cast || 'N/A'}
              </li>
              <li className="list-group-item">
                <strong>Country:</strong> {movie.country || 'N/A'}
              </li>
              <li className="list-group-item">
                <strong>Duration:</strong> {movie.duration}
              </li>
              <li className="list-group-item">
                <strong>Rating:</strong> {movie.rating}
              </li>
              <li className="list-group-item">
                <strong>Description:</strong> {movie.description}
              </li>
            </ul>

            <div className="mt-3">
              <h4 style={{ color: 'white' }}>Rate this movie</h4>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
              >
                <option value={0}>Select a rating</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-primary ms-2"
                onClick={handleRatingSubmit}
              >
                Submit Rating
              </button>
              <hr style={{ margin: '40px 0', borderTop: '1px solid #ccc' }} />

              <div style={{ marginTop: '50px' }}>
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
      </AuthorizeView>
    </>
  );
}

export default OneMoviePage;
