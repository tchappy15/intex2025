import './UnauthorizedPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="unauth-wrapper">
      <Link to='/'>
        <img
          className="unauth-logo"
          src="/images/Logo.png"
          alt="CineNiche Logo"
        />
      </Link>

      <div className="unauth-card">
        <h1>Unauthorized</h1>
        <p>You are not authorized to view this page.</p>
        <button
          onClick={() => navigate('/movies')}
          className="unauth-btn custom-rounded"
          type="button"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
