const API_URL = import.meta.env.VITE_API_URL;

export const loginService = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Error en el servidor');
  }

  localStorage.setItem('userRole', result.data.rol);
  
  return result.data;
};

export const logoutService = async () => {
  try {
    await fetch(`${API_URL}/auth/logout`, { 
      method: 'POST',
      credentials: 'include' 
    });
  } catch (error) {
    console.error("Error en la petición de logout:", error);
  } finally {
    localStorage.clear();
    sessionStorage.clear();

    window.location.href = '/login';
  }
};