import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/Movie';
import { fetchMoviesFiltered, deleteMovie } from '../api/api';
import Pagination from '../components/Pagination';
import NewMovieForm from '../components/NewMovieForm';
import EditMovieForm from '../components/EditMovieForm';
import AdminHeaderBar from '../components/AdminHeaderBar';
import './AdminPage.css';
import AuthorizeView from '../components/AuthorizeView';

const AdminPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTitle, setSearchTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [debouncedSearchTitle, setDebouncedSearchTitle] = useState(searchTitle);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTitle(searchTitle);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTitle]);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const data = await fetchMoviesFiltered(pageSize, pageNum, '', debouncedSearchTitle, '');
      setMovies(data.movies);
      setTotalPages(Math.ceil(data.totalCount / pageSize));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, [pageSize, pageNum, debouncedSearchTitle]);

  const handleDelete = async (movieId: string, title: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirmDelete) return;

    try {
      await deleteMovie(movieId);
      setMovies(movies.filter((m) => m.movieId !== movieId));
    } catch (error) {
      alert('Failed to delete movie. Please try again.');
    }
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
    <AuthorizeView>
      <AdminHeaderBar
        searchTitle={searchTitle}
        setSearchTitle={setSearchTitle}
        onLogout={() => navigate('/login')}
      />

      <div className="admin-container">
        <h1 className="admin-title">Admin - Movies</h1>

        {!showForm && !editingMovie && (
          <button
            className="admin-add-button custom-rounded"
            onClick={() => setShowForm(true)}
          >
            + Add Movie
          </button>
        )}

        <div style={{ marginBottom: '2rem' }}>
          {showForm && (
            <NewMovieForm
              onSuccess={() => {
                setShowForm(false);
                loadMovies();
              }}
              onCancel={() => setShowForm(false)}
            />
          )}

          {editingMovie && (
            <EditMovieForm
              movie={editingMovie}
              onSuccess={() => {
                setEditingMovie(null);
                loadMovies();
              }}
              onCancel={() => setEditingMovie(null)}
            />
          )}
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Duration</th>
              <th>Rating</th>
              <th>Release Year</th>
              <th>Type</th>
              <th>Director</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.movieId}>
                <td>{m.movieId}</td>
                <td>{m.title}</td>
                <td>{m.duration}</td>
                <td>{m.rating}</td>
                <td>{m.release_year ?? 'N/A'}</td>
                <td>{m.type}</td>
                <td>{m.director}</td>
                <td>{m.country}</td>
                <td className="admin-actions">
                  <button className="edit-btn" onClick={() => setEditingMovie(m)}>
                    ✏️
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(m.movieId, m.title)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination-wrapper">
          <Pagination
            pageNum={pageNum}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPageNum}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPageNum(1);
            }}
          />
        </div>
      </div>
      </AuthorizeView>
    </>
  );
};

export default AdminPage