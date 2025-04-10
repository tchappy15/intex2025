import React, { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';
import { pingAuth } from '../api/api';

interface User {
  email: string,
  roles: string[];
}

export const UserContext = createContext<User | null>(null);

function AuthorizeView(props: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>({ email: '', roles: [] });

  useEffect(() => {
    async function fetchAuthUser() {
      try {
        const data = await pingAuth();
        if (data.email) {
          setUser({ email: data.email, roles: data.roles });
          setAuthorized(true);
        } else {
          throw new Error('Invalid user session');
        }
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    fetchAuthUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (authorized) {
    return (
      <UserContext.Provider value={user}>
        {props.children}
      </UserContext.Provider>
    );
  }

  return <Navigate to="/login" />;
}

export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);
  if (!user) return null;

  return props.value === 'email' ? <>{user.email}</> : null;
}

export default AuthorizeView;
