import apiFetch from '../interceptors/api';

export const sedeService = {
    // Obtener todas las sedes con filtros
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await apiFetch.get(`/sedes?${query}`);
        return await response.json();
    },

    // Crear una nueva sede
    create: async (sedeData) => {
        const response = await apiFetch.post('/sedes', sedeData);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear sede');
        }
        return await response.json();
    },

    delete: async (id) => {
        const response = await apiFetch.delete(`/sedes/${id}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al eliminar la sede');
        }

        return response.status === 204 ? { success: true } : await response.json();
    },

    update: async (id, sedeData) => {
        const response = await apiFetch.put(`/sedes/${id}`, sedeData);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar la sede');
        }

        return await response.json();
    }
};