import Cookies from 'js-cookie';
import { API_ROUTES } from '../constants/apiRoutes';

const API_URL = import.meta.env.VITE_API_URL;

const cookieConfig = {
  expires: 1,
  secure: window.location.protocol === 'https:',
  sameSite: 'strict'
};

export const loginService = async (identifier, password) => {
  const payload = { username: identifier, password };

  const response = await fetch(`${API_URL}${API_ROUTES.AUTH.LOGIN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Error en el servidor");

  if (result.data) {
    const { user, accessToken, refreshToken } = result.data;
    if (user) {
      Cookies.set('user_role', user.rol, cookieConfig);
      Cookies.set('user_name', user.nombres, cookieConfig);
      Cookies.set('user_lastname', user.apellidos || '', cookieConfig);
      Cookies.set('user_id', user.id, cookieConfig);
    }
    if (accessToken) Cookies.set('auth_token', accessToken, cookieConfig);
    if (refreshToken) Cookies.set('refresh_token', refreshToken, cookieConfig);
  }

  return result.data;
};

export const logoutService = async () => {
  try {
    await fetch(`${API_URL}${API_ROUTES.AUTH.LOGOUT}`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Error en la petición de logout:", error);
  } finally {
    Cookies.remove('user_role');
    Cookies.remove('user_name');
    Cookies.remove('user_lastname');
    Cookies.remove('user_id');
    Cookies.remove('auth_token');
    Cookies.remove('refresh_token');

    // Limpieza de datos antiguos cacheados para evitar confusiones
    localStorage.removeItem('auth_sync');
    localStorage.removeItem('logout_sync');
    localStorage.removeItem('last_viewed_news');


    window.location.href = "/login";
  }
};

export const registerService = async (userData) => {
  const response = await fetch(`${API_URL}${API_ROUTES.USUARIOS.BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Error al registrar el usuario");
  }

  return result;
};

export const completarEmailService = async (nuevoEmail) => {
  const response = await fetch(`${API_URL}${API_ROUTES.AUTH.COMPLETAR_EMAIL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: nuevoEmail }),
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Error al actualizar el correo");
  }

  return result.data;
};