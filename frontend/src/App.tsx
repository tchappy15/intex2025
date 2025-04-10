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
import UnauthorizedPage from './pages/UnauthorizedPage';
import { useLocation } from 'react-router-dom'
import { useContext } from 'react';
import { UserContext } from './components/AuthorizeView';


function AppWrapper() {
  const location = useLocation();
  const isPublicHomePage = location.pathname === '/';
  const user = useContext(UserContext);

  return (
    
      <div className="app-wrapper">
        <CookieConsent
          buttonText="Sure thing!!"
          cookieName="user_cookie_consent"
        >
          This website uses cookies to enhance the user experience.
        </CookieConsent>

        <div className={isPublicHomePage ? "app-content" : ""}>
          <Routes>
            <Route path="/" element={<PublicHomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movie/:title/:movieId" element={<OneMoviePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={user?.roles.includes('Administrator') ? <AdminPage /> : <UnauthorizedPage />} />
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

