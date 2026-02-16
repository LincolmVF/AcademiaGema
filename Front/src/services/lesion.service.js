import apiFetch from "../interceptors/api";

const lesionService = {
    // --- ALUMNO ---
    crearSolicitud: async (data) => {
        // data = { descripcion, urlEvidencia }
        const response = await apiFetch.post('/lesiones', data);
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Error al crear solicitud");
        return result.data;
    },

    obtenerMisSolicitudes: async () => {
        const response = await apiFetch.get('/lesiones/mis-solicitudes');
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Error al obtener historial");
        return result.data;
    },

    // --- ADMIN ---
    obtenerPendientes: async () => {
        const response = await apiFetch.get('/lesiones/pendientes');
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Error al obtener pendientes");
        return result.data;
    },

    evaluarSolicitud: async (id, data) => {
        // data = { estado, notas, tipo, fechaInicio, fechaFin }
        const response = await apiFetch.post(`/lesiones/${id}/evaluar`, data);
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Error al evaluar solicitud");
        return result.data;
    }
};

export default lesionService;