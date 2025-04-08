import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to Our App</h1>
      <p>This is a public landing page.</p>
      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
}
