import './App.css';
import MoviesPage from './pages/MoviesPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OneMoviePage from './pages/OneMoviePage';
import CartPage from './pages/CartPage';
//import { CartProvider } from './context/CartContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicHomePage from './pages/PublicHomePage';
import PrivacyPage from './pages/PrivacyPage';
import Footer from './components/Footer';
import CookieConsent from 'react-cookie-consent';
import { useLocation } from 'react-router-dom';
import AuthorizeView from './components/AuthorizeView';
import AdminRoute from './components/AdminRoute';

function AppWrapper() {
  const location = useLocation();
  const isPublicHomePage = location.pathname === '/';

  return (
    <div className="app-wrapper">
      {/* <CookieConsent buttonText="Sure thing!!" cookieName="user_cookie_consent">
        This website uses cookies to enhance the user experience.
      </CookieConsent> */}

      <CookieConsent
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName="user_cookie_consent"
        style={{ background: "#2c2c2c", fontFamily: "Georgia, serif" }}
        buttonStyle={{
          color: "#fff",
          backgroundColor: "#416270",
          fontWeight: "bold",
          borderRadius: "8px",
          padding: "8px 16px"
        }}
        declineButtonStyle={{
          color: "#fff",
          backgroundColor: "#555",
          fontWeight: "bold",
          borderRadius: "8px",
          padding: "8px 16px",
          marginLeft: "10px"
        }}
        expires={365}
      >
        This site uses cookies to improve your experience. See our{' '}
        <a href="/privacy" style={{ color: '#ffcc00', textDecoration: 'underline' }}>
          Privacy Policy
        </a>.
      </CookieConsent>




      <div className={isPublicHomePage ? 'app-content' : ''}>
        <Routes>
          <Route path="/" element={<PublicHomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movie/:title/:movieId" element={<OneMoviePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/admin"
            element={
              <AuthorizeView>
                <AdminRoute />
              </AuthorizeView>
            }
          />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

function App() {
  return (
    // <CartProvider>
    <Router>
      <AppWrapper />
    </Router>
    // </CartProvider>
  );
}

export default App;
