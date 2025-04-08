import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { fetchMovies, deleteMovie } from '../api/api';
import Pagination from '../components/Pagination';
import NewMovieForm from '../components/NewMovieForm';
import EditMovieForm from '../components/EditMovieForm';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchMovies(pageSize, pageNum, []); // empty container filter for now
        setMovies(data.movies);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [pageSize, pageNum]);

  const handleDelete = async (movieId: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this movie?'
    );
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
        <button
        onClick={() => navigate('/movies')}
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
          Go Back
        </button>

    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Movies</h1>

      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add Movie
        </button>
      )}

      {showForm && (
        <NewMovieForm
          onSuccess={() => {
            setShowForm(false);
            fetchMovies(pageSize, pageNum, []).then((data) =>
              setMovies(data.movies)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingMovie && (
        <EditMovieForm
          movie={editingMovie}
          onSuccess={() => {
            fetchMovies(pageSize, pageNum, []).then((data) =>
              setMovies(data.movies)
            );
          }}
          onCancel={() => setEditingMovie(null)}
        />
      )}

      <table className="table table-bordered table-striped w-full text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Director</th>
            <th>Country</th>
            <th>Release Year</th>
            <th>Rating</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((m) => {
            return (
              <tr key={m.movieId}>
                <td>{m.movieId}</td>
                <td>{m.title}</td>
                <td>{m.director}</td>
                <td>{m.country}</td>
                <td>{m.release_year ?? 'N/A'}</td>
                <td>{m.rating}</td>
                <td>{m.duration}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm w-full mb-1"
                    onClick={() => setEditingMovie(m)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm w-full"
                    onClick={() => handleDelete(m.movieId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
  </>
  );
};

export default AdminPage;
