import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/api';
import './RegisterPage.css';

function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    phoneExtension: '',
    email: '',
    age: '',
    gender: '',
    city: '',
    state: '',
    zip: '',
    password: '',
    confirmPassword: '',
    netflix: false,
    amazonPrime: false,
    disney: false,
    paramount: false,
    max: false,
    hulu: false,
    appleTV: false,
    peacock: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value, type, checked } = e.target as HTMLInputElement;

    if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10); // store raw digits only
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateStepOne = () => {
    const { firstName, lastName, phone, email, password, confirmPassword } = formData;
    return (
      firstName &&
      lastName &&
      phone.length === 10 &&
      email &&
      password &&
      confirmPassword
    );
  };

  const validateStepTwo = () => {
    const { age, gender, city, state, zip } = formData;
    return age && gender && city && state && zip;
  };

  const nextStep = () => {
    if ((step === 1 && validateStepOne()) || (step === 2 && validateStepTwo())) {
      setStep((prev) => prev + 1);
    } else {
      setError('Please fill in all required fields.');
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 13) {
      setError('Password must be at least 13 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await registerUser(formData);
      if (response.ok) {
        navigate('/');
      } else {
        const errorText = await response.text();
        setError(errorText);
      }
    } catch (err) {
      setError('Error registering user.');
    }
  };

  const streamingServices: { label: string; name: keyof typeof formData }[] = [
    { label: 'Netflix', name: 'netflix' },
    { label: 'Amazon Prime', name: 'amazonPrime' },
    { label: 'Disney+', name: 'disney' },
    { label: 'Paramount+', name: 'paramount' },
    { label: 'Max', name: 'max' },
    { label: 'Hulu', name: 'hulu' },
    { label: 'AppleTV+', name: 'appleTV' },
    { label: 'Peacock', name: 'peacock' },
  ];

  return (
    <div className="register-genre">
      <div className="text-center mb-4">
        <img src="/images/Logo.png" alt="Logo" className="register-logo" />
        <div className="register-card border-0 shadow rounded-3">
          <div className="card-body p-3">
            <h5
              className="card-title text-center mb-4"
              style={{
                fontFamily: 'Oswald',
                fontWeight: '700',
                fontSize: '2rem',
                color: 'white',
              }}
            >
              Create your CineNiche account in 3 easy steps:
            </h5>
            {step === 1 && (
              <div>
                <h4 style={{ color: 'white' }}>Step 1: Contact Info</h4>
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={`form-control mb-2 ${error && !formData.firstName  ? 'is-invalid' : ''}`}
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={`form-control mb-2 ${error && !formData.lastName ? 'is-invalid' : ''}`}
                />
                <input
                  name="phone"
                  placeholder="Phone (e.g. 8019230000)"
                  value={formData.phone}
                  onChange={handleChange}
                  inputMode="tel"
                  required
                  className={`form-control mb-2 ${error && !formData.phone ? 'is-invalid' : ''}`}
                />
                <input
                  name="phoneExtension"
                  placeholder="Phone Extension (optional)"
                  value={formData.phoneExtension}
                  onChange={handleChange}
                  className={`form-control mb-2 ${error && !formData.phoneExtension ? 'is-invalid' : ''}`}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`form-control mb-2 ${error && !formData.email ? 'is-invalid' : ''}`}
                />
                <div className="position-relative mb-2">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`form-control ${error && !formData.password ? 'is-invalid' : ''}`}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <small className="text-muted">
                  Password must be at least 13 characters long.
                </small>
                <div className="position-relative mb-2">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`form-control ${error && !formData.confirmPassword ? 'is-invalid' : ''}`}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <button
                  onClick={() => {
                    const { firstName, lastName, phone, email, password, confirmPassword } = formData;
                    if (
                      firstName &&
                      lastName &&
                      phone.length === 10 &&
                      email &&
                      password &&
                      confirmPassword
                    ) {
                      setStep(2);
                      setError('');
                    } else {
                      setError('Please fill in all required fields.');
                    }
                  }}
                  className="btn btn-primary w-100"
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h4 style={{ color: 'white' }}>Step 2: Get to Know You</h4>
                <input
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className={`form-control mb-2 ${error && !formData.age ? 'is-invalid' : ''}`}
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className={`form-control mb-2 ${error && !formData.gender ? 'is-invalid' : ''}`}
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <input
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className={`form-control mb-2 ${error && !formData.city ? 'is-invalid' : ''}`}
                />
                <input
                  name="state"
                  placeholder="State Abbreviation, e.g. UT"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className={`form-control mb-2 ${error && !formData.state ? 'is-invalid' : ''}`}
                />
                <input
                  name="zip"
                  placeholder="Zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                  className={`form-control mb-2 ${error && !formData.zip ? 'is-invalid' : ''}`}
                />
                <div className="d-flex justify-content-between">
                  <button onClick={prevStep} className="btn btn-secondary">
                    Back
                  </button>
                  <button
                    onClick={() => {
                      const { age, gender, city, state, zip } = formData;
                      if (age && gender && city && state && zip) {
                        setStep(3);
                        setError('');
                      } else {
                        setError('Please fill in all required fields.');
                      }
                    }}
                    className="btn btn-primary"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div>
                <h4 style={{ color: 'white' }}>
                  Step 3: Other Streaming Services (Optional)
                </h4>
                {streamingServices.map(({ label, name }) => (
                  <div key={name} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name={name}
                      checked={!!formData[name]}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label text-white"
                      htmlFor={name}
                    >
                      {label}
                    </label>
                  </div>
                ))}
                <div className="d-flex justify-content-between mt-3">
                  <button onClick={prevStep} className="btn btn-secondary">
                    Back
                  </button>
                  <button onClick={handleSubmit} className="btn btn-success">
                    Finish
                  </button>
                </div>
              </div>
            )}

            {error && <div className="text-danger mt-3">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
