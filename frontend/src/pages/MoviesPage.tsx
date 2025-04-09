import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

import AuthorizeView from '../components/AuthorizeView';
import MovieRow from '../components/MovieRow';
import MoviesList from '../components/MoviesList';
import MovieHeaderBar from '../components/MovieHeaderBar';
import './MoviesPage.css';

function MoviesPage() {
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [userRecs, setUserRecs] = useState([]);

  useEffect(() => {
    const fetchUserRecs = async () => {
      try {
        const userId = 1; // Replace with dynamic userId if you have auth/session
        const response = await axios.get(
          `/recommendations/user/${userId}/full`
        );
        console.log('🎯 User recs response:', response.data);
        setUserRecs(response.data); // ← now `MovieRow` will get real data
      } catch (err) {
        console.error('Failed to fetch user recommendations:', err);
      }
    };

    fetchUserRecs();
  }, []);

  return (
    <>
      <MovieHeaderBar
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        searchTitle={searchTitle}
        setSearchTitle={setSearchTitle}
        onLogout={() => {
          // Add your logout logic here
          window.location.href = '/login'; // Or use navigate('/login')
        }}
      />

      <AuthorizeView>
        <div className="movies-page">
          <div className="movies-container">
            {/* Recommender Row */}
            <MovieRow title="Movies We Think You'll Like" movies={userRecs} />

            {/* All Movies */}
            <h2 className="row-title">Movies A-Z</h2>
            <MoviesList
              selectedType={selectedType}
              selectedGenre={selectedGenre}
              searchTitle={searchTitle}
            />
          </div>
        </div>
      </AuthorizeView>
    </>
  );
}

export default MoviesPage;
