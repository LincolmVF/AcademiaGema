import { Users, GraduationCap, DollarSign, BookOpen, Calendar, Award } from 'lucide-react';

export const roleData = {
    admin: {
        stats: [
            { title: "Alumnos Activos", value: "1,234", icon: Users, color: "blue" },
            { title: "Ingresos Mes", value: "$12,450", icon: DollarSign, color: "green" },
            { title: "Entrenadores", value: "18", icon: GraduationCap, color: "orange" },
        ],
        recentTitle: "Últimas Inscripciones",
        activity: [
            { id: 1, text: "Juan Pérez se inscribió en Vóley Sub-12", date: "Hace 2 min" },
            { id: 2, text: "Pago recibido de María García", date: "Hace 15 min" },
            { id: 3, text: "Nuevo entrenador registrado: Carlos Ruiz", date: "Hace 1 hora" },
        ]
    },
    teacher: {
        title: "Portal del Entrenador",
        stats: [
            { title: "Mis Clases Hoy", value: "4", icon: BookOpen, color: "blue" },
            { title: "Alumnos a Cargo", value: "45", icon: Users, color: "orange" },
            { title: "Próximo Torneo", value: "12 Oct", icon: Award, color: "purple" },
        ],
        recentTitle: "Próximas Clases",
        activity: [
            { id: 1, text: "08:00 AM - Fundamentos Sub-16 (Cancha 1)", date: "En 30 min" },
            { id: 2, text: "10:00 AM - Selección Mayores (Gimnasio)", date: "Hoy" },
            { id: 3, text: "Revisión de asistencia pendiente", date: "Ayer" },
        ]
    },
    student: {
        title: "Mi Perfil de Alumno",
        stats: [
            { title: "Clases Asistidas", value: "24", icon: Calendar, color: "green" },
            { title: "Nivel Actual", value: "Intermedio", icon: Award, color: "blue" },
            { title: "Pagos Pendientes", value: "$0", icon: DollarSign, color: "gray" },
        ],
        recentTitle: "Mi Agenda",
        activity: [
            { id: 1, text: "Hoy 16:00 - Entrenamiento Técnico", date: "Confirmado" },
            { id: 2, text: "Mañana 09:00 - Partido Amistoso", date: "Pendiente" },
            { id: 3, text: "Pago de mensualidad Noviembre", date: "Completado" },
        ]
    }
};