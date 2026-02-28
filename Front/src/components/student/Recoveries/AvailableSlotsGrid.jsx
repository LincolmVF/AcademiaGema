import React from 'react';
import { Clock, MapPin, User, Star, CalendarPlus } from 'lucide-react';

const AvailableSlotsGrid = ({ slots, onSlotClick, loading }) => {
    const diasSemana = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];

    if (loading) return <div className="text-center py-10 text-white">Buscando horarios disponibles...</div>;

    if (!slots || slots.length === 0) return (
        <div className="text-center py-10 text-gray-400 bg-white/5 rounded-2xl">
            Selecciona un ticket arriba para ver los horarios disponibles.
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in slide-in-from-bottom-4">
            {slots.map((slot) => {
                const horario = slot.horarioData;
                const fechaObj = new Date(slot.fecha);
                const coordinatorName = horario.coordinadores?.usuarios?.nombres || "Coordinator Gema";
                const horaInicio = horario.hora_inicio.substring(0, 5);

                return (
                    <button
                        key={slot.id}
                        onClick={() => onSlotClick(slot)}
                        className="group relative bg-[#1e293b]/80 hover:bg-emerald-900/20 border border-white/10 hover:border-emerald-500/50 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/20"
                    >
                        {/* Header Tarjeta */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-emerald-600 text-white font-black shadow-lg">
                                    <span className="text-[8px] opacity-80 uppercase">{diasSemana[fechaObj.getDay()]}</span>
                                    <span className="text-xl leading-none">{fechaObj.getDate()}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 text-emerald-400 font-black text-sm">
                                        <Clock size={14} /> {horaInicio}
                                    </div>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Disponible</span>
                                </div>
                            </div>
                            <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <CalendarPlus size={20} />
                            </div>
                        </div>

                        {/* Detalles */}
                        <div className="space-y-2 border-t border-white/5 pt-3">
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                <MapPin size={14} className="text-blue-400" />
                                <span className="uppercase font-bold text-[10px] tracking-wide">{horario.canchas?.nombre}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                <Star size={14} className="text-yellow-500" />
                                <span className="uppercase font-bold text-[10px] tracking-wide">{horario.niveles_entrenamiento?.nombre}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                <User size={14} className="text-indigo-400" />
                                <span className="uppercase font-bold text-[10px] tracking-wide">{coordinatorName}</span>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default AvailableSlotsGrid;