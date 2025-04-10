import './PrivacyPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, []);

  return (
    <>
    <Link to='/'>
      <img
        className="privacy-img"
        src="src/assets/CineNicheFull.png"
        alt="CineNiche Film Camera Logo"
      />
    </Link>
    <div className="privacy-div">
        <button
          onClick={() => navigate('/movies')}
          className="sticky-btn custom-rounded"
          type="button"
          >
            Back
        </button>
        <h1>Unauthorized</h1>
        <p>You are not authorized to view this page.</p>
    </div>
    </>)
}

export default UnauthorizedPage