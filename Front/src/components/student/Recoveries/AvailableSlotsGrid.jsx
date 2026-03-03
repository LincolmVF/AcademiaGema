import React from 'react';
import { Clock, MapPin, User, Star, CalendarPlus, Search } from 'lucide-react';

const AvailableSlotsGrid = ({ slots, onSlotClick, loading }) => {
    const diasSemana = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-black uppercase text-xs tracking-widest italic">Buscando horarios...</p>
        </div>
    );

    if (!slots || slots.length === 0) return (
        <div className="text-center py-16 px-6 bg-white border-2 border-dashed border-slate-200 rounded-[2rem]">
            <Search size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 font-bold italic">Selecciona un ticket arriba para ver los horarios disponibles.</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {slots.map((slot) => {
                const horario = slot.horarioData;
                const fechaObj = new Date(slot.fecha);
                const coordinatorName = horario.coordinadores?.usuarios?.nombres || "Coach Gema";
                const horaInicio = horario.hora_inicio.substring(0, 5);

                return (
                    <button
                        key={slot.id}
                        onClick={() => onSlotClick(slot)}
                        className="group relative bg-white border-2 border-slate-100 hover:border-orange-500 rounded-[2rem] p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10"
                    >
                        {/* Header Tarjeta */}
                        <div className="flex items-start justify-between mb-5">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-[#1e3a8a] text-white font-black shadow-lg shadow-blue-900/20 group-hover:bg-orange-500 group-hover:shadow-orange-500/30 transition-colors">
                                    <span className="text-[9px] opacity-80 uppercase tracking-tighter">{diasSemana[fechaObj.getDay()]}</span>
                                    <span className="text-2xl leading-none italic">{fechaObj.getDate()}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5 text-[#1e3a8a] font-black text-base italic uppercase tracking-tighter">
                                        <Clock size={16} className="text-orange-500" /> {horaInicio}
                                    </div>
                                    <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-black flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        Disponible
                                    </span>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-xl text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-all">
                                <CalendarPlus size={22} />
                            </div>
                        </div>

                        {/* Detalles */}
                        <div className="space-y-3 border-t border-slate-50 pt-4">
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                    <MapPin size={14} />
                                </div>
                                <span className="uppercase font-black text-[10px] tracking-[0.1em] italic">{horario.canchas?.nombre}</span>
                            </div>

                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                    <Star size={14} fill="currentColor" />
                                </div>
                                <span className="uppercase font-black text-[10px] tracking-[0.1em] italic">{horario.niveles_entrenamiento?.nombre}</span>
                            </div>

                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                    <User size={14} />
                                </div>
                                <span className="uppercase font-black text-[10px] tracking-[0.1em] italic">{coordinatorName}</span>
                            </div>
                        </div>

                        {/* Decoración sutil al hacer hover */}
                        <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest">Reservar →</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default AvailableSlotsGrid;