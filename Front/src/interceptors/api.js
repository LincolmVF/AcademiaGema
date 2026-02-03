import toast from 'react-hot-toast';

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
      toast.error("Tu sesión ha expirado", { id: 'session-expired' });
      window.location.href = '/login';
    }
  }

  return response;
};

// --- SOPORTE PARA MÉTODOS HTTP ---
apiFetch.get = (endpoint, options = {}) =>
  apiFetch(endpoint, { ...options, method: 'GET' });

apiFetch.post = (endpoint, body, options = {}) =>
  apiFetch(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined
  });

apiFetch.put = (endpoint, body, options = {}) =>
  apiFetch(endpoint, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined
  });

apiFetch.delete = (endpoint, options = {}) =>
  apiFetch(endpoint, { ...options, method: 'DELETE' });

export default apiFetch;