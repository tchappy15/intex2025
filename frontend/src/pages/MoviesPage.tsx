import { useState } from 'react';
import AuthorizeView from '../components/AuthorizeView';
import MovieRow from '../components/MovieRow';
import MoviesList from '../components/MoviesList';
import MovieHeaderBar from '../components/MovieHeaderBar';
import './MoviesPage.css';

function MoviesPage() {
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');


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

      {/* <AuthorizeView> */}
        <div className="movies-page">
          <div className="movies-container">

            {/* Recommender Row */}
            <MovieRow title="Movies We Think You'll Like" />

            {/* All Movies */}
            <h2 className="row-title">Movies A-Z</h2>
            <MoviesList
              selectedType={selectedType}
              selectedGenre={selectedGenre}
              searchTitle={searchTitle}
            />
          </div>
        </div>
      {/* </AuthorizeView> */}
    </>
  );
}

export default MoviesPage;