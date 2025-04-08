import './App.css';
import MoviesPage from './pages/MoviesPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OneMoviePage from './pages/OneMoviePage';
import CartPage from './pages/CartPage';
//import { CartProvider } from './context/CartContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicHomePage from './pages/PublicHomePage';
import AdminPage from './pages/AdminPage';
import PrivacyPage from './pages/PrivacyPage';
import Footer from './components/Footer';
import CookieConsent from 'react-cookie-consent';

function App() {
  return (
    <>
      {/* <CartProvider> */}
      <Router>
        <CookieConsent
          buttonText="Sure thing!!"
          cookieName="user_cookie_consent"
        >
          This website uses cookies to enhance the user experience.
        </CookieConsent>
        <Routes>
          <Route path="/" element={<PublicHomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          {/* Internal Landing page */}
          <Route path="/movie/:title/:movieId" element={<OneMoviePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
        <Footer />
      </Router>
      {/* </CartProvider> */}
    </>
  );
}

export default App;
