import apiFetch from "../interceptors/api";

const alumnoService = {
  getById: async (id) => {
    const response = await apiFetch.get(`/usuarios/${id}`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Error al obtener alumno");
    }
    return result.data || result;
  },

  update: async (id, payload) => {
    const response = await apiFetch.put(`/usuarios/${id}`, payload);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Error al actualizar alumno");
    }
    return result.data || result;
  },
};

export default alumnoService;
