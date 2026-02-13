const API_URL = import.meta.env.VITE_API_URL;

export const loginService = async (identifier, password) => {
  const payload = {
    username: identifier,
    password,
  };

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Error en el servidor");
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
    localStorage.clear();
    sessionStorage.clear();

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
