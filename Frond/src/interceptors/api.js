const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
  const defaultOptions = {
    ...options,
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  let response = await fetch(`${API_URL}${endpoint}`, defaultOptions);

  if (response.status === 401) {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, { 
      method: 'POST', 
      credentials: 'include' 
    });

    if (refreshRes.ok) {
      response = await fetch(`${API_URL}${endpoint}`, defaultOptions);
    } else {
      localStorage.clear();
      window.location.href = '/login';
    }
  }

  return response;
};