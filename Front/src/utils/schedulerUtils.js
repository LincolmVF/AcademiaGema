export const generarClasesDisponibles = (horariosPatron, semanasAVer = 2) => {
    const clasesGeneradas = [];
    const hoy = new Date();

    // Generamos clases para los próximos X días (semanasAVer * 7)
    for (let i = 1; i <= semanasAVer * 7; i++) {
        const fechaActual = new Date();
        fechaActual.setDate(hoy.getDate() + i); // Empezamos desde mañana
        const diaSemanaActual = fechaActual.getDay();

        // Filtramos los horarios que coinciden con este día de la semana
        const horariosDelDia = horariosPatron.filter(h => h.dia_semana === diaSemanaActual && h.activo);

        horariosDelDia.forEach(horario => {
            clasesGeneradas.push({
                id: `slot-${horario.id}-${fechaActual.getTime()}`,
                fecha: new Date(fechaActual.setHours(
                    parseInt(horario.hora_inicio.split(':')[0]),
                    parseInt(horario.hora_inicio.split(':')[1])
                )).toISOString(),
                horarioData: horario
            });
        });
    }

    // Ordenar por fecha
    return clasesGeneradas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
};