import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, AlertCircle, CalendarPlus, History, Activity, ShieldPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

// Servicios y Utils
import recuperacionService from '../../services/recuperacion.service';
import horarioService from '../../services/horario.service';
import { generarClasesDisponibles } from '../../utils/schedulerUtils';

// Componentes
import RecoveryTicketList from '../../components/student/Recoveries/RecoveryTicketList';
import AvailableSlotsGrid from '../../components/student/Recoveries/AvailableSlotsGrid';
import RecoveryHistoryList from '../../components/student/Recoveries/RecoveryHistoryList';

const StudentRecoveries = () => {
    const { userId } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('agendar');

    // Data
    const [tickets, setTickets] = useState([]);
    const [horariosPatron, setHorariosPatron] = useState([]);
    const [historial, setHistorial] = useState([]);

    // Stats para detalle de recuperaciones del alumno
    const [stats, setStats] = useState({
        normalesUsadas: 0,
        normalesLimite: 2,
        lesionUsadas: 0
    });

    // Interacción
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);

    // 1. Cargar datos iniciales
    const loadData = async () => {
        try {
            setLoading(true);
            const [ticketsData, horariosData, historialData] = await Promise.all([
                recuperacionService.obtenerPendientes(),
                horarioService.obtenerDisponibles(),
                recuperacionService.obtenerHistorial()
            ]);
            setTickets(ticketsData);
            setHorariosPatron(horariosData);
            setHistorial(historialData);

            setStats(ticketsData.stats);

        } catch (error) {
            toast.error("Error cargando información de recuperaciones");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) loadData();
    }, [userId]);

    // 2. Cuando selecciono un ticket, calculo los horarios disponibles
    useEffect(() => {
        if (selectedTicket && horariosPatron.length > 0) {
            // Generamos clases para las próximas 3 semanas
            const rawSlots = generarClasesDisponibles(horariosPatron, 4);

            // Filtramos para quitar las que ya tiene ocupadas
            const slotsLimpios = rawSlots.filter(slot => {
                const slotDate = new Date(slot.fecha);
                // Buscamos si el alumno ya tiene algo agendado ('PROGRAMADA') en este mismo día y a esta misma hora
                const yaLoTieneOcupado = historial.some(ticket => {
                    if (ticket.estado !== 'PROGRAMADA') return false;

                    // Comparamos si las fechas y el horario coinciden
                    const mismaFecha = ticket.fecha_programada && new Date(ticket.fecha_programada).toLocaleDateString('es-ES', { timeZone: 'UTC' }) === slotDate.toLocaleDateString('es-ES', { timeZone: 'UTC' });
                    const mismoHorario = ticket.horario_destino_id === slot.horarioData.id;

                    return mismaFecha && mismoHorario;
                });

                //Verificamos ahora con el horario regular del alumno.
                let esHorarioRegularProtegido = false;

                // Si el ticket seleccionado NO es por lesión, aplicamos la regla de los 30 días
                if (stats.fin_ciclo_regular && stats.horarios_regulares) {
                    const finCicloDate = new Date(stats.fin_ciclo_regular);

                    // Si el slot que está viendo cae dentro de sus primeros 30 días
                    if (slotDate <= finCicloDate) {

                        // const indiceDiaSlot = (slotDate.getUTCDay() === 0) ? 7 : slotDate.getUTCDay();

                        // Comprobamos si el turno seleccionado corresponde con uno de sus horarios regulares.
                        esHorarioRegularProtegido = stats.horarios_regulares.includes(slot.horarioData.id);
                    }
                }


                // Si no lo tiene ocupado y no es parte de su horario regular, lo dejamos en la lista disponible
                return !yaLoTieneOcupado && !esHorarioRegularProtegido;
            });

            setAvailableSlots(slotsLimpios);
            toast.success("Horarios disponibles cargados 👇", { id: 'slots-loaded' });
        } else {
            setAvailableSlots([]);
        }
    }, [selectedTicket, horariosPatron, historial, stats]);

    // 3. Manejar el canje
    const handleSlotClick = async (slot) => {
        if (!selectedTicket) return;

        if (!window.confirm(`¿Confirmas recuperar tu clase el ${new Date(slot.fecha).toLocaleDateString()} a las ${slot.horarioData.hora_inicio}?`)) {
            return;
        }

        try {
            const promise = recuperacionService.agendar({
                alumnoId: userId,
                recuperacionId: selectedTicket.id,
                horarioDestinoId: slot.horarioData.id,
                fechaProgramada: slot.fecha
            });

            await toast.promise(promise, {
                loading: 'Procesando canje...',
                success: '¡Clase agendada exitosamente! 🎉',
                error: (err) => err.message
            });

            // Resetear y recargar
            setSelectedTicket(null);
            loadData();

        } catch (error) {
            console.error(error);
        }
    };

    // Manejar la cancelación
    const handleCancelRecovery = async (recuperacionId) => {
        if (!window.confirm("¿Estás seguro de cancelar esta recuperación? El ticket volverá a tus pendientes.")) {
            return;
        }

        try {
            const promise = recuperacionService.cancelar(recuperacionId);

            await toast.promise(promise, {
                loading: 'Cancelando recuperación...',
                success: 'Recuperación cancelada. Tienes un ticket pendiente de nuevo.',
                error: (err) => err.message
            });

            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    // Helper para saber si ya llegó al límite visualmente
    const alLimite = stats.recuperacion_usadas >= stats.limite_permitido;

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
            <Link to="/dashboard/student" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#1e3a8a] transition-all mb-4 text-[10px] font-black uppercase tracking-widest italic">
                <ArrowLeft size={14} /> Volver
            </Link>
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl md:text-4xl font-black text-[#1e3a8a] italic uppercase tracking-tighter">
                            Centro de <span className="text-orange-500">Recuperación</span>
                        </h1>
                    </div>
                    <button onClick={loadData} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors">
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Tarjetas de Estadísticas del Ciclo Actual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Tarjeta Normales */}
                <div className={`p-5 rounded-3xl border flex items-center justify-between ${alLimite ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${alLimite ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recuperaciones Normales</p>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-2xl font-black ${alLimite ? 'text-orange-600' : 'text-slate-800'}`}>
                                    {stats.recuperacion_usadas}
                                </span>
                                <span className="text-sm font-bold text-slate-400">/ {stats.limite_permitido} usadas</span>
                            </div>
                        </div>
                    </div>
                    {alLimite && (
                        <span className="text-[10px] font-bold bg-orange-200 text-orange-700 px-3 py-1 rounded-full uppercase">Límite Alcanzado</span>
                    )}
                </div>

                {/* Tarjeta Lesiones */}
                <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-3xl flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                        <ShieldPlus size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recuperaciones por Lesión</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm font-bold text-emerald-500 uppercase text-[10px]">Sin límite</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="flex gap-4 mb-8 border-b border-gray-200 pb-px">
                <button
                    onClick={() => setActiveTab('agendar')}
                    className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${activeTab === 'agendar'
                        ? 'border-[#1e3a8a] text-[#1e3a8a]'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <CalendarPlus size={18} /> Agendar Clase
                </button>
                <button
                    onClick={() => setActiveTab('historial')}
                    className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${activeTab === 'historial'
                        ? 'border-[#1e3a8a] text-[#1e3a8a]'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <History size={18} /> Mi Historial
                </button>
            </div>

            {/* Sección 1: Tus Tickets */}
            {activeTab === 'agendar' ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-10">
                        <h3 className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                            1. Selecciona una falta pendiente
                        </h3>
                        <RecoveryTicketList
                            tickets={tickets}
                            selectedTicket={selectedTicket}
                            onSelect={setSelectedTicket}
                        />
                    </div>

                    {/* Sección 2: Calendario de Disponibilidad */}
                    {selectedTicket && (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                            <div className="flex items-center justify-between mb-4 border-t border-white/10 pt-8">
                                <h3 className="text-emerald-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                    2. Elige tu nueva clase
                                </h3>
                                <div className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-500 text-[10px] font-bold">
                                    Mostrando clases disponibles próximas
                                </div>
                            </div>

                            <AvailableSlotsGrid
                                slots={availableSlots}
                                onSlotClick={handleSlotClick}
                                loading={false}
                            />
                        </div>
                    )}

                    {!selectedTicket && tickets.length > 0 && (
                        <div className="mt-8 p-6 rounded-2xl border border-dashed border-white/10 text-center text-gray-500">
                            <AlertCircle className="mx-auto mb-2 opacity-50" />
                            Selecciona un ticket arriba para ver dónde puedes recuperar.
                        </div>
                    )}
                </div>
            ) : (
                < div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <RecoveryHistoryList
                        historial={historial}
                        onCancel={handleCancelRecovery}
                    />
                </div>
            )}
        </div>
    );
};

export default StudentRecoveries;