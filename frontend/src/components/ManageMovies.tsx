import { useNavigate } from 'react-router-dom';

const ManageMovies = () => {
  const navigate = useNavigate();


  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '20px',
        background: '#f8f9fa',
        padding: '10px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        fontSize: '16px',
      }}
      onClick={() => navigate('/admin')}
    >
    <strong>Manage Movies</strong>
    </div>
  );
};

export default ManageMovies;
