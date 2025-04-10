import { useEffect, useState, useContext } from 'react';
import './MovieHeaderBar.css';
import { useNavigate } from 'react-router-dom';
import { fetchGenres } from '../api/api';
import Logout from './Logout';
import { UserContext } from './AuthorizeView';

function MovieHeaderBar({
  selectedType,
  setSelectedType,
  selectedGenre,
  setSelectedGenre,
  searchTitle,
  setSearchTitle,
}: {
  selectedType: string; 
  setSelectedType: (type: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  searchTitle: string;
  setSearchTitle: (title: string) => void;
  onLogout: () => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const navigate = useNavigate();
  const user = useContext(UserContext);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (err) {
        console.error('Failed to load genres:', err);
      }
    };
    loadGenres();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector('.movie-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="movie-header">
      <img
        src="/images/Logo.png"
        alt="CineNiche"
        className="movie-header-logo"
        onClick={() => window.location.reload()}
        style={{ cursor: 'pointer' }}
      />

      <div className="movie-header-buttons">
      <button
          className={selectedType === 'Movie' ? 'active' : ''}
          onClick={() => setSelectedType(selectedType === 'Movie' ? '' : 'Movie')}
        >
          Movies
        </button>

        <button
          className={selectedType === 'Tv Show' ? 'active' : ''}
          onClick={() => setSelectedType(selectedType === 'Tv Show' ? '' : 'Tv Show')}
        >
          TV Shows
        </button>

        <div className="genre-select-wrapper">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="movie-search-bar">
        <input
          type="text"
          placeholder="Search Movie Title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <button className="movie2-icon-btn">🔍</button>
      </div>

      <div className="movie-header-icons">
        <div className="movie-dropdown">
          <button
            className="movie-icon-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            ⚙️
          </button>
          {dropdownOpen && (
            <div className="movie-dropdown-menu">
              {user?.roles.includes("Administrator") && (
              <button onClick={() => navigate('/admin')}>Manage Movies</button> )}
              
              {/* added Logout for proper log out functionality */}
              <Logout>
                <button> 
                  Logout
              </button>
              </Logout>
              
            </div>
          )}
        </div>
        <img src="/images/user.jpg" alt="Profile" className="movie-avatar" />
      </div>
    </div>
  );
}

export default MovieHeaderBar;
