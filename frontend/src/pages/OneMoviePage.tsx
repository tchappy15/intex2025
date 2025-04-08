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
            Logout <AuthorizedUser value="email" />
          </Logout>
        </span>

        <h1>Want a cold refreshing {title}?</h1>
        <h2>Only ${price.toFixed(2)}</h2>

        <button onClick={() => navigate('/movies')}>Go Back</button>
      </AuthorizeView>
    </>
  );
}
export default OneMoviePage;
