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
          src="/images/logo.png"
          alt="CineNiche Film Camera Logo"
        />
      </Link>

      <div className="unauth-card">
        <button
          onClick={() => navigate('/movies')}
          className="unauth-btn custom-rounded"
          type="button"
        >
          Back
        </button>

        <h1>Unauthorized</h1>
        <p>You are not authorized to view this page.</p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
