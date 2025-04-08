import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/api';

function Logout(props: { children: React.ReactNode }) {
  const navigate = useNavigate();

  
const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  try {
    const success = await logoutUser();
    if (success) {
      navigate('/');
    } else {
      console.error('Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};


  return (
    <a className="logout" href="#" onClick={handleLogout}>
      {props.children}
    </a>
  );
}

export default Logout;
