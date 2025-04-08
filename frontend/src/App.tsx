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

function App() {
  return (
    <>
      {/* <CartProvider> */}
        <Router>
          <Routes>
            <Route path="/" element={<PublicHomePage />} />
            <Route path="/movies" element={<MoviesPage />} />{/* Internal Landing page */}
            <Route
              path="/movie/:title/:movieId"
              element={<OneMoviePage />}
            />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Router>
      {/* </CartProvider> */}
    </>
  );
}

export default App;
