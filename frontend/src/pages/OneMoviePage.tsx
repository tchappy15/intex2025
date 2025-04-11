import MovieRow from '../components/MovieRow';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import { addRating, fetchMovieById } from '../api/api';
import './OneMoviePage.css';

const sanitizeTitle = (title: string) => {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/[<>:"/\\|?*'’!.,()&]/g, '') // remove punctuation
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .trim();
};

function OneMoviePage() {
  const navigate = useNavigate();
  const { title, movieId } = useParams();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [contentRecs, setContentRecs] = useState([]);
  const [collabRecs, setCollabRecs] = useState([]);
  const [movie, setMovie] = useState<any>(null);

  const showToast = () => {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  };
  

  useEffect(() => {
    if (!movieId) return;

    fetchMovieById(movieId)
      .then(setMovie)
      .catch((err) => console.error('Failed to load movie:', err));
  }, [movieId]);

  useEffect(() => {
    if (!movieId) return;

    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/recommendations/movie/${movieId}`
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const posters = data.map((rec: any) => {
          const cleanTitle = sanitizeTitle(rec.recommendedTitle || rec.title);
          return {
            movieId: rec.recommendedId || rec.movieId || rec.title,
            title: rec.recommendedTitle || rec.title,
            posterUrl: `https://cinenicheposters0215.blob.core.windows.net/movie-posters/${encodeURIComponent(cleanTitle)}.jpg`,
          };
        });

        setContentRecs(posters);
      })
      .catch(() => setContentRecs([]));
  }, [movieId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [movieId]);

  useEffect(() => {
    if (!title) return;

    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/recommendations/similar/${encodeURIComponent(title)}/${movieId}`
    )    
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const posters = data.map((rec: any) => {
          const cleanTitle = sanitizeTitle(rec.title);
          return {
            movieId: rec.movieId,
            title: rec.title,
            posterUrl: `https://cinenicheposters0215.blob.core.windows.net/movie-posters/${encodeURIComponent(cleanTitle)}.jpg`,
          };
        });
        setCollabRecs(posters);
      })
      .catch(() => setCollabRecs([]));
  }, [title]);

  useEffect(() => {
    const checkForEmail = () => {
      const emailEl = document.getElementById('user-email-container');
      if (emailEl && emailEl.textContent) {
        const email = emailEl.textContent.trim();
        if (email) {
          setUserEmail(email);
          return true;
        }
      }
      return false;
    };

    if (checkForEmail()) return;

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
      return;
    }

    try {
      await addRating(movieId!, rating, userEmail);
      setRating(0); // clear the stars
      showToast();  // show fancy message
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Error submitting rating.');
    }
  };

  if (!title || !movieId) {
    throw new Error('Missing required route parameters');
  }

  const cleanTitle = movie ? sanitizeTitle(movie.title) : '';

  return (
    <div className="one-movie-page">
      <AuthorizeView>
        <div id="user-email-container" style={{ display: 'none' }}>
          <AuthorizedUser value="email" />
        </div>

        <div className="page-header">
          <button className='one-cancel-btn' onClick={() => navigate('/movies')}>Back</button>
        </div>

        <h1 style={{color: "white"}}>{title}</h1>

        {movie ? (
          <div className="card">
            <img
              className="movie-thumbnail"
              src={`https://cinenicheposters0215.blob.core.windows.net/movie-posters/${encodeURIComponent(cleanTitle)}.jpg`}
              alt={movie.title}
              onError={(e) => {
                e.currentTarget.src =
                  'https://cinenicheposters0215.blob.core.windows.net/movie-posters/Bee Movie.jpg';
              }}
            />

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

        {(contentRecs.length > 0 || collabRecs.length > 0) && (
          <div className="recommendations mt-5">
            {contentRecs.length > 0 && (
              <MovieRow
                title="You Might Also Like"
                movies={contentRecs}
                showDetails={false}
              />
            )}
            {collabRecs.length > 0 && (
              <MovieRow
                title="Users Also Watched"
                movies={collabRecs}
                showDetails={false}
              />
            )}
          </div>
        )}

        <div id="toast" className="toast">Rating submitted!</div>
      </AuthorizeView>
    </div>
  );
}

export default OneMoviePage;
