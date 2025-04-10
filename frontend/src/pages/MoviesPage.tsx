import { useState } from 'react';
import { useEffect } from 'react';
// import axios from 'axios';

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
  const [genreRecs, setGenreRecs] = useState<any>(null);

  const normalizedGenreMap: Record<string, keyof typeof genrePosterMap> = {
    Action: 'Action',
    'TV Action': 'Action',
    'Action & Adventure': 'Action',

    Comedies: 'Comedies',
    'TV Comedies': 'Comedies',
    'Romantic Comedies': 'Comedies',

    Children: 'Children',
    "Kids' TV": 'Children',

    Drama: 'Drama',
    'TV Dramas': 'Drama',
    Dramas: 'Drama',
    'Dramas Romantic Movies': 'Drama',

    Fantasy: 'Fantasy',

    Thriller: 'Thriller',
    Thrillers: 'Thriller',
    'International Movies Thrillers': 'Thriller',
  };

  useEffect(() => {
    const fetchUserRecs = async () => {
      try {
        const userId = 10; // or dynamic if you’ve got login working
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/recommendations/user/${userId}/full`,
          {
            credentials: 'include',
          }
        );

        const data = await response.json();

        const recsWithPosters = data.map((movie: any) => ({
          ...movie,
          posterUrl: `/images/movieThumbnails/${movie.title}.jpg`,
        }));

        setUserRecs(recsWithPosters);
      } catch (err) {
        console.error('Failed to fetch user recommendations:', err);
      }
    };

    fetchUserRecs();
  }, []);

  useEffect(() => {
    const fetchGenreRecs = async () => {
      try {
        const userId = 10; // Replace dynamically if you have auth
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/recommendations/genre/${userId}`
        );
        const data = await response.json();
        setGenreRecs(data); // Save full genre recs object
      } catch (err) {
        console.error('Failed to fetch genre recommendations:', err);
      }
    };

    fetchGenreRecs();
  }, []);

  const genrePosterMap = {
    Action: ['Action_Rec1', 'Action_Rec2', 'Action_Rec3'],
    Comedies: ['Comedies_Rec1', 'Comedies_Rec2', 'Comedies_Rec3'],
    Children: ['Children_Rec1', 'Children_Rec2', 'Children_Rec3'],
    Drama: ['Drama_Rec1', 'Drama_Rec2', 'Drama_Rec3'],
    Fantasy: ['Fantasy_Rec1', 'Fantasy_Rec2', 'Fantasy_Rec3'],
    Thriller: ['Thriller_Rec1', 'Thriller_Rec2', 'Thriller_Rec3'],
  };

  const normalized = normalizedGenreMap[selectedGenre];
  const genreRecRow =
    genreRecs && normalized && genrePosterMap[normalized]
      ? genrePosterMap[normalized]
          .map((key) => {
            const title = genreRecs[key];
            return title
              ? {
                  movieId: title, // fallback if you don’t have movieId
                  title,
                  posterUrl: `/images/movieThumbnails/${encodeURIComponent(title)}.jpg`,
                }
              : null;
          })
          .filter(
            (m): m is { movieId: string; title: string; posterUrl: string } =>
              m !== null
          )
      : [];

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
            {genreRecRow.length > 0 && (
              <MovieRow
                title={`Top ${selectedGenre} Picks for You`}
                movies={genreRecRow}
              />
            )}

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
