import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;

const cookieConfig = {
  expires: 1,
  secure: window.location.protocol === 'https:',
  sameSite: 'strict'
};

export const loginService = async (identifier, password) => {
  const payload = { username: identifier, password };

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Error en el servidor");

  if (result.data) {
    Cookies.set('user_role', result.data.rol, cookieConfig);
    Cookies.set('user_name', result.data.nombres, cookieConfig);
    Cookies.set('user_id', result.data.id, cookieConfig);
    if (result.data.token) Cookies.set('auth_token', result.data.token, cookieConfig);
    if (result.data.refreshToken) Cookies.set('refresh_token', result.data.refreshToken, cookieConfig);
  }

  return result.data;
};

export const logoutService = async () => {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Error en la petición de logout:", error);
  } finally {
    Cookies.remove('user_role');
    Cookies.remove('user_name');
    Cookies.remove('user_id');
    Cookies.remove('auth_token');
    Cookies.remove('refresh_token');

    window.location.href = "/login";
  }
};

export const registerService = async (userData) => {
  const response = await fetch(`${API_URL}/usuarios/register`, {
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
  const response = await fetch(`${API_URL}/auth/completar-email`, {
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