import apiFetch from "../interceptors/api";

const recuperacionService = {
    // Obtener tickets pendientes (Normales y Lesión)
    obtenerPendientes: async () => {
        const response = await apiFetch.get('/recuperaciones/pendientes');
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Error al obtener recuperaciones");
        return result.data;
    },

    // Canjear el ticket
    agendar: async (data) => {
        // data = { alumnoId, fechaFalta, horarioDestinoId, fechaProgramada }
        const response = await apiFetch.post('/recuperaciones/agendar-recuperacion', data);
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Error al agendar");
        return result.data;
    },

    cancelar: async (recuperacionId) => {
        const response = await apiFetch.post(`/recuperaciones/cancelar-recuperacion/${recuperacionId}`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Error al cancelar recuperación");
        return result.data;
    },

    obtenerHistorial: async () => {
        const response = await apiFetch.get('/recuperaciones/historial');
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Error al obtener historial");
        return result.data;
    },
};

export default recuperacionService;