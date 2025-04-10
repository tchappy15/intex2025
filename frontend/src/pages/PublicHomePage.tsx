import { Link } from 'react-router-dom';
import './PublicHomePage.css';

export default function HomePage() {
  return (
    
    <div className="body">
      <div className="public-card">
      <img src="/images/Logo.png" alt="Logo" className="login-logo" />
          <h1>Niche Films,<br/>Curated For You!</h1> {/* Discover a personally curated collection of niche films just for you! */}
        <Link to="/login">
          <button className="custom-btn">Sign in / Register</button>
        </Link>
      </div>
    </div>
  );
}
