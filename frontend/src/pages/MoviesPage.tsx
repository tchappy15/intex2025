import GenreFilter from '../components/GenreFilter';
import MoviesList from '../components/MoviesList';
import Header from '../components/Header';
import { useState } from 'react';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import ManageMovies from '../components/ManageMovies';

function MoviesPage() {
  const [selectedGenre, setSelectedGenre] = useState<string>(''); // singular

  return (
    <AuthorizeView>
      <Logout>
        <button
          style={{
            position: 'fixed',
            top: '10px',
            left: '20px',
            background: '#f8f9fa',
            padding: '10px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            fontSize: '16px',
          }}
        >
          Logout <AuthorizedUser value="email" />
        </button>
      </Logout>

      <div className="Genre mt-4">
        <ManageMovies />
        <Header />
        <div className="row">
          <div className="col-md-3">
            <GenreFilter
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
            />
          </div>
          <div className="col-md-9">
            <MoviesList selectedGenre={selectedGenre} />
          </div>
        </div>
      </div>
    </AuthorizeView>
  );
}

export default MoviesPage;
