import { useContext } from 'react';
import { UserContext } from '../components/AuthorizeView';
import AdminPage from '../pages/AdminPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

function AdminRoute() {
  const user = useContext(UserContext);

  if (user && user.roles.includes('Administrator')) {
    return <AdminPage />;
  }

  return <UnauthorizedPage />;
}

export default AdminRoute;
