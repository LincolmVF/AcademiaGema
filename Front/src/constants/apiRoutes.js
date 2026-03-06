export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        COMPLETAR_EMAIL: '/auth/completar-email',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },
    ROLES: {
        BASE: '/roles',
    },
    HORARIOS: {
        BASE: '/horarios',
        ACTIVOS: '/horarios', 
        BY_ID: (id) => `/horarios/${id}`,
    },
    USUARIOS: {
        BASE: '/usuarios',
        PROFESORES: '/usuarios/role/profesor',
        COORDINADORES: '/usuarios/role/coordinador',
        ALUMNOS: '/usuarios/role/alumno',
        ALUMNO_BY_ID: (id) => `/usuarios/${id}`,
        STATS: '/usuarios/count/usuarios-stats',
        REPORTE: '/usuarios/reporte/detallado',
        REGISTER: '/usuarios/register',
    },
    INSCRIPCIONES: {
        BASE: '/inscripciones',
    },
    PAGOS: {
        BASE: '/pagos',
        ALUMNO_HISTORIAL: (id) => `/pagos/alumno/${id}`,
        REPORTAR: '/pagos/reportar',
        VALIDAR: '/pagos/validar',
    },
    SEDES: {
        BASE: '/sedes',
        ACTIVOS: '/sedes/activas',
        BY_ID: (id) => `/sedes/${id}`,
    },
    RECUPERACIONES: {
        BASE: '/recuperaciones',
        HISTORIAL: '/recuperaciones/historial',
        ALUMNO_HISTORIAL: (id) => `/recuperaciones/alumno/${id}`,
    },
    CANCHAS: {
        BASE: '/canchas',
        ACTIVAS: '/canchas/activas',
    },
    NIVELES: {
        BASE: '/niveles',
        ACTIVOS: '/niveles',
        BY_ID: (id) => `/niveles/${id}`,
    },
    TIPOS_BENEFICIO: {
        BASE: '/tipos-beneficio',
        BY_ID: (id) => `/tipos-beneficio/${id}`,
    },
    DESCUENTOS: {
        APLICAR: '/descuentos/aplicar',
    },
    ASISTENCIAS: {
        BASE: '/asistencias',
        ALUMNO_HISTORIAL: (id) => `/asistencias/alumno/${id}`,
    },
    CUENTAS_POR_COBRAR: {
        BASE: '/cuentas-por-cobrar',
        HISTORIAL: (id) => `/cuentas-por-cobrar/historial/${id}`,
    },
    CLASES: {
        BASE: '/clases',
    },
    CATALOGO: {
        BASE: '/catalogo',
        ACTIVOS: '/catalogo/activos',
        BY_ID: (id) => `/catalogo/${id}`,
    },
    PARAMETROS: {
        BASE: '/parametros',
        BY_ID: (id) => `/parametros/${id}`,
    },
    CLOUDINARY: {
        BASE: '/cloudinary',
    },
    LESIONES: {
        BASE: '/lesiones',
        ALUMNO: (id) => `/lesiones/alumno/${id}`,
    },
    TIPOS_DOCUMENTO: {
        BASE: '/tipos-documento',
    },
    BENEFICIOS_PENDIENTES: {
        BASE: '/beneficioPendiente',
    },
    ALUMNOS: {
        BASE: '/alumnos',
        MI_PERFIL: '/alumno/mi-perfil',
    },
    PUBLICACIONES: {
        BASE: '/publicaciones',
        BY_ID: (id) => `/publicaciones/${id}`,
    },
    NOTIFICACIONES: {
        BASE: '/notificaciones',
        MARCAR_LEIDA: (id) => `/notificaciones/${id}/leer`,
    },
};
