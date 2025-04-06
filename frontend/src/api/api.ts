const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Ping authorization status
export async function pingAuth() {
  const response = await fetch(`${API_BASE_URL}/pingauth`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Authorization failed');
  return await response.json();
}

// Get available container types
export async function fetchContainers() {
  const response = await fetch(`${API_BASE_URL}/Competition/GetContainerTypes`, {
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Failed to fetch containers');
  return await response.json();
}

// Get rootbeers with pagination and optional container filter
export async function fetchRootbeers(
  pageSize: number,
  pageNum: number,
  selectedContainers: string[]
) {
  const containerParams = selectedContainers
    .map((cont) => `containers=${encodeURIComponent(cont)}`)
    .join('&');

  const url = `${API_BASE_URL}/Competition/GetRootbeers?pageSize=${pageSize}&pageNum=${pageNum}${
    selectedContainers.length ? `&${containerParams}` : ''
  }`;

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Failed to fetch competition');
  return await response.json();
}

// Logout the user
export async function logoutUser() {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.ok;
}

// Login the user
export async function loginUser(email: string, password: string, remember: boolean) {
  const loginUrl = remember
    ? `${API_BASE_URL}/login?useCookies=true`
    : `${API_BASE_URL}/login?useSessionCookies=true`;

  const response = await fetch(loginUrl, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const contentLength = response.headers.get('content-length');
  const data = contentLength && parseInt(contentLength) > 0 ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || 'Invalid email or password.');
  }

  return data;
}

// Register a new user
export async function registerUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return response.ok;
}