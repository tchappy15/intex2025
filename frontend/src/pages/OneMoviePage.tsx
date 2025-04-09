import { useNavigate, useParams } from 'react-router-dom';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import { useEffect, useState } from 'react';

function OneMoviePage() {
  const navigate = useNavigate();
  const [collabRecs, setCollabRecs] = useState<any>(null);
  const [contentRecs, setContentRecs] = useState<any[]>([]);
  const { title, movieId, currentRetailPrice } = useParams();
  const price = currentRetailPrice ? parseFloat(currentRetailPrice) : 0; // Convert to number or fallback to 0

  if (!title || !movieId) {
    useEffect(() => {
      if (!title || !movieId) return; // prevent running if either is missing

      // Collaborative Filtering (based on title)
      fetch(`/recommendations/similar/${encodeURIComponent(title)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setCollabRecs(data))
        .catch((err) => console.error('Collab rec error:', err));

      // Content Filtering (based on movieId)
      fetch(`/recommendations/movie/${movieId}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setContentRecs(data))
        .catch((err) => console.error('Content rec error:', err));
    }, [title, movieId]);

    throw new Error('Missing required route parameters: ');
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
                left: '20px', // changed from right to left
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
              Logout <AuthorizedUser value="email" />
            </button>
          </Logout>
        </span>

        <h1>This will be the Movie Detail Page</h1>

        <h1>Want a cold refreshing {title}?</h1>
        <h2>Only ${price.toFixed(2)}</h2>

        {collabRecs && (
          <div>
            <h3>🤝 People who liked "{title}" also liked:</h3>
            <ul>
              {[
                collabRecs.rec1,
                collabRecs.rec2,
                collabRecs.rec3,
                collabRecs.rec4,
                collabRecs.rec5,
              ].map((rec: string, i: number) => rec && <li key={i}>{rec}</li>)}
            </ul>
          </div>
        )}

        {contentRecs.length > 0 && (
          <div>
            <h3>🧠 Similar movies (content-based):</h3>
            <ul>
              {contentRecs.map((rec, i) => (
                <li key={i}>
                  {rec.recommendedTitle} (score: {rec.score.toFixed(2)})
                </li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={() => navigate('/movies')}>Go Back</button>
      </AuthorizeView>
    </>
  );
}
export default OneMoviePage;
