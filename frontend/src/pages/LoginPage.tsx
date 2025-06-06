import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './identity.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { loginUser } from '../api/api';
import './LoginPage.css';




function LoginPage() {
  // state variables for email and passwords
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberme, setRememberme] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);


  // state variable for error messages
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // handle change events for input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === 'checkbox') {
      setRememberme(checked);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  // handle submit event for the form

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await loginUser(email, password, rememberme);
      navigate('/movies');
    } catch (error: any) {
      setError(error.message || 'Error logging in.');
    }
  };

  return (
    
    <div className="login-genre">
      <div className="text-center">
      <img src="/images/Logo.png" alt="Logo" className="logo-login" />
        <div className="login-card border-0 shadow rounded-3 ">
          <div className="card-body  ">
          <h5
            style={{
              fontFamily: 'Oswald',
              fontWeight: '700', // Bold
              fontSize: '2.5rem', // Adjust this size as needed
              color: 'white'
            }}
            className="card-title mb-3">
            Sign In
          </h5>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  className="form-control"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Email Address"
                />
              </div>
              <div className="mb-3 position-relative ">
                <input
                  className="form-control pe-5"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder='Password'
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-1"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className='d-flex justify-content-center mb-3'>
                <div className="form-check d-flex align-items-center gap-2 mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberme"
                    name="rememberme"
                    checked={rememberme}
                    onChange={handleChange}
                  />
                  <label className="form-check-label text-white" htmlFor="rememberme">
                    Remember password
                  </label>
                </div>
              </div>
              <div className="d-grid mb-2">
              <button
                className="log-btn btn-login text-uppercase fw-bold custom-rounded"
                type="submit">
                Sign in
              </button>

              </div>
              <div className="d-grid mb-2">
                <button
                  className="log-btn btn-login text-uppercase fw-bold custom-rounded"
                  onClick={handleRegisterClick}
                >
                  Register
                </button>
              </div>
              <hr className="my-3" />

              <div className="d-grid mb-2">
              <button
                onClick={() => navigate('/')}
                className="log-cancel-btn btn-login text-uppercase fw-bold custom-rounded"
                type="button"
              >
                Return to Home
              </button>

              </div>

              {/* placeholders for signing in with other accounts like Google */}
              {/* <div className="d-grid mb-2">
                <button
                  className="btn btn-google btn-login text-uppercase fw-bold"
                  type="button"
                >
                  <i className="fa-brands fa-google me-2"></i> Sign in with
                  Google
                </button>
              </div>
              <div className="d-grid mb-2">
                <button
                  className="btn btn-facebook btn-login text-uppercase fw-bold"
                  type="button"
                >
                  <i className="fa-brands fa-facebook-f me-2"></i> Sign in with
                  Facebook
                </button>
              </div> */}
            </form>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
