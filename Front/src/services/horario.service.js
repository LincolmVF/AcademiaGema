import apiFetch from "../interceptors/api";

const horarioService = {
    // Obtener todos los horarios base del club
    obtenerDisponibles: async () => {
        const response = await apiFetch.get('/horarios');
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Error al obtener horarios");
        return result.data;
    }
};

export default horarioService;