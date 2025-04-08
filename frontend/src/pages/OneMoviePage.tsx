import { useNavigate, useParams } from 'react-router-dom';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';

function OneMoviePage() {
  const navigate = useNavigate();
  const { title, movieId, currentRetailPrice } = useParams();
  const price = currentRetailPrice ? parseFloat(currentRetailPrice) : 0; // Convert to number or fallback to 0
  if (!title || !movieId) {
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

        <button onClick={() => navigate('/movies')}>Go Back</button>
      </AuthorizeView>
    </>
  );
}
export default OneMoviePage;
