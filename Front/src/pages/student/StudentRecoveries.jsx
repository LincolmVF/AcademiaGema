import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
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

const StudentRecoveries = () => {
    const { userId } = useAuth();
    const [loading, setLoading] = useState(true);

    // Data
    const [tickets, setTickets] = useState([]);
    const [horariosPatron, setHorariosPatron] = useState([]);

    // Interacción
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);

    // 1. Cargar datos iniciales
    const loadData = async () => {
        try {
            setLoading(true);
            const [ticketsData, horariosData] = await Promise.all([
                recuperacionService.obtenerPendientes(),
                horarioService.obtenerDisponibles()
            ]);
            setTickets(ticketsData);
            setHorariosPatron(horariosData);
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
            const slots = generarClasesDisponibles(horariosPatron, 3);
            setAvailableSlots(slots);
            toast.success("Horarios disponibles cargados 👇", { id: 'slots-loaded' });
        } else {
            setAvailableSlots([]);
        }
    }, [selectedTicket, horariosPatron]);

    // 3. Manejar el canje
    const handleSlotClick = async (slot) => {
        if (!selectedTicket) return;

        if (!window.confirm(`¿Confirmas recuperar tu clase el ${new Date(slot.fecha).toLocaleDateString()} a las ${slot.horarioData.hora_inicio}?`)) {
            return;
        }

        try {
            const promise = recuperacionService.agendar({
                alumnoId: userId,
                fechaFalta: selectedTicket.fecha_falta,
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

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
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

            {/* Sección 1: Tus Tickets */}
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
    );
};

export default StudentRecoveries;