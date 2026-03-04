import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const apiFetch = async (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const defaultOptions = {
    ...options,
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  };

  let response = await fetch(`${API_URL}${endpoint}`, defaultOptions);

  // Excluimos las rutas de auth y refresh para prevenir loops infinitos
  if (response.status === 401 && !endpoint.includes('/auth/')) {
    if (isRefreshing) {
      // Si ya se está refrescando, pausamos esta petición y la encolamos
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        // Al resolverse, reintentamos la lectura al mismo endpoint original
        return fetch(`${API_URL}${endpoint}`, defaultOptions);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    isRefreshing = true;

    try {
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      });

      if (refreshRes.ok) {
        // ¡Tokens renovados vía cookies HTTP-only exitosamente!
        processQueue(null, true);
        // Reintentamos inmediatamente la petición que gatilló el error
        response = await fetch(`${API_URL}${endpoint}`, defaultOptions);
      } else {
        processQueue(new Error('Refresh auth cookie failed'), null);
        throw new Error('No se pudo refrescar credenciales automáticas');
      }
    } catch (error) {
      // Refresh token expirado o robado. Cierre de sesión inminente.
      Cookies.remove('user_role');
      Cookies.remove('user_name');
      Cookies.remove('user_id');
      Cookies.remove('auth_token'); // Si siguen existiendo frontend-side
      Cookies.remove('refresh_token');
      Cookies.remove('last_viewed_news');
      toast.error("Tu sesión ha expirado", { id: 'session-expired' });
      window.location.href = '/login';
    } finally {
      isRefreshing = false;
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
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined
  });

apiFetch.put = (endpoint, body, options = {}) =>
  apiFetch(endpoint, {
    ...options,
    method: 'PUT',
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined
  });

apiFetch.delete = (endpoint, options = {}) =>
  apiFetch(endpoint, { ...options, method: 'DELETE' });

apiFetch.patch = (endpoint, body, options = {}) =>
  apiFetch(endpoint, {
    ...options,
    method: 'PATCH',
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined
  });

export default apiFetch;
