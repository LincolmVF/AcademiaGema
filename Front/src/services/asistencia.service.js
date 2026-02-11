// src/services/asistencia.service.js
import apiFetch from '../interceptors/api';

export const asistenciaService = {
    // Obtiene la agenda agrupada para el profesor logueado
    getAgendaHoy: async () => {
        const response = await apiFetch.get('/asistencias/agenda/hoy');
        if (!response.ok) throw new Error('Error al cargar la agenda');
        const result = await response.json();
        return result.data;
    },

    // Actualiza el estado de un alumno individual
    marcarAsistencia: async (asistenciaId, estado, comentario = "") => {
        const response = await apiFetch.patch(`/asistencias/${asistenciaId}`, {
            estado,
            comentario
        });
        if (!response.ok) throw new Error('Error al marcar asistencia');
        return await response.json();
    }
};