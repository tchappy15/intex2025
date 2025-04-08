import { Link } from 'react-router-dom';
import './PublicHomePage.css';

export default function HomePage() {
  return (
    
    <div className="home-page-container">
      <div className="card">
      <img src="/images/Logo.png" alt="Logo" className="login-logo" />
        <h1>Discover A Personally Curated<br/>Collection of Niche Films<br/>Just For You!</h1>
        <Link to="/login">
          <button className="custom-btn">Sign in / Register</button>
        </Link>
      </div>
    </div>
  );
}
