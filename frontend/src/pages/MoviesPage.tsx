import { useState, useEffect } from 'react';
import type { PartialMovie } from '../components/MovieRow';

import AuthorizeView from '../components/AuthorizeView';
import MovieRow from '../components/MovieRow';
import MoviesList from '../components/MoviesList';
import MovieHeaderBar from '../components/MovieHeaderBar';
import './MoviesPage.css';

const sanitizeTitle = (title: string) => {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[<>:"/\\|?*'’!.,()&]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

function MoviesPage() {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [userRecs, setUserRecs] = useState<PartialMovie[]>([]);
  const [genreRecs, setGenreRecs] = useState<any>(null);

  const genrePosterMap = {
    action: ['action_Rec1', 'action_Rec2', 'action_Rec3'],
    comedies: ['comedies_Rec1', 'comedies_Rec2', 'comedies_Rec3'],
    children: ['children_Rec1', 'children_Rec2', 'children_Rec3'],
    drama: ['drama_Rec1', 'drama_Rec2', 'drama_Rec3'],
    fantasy: ['fantasy_Rec1', 'fantasy_Rec2', 'fantasy_Rec3'],
    thriller: ['thriller_Rec1', 'thriller_Rec2', 'thriller_Rec3'],
  } as const;

  const normalizedGenreMap: Record<string, keyof typeof genrePosterMap> = {
    Action: 'action',
    'TV Action': 'action',
    'Action & Adventure': 'action',
    Comedies: 'comedies',
    'TV Comedies': 'comedies',
    'Romantic Comedies': 'comedies',
    Children: 'children',
    "Kids' TV": 'children',
    Drama: 'drama',
    Dramas: 'drama',
    'TV Dramas': 'drama',
    'Dramas Romantic Movies': 'drama',
    Fantasy: 'fantasy',
    Thriller: 'thriller',
    Thrillers: 'thriller',
    'International Movies Thrillers': 'thriller',
  };

  useEffect(() => {
    const fetchUserRecs = async () => {
      try {
        const userId = 10;
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recommendations/user/${userId}/full`, {
          credentials: 'include',
        });
        const data = await response.json();
        const recsWithPosters = data.map((movie: any) => {
          const cleanTitle = sanitizeTitle(movie.title);
          return {
            movieId: movie.movieId,
            title: movie.title,
            release_year: movie.release_year,
            duration: movie.duration,
            rating: movie.rating,
            posterUrl: `https://cinenicheposters0215.blob.core.windows.net/movie-posters/${cleanTitle}.jpg`,
          };
        });
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
        const userId = 10;
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recommendations/genre/${userId}`);
        const data = await response.json();
        setGenreRecs(data);
      } catch (err) {
        console.error('Failed to fetch genre recommendations:', err);
      }
    };
    fetchGenreRecs();
  }, []);

  const normalizedGenre = normalizedGenreMap[selectedGenre] ?? null;

  const genreRecRow =
  genreRecs && normalizedGenre && genrePosterMap[normalizedGenre]
    ? genrePosterMap[normalizedGenre]
        .map((key) => {
          const entry = genreRecs[key];
          if (!entry || !entry.title || !entry.movieId) return null;

          const cleanTitle = sanitizeTitle(entry.title);

          return {
            movieId: entry.movieId,
            title: entry.title,
            release_year: entry.release_year,
            duration: entry.duration,
            rating: entry.rating,
            posterUrl: `https://cinenicheposters0215.blob.core.windows.net/movie-posters/${cleanTitle}.jpg`,
          } as PartialMovie;
        })
        .filter((movie): movie is PartialMovie => movie !== null)
    : [];

  return (
    <AuthorizeView>
      <MovieHeaderBar
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        searchTitle={searchTitle}
        setSearchTitle={setSearchTitle}
        onLogout={() => {
          window.location.href = '/login';
        }}
      />

      <div className="movies-page">
        <div className="movies-container">
          <MovieRow title="Movies We Think You'll Like" movies={userRecs} />
          {genreRecRow.length > 0 && (
            <MovieRow title={`Top ${selectedGenre} Picks for You`} movies={genreRecRow} />
          )}

          <h2 className="row-title">Entertainment A-Z</h2>
          <MoviesList
            selectedType={selectedType}
            selectedGenre={selectedGenre}
            searchTitle={searchTitle}
          />
        </div>
      </div>
    </AuthorizeView>
  );
}

export default MoviesPage;