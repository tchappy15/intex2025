import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHeaderBar.css';
import Logout from './Logout';

function AdminHeaderBar({
  searchTitle,
  setSearchTitle,
}: {
  searchTitle: string;
  setSearchTitle: (title: string) => void;
  onLogout: () => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector('.admin-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="admin-header">
      <img
        src="/images/Logo.png"
        alt="CineNiche"
        className="admin-header-logo"
        onClick={() => navigate('/movies')}
        style={{ cursor: 'pointer' }}
      />

      <div className="admin-search-bar">
        <input
          type="text"
          placeholder="Search Movie Title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <button className="admin-search-btn">🔍</button>
      </div>

      <div className="admin-header-icons">
        <div className="admin-dropdown">
          <button
            className="admin-icon-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            ⚙️
          </button>
          {dropdownOpen && (
            <div className="admin-dropdown-menu">
              <button onClick={() => navigate('/movies')}>Home</button>

              {/* added Logout for proper log out functionality */}
              <Logout>
                <button> 
                  Logout
              </button>
              </Logout>

            </div>
          )}
        </div>
        <img src="/images/Cassy.jpg" alt="Profile" className="admin-avatar" />
      </div>
    </div>
  );
}

export default AdminHeaderBar;