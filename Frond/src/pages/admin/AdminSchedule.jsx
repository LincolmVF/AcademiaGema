import React from 'react';
import { Plus, Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { schedulesList } from '../../data/mockAdmin';

const AdminSchedule = () => {
    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-1 bg-orange-500 rounded-full"></div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                            Programación <span className="text-[#1e3a8a]">de Horarios</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Gestiona los turnos y canchas de la academia.</p>
                </div>

                <button className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-900/20 group">
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    Nueva Clase
                </button>
            </div>

            {/* Contenedor de Horarios */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-[#f8fafc] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-[#1e3a8a] rounded-lg">
                            <Calendar size={20} />
                        </div>
                        <h3 className="font-black text-[#1e3a8a] uppercase tracking-wider text-sm">Clases Vigentes</h3>
                    </div>
                    <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-3 py-1 rounded-full uppercase">
                        Temporada 2026
                    </span>
                </div>

                <div className="divide-y divide-slate-100">
                    {schedulesList.map((item) => (
                        <div key={item.id} className="p-5 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-blue-50/30 transition-all group">
                            <div className="flex gap-6 items-center">
                                {/* Badge de Día con Estilo Gema */}
                                <div className="w-14 h-14 bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] text-white rounded-2xl flex flex-col items-center justify-center shadow-md group-hover:shadow-orange-200 group-hover:from-orange-500 group-hover:to-orange-600 transition-all duration-300">
                                    <span className="text-[10px] font-bold opacity-80 uppercase leading-none">Día</span>
                                    <span className="font-black text-lg leading-tight uppercase">
                                        {item.day.substring(0, 3)}
                                    </span>
                                </div>

                                <div>
                                    <h4 className="font-black text-slate-800 text-lg uppercase italic tracking-tighter group-hover:text-[#1e3a8a] transition-colors">
                                        {item.category}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase">
                                            <MapPin size={12} className="text-orange-500" />
                                            {item.court}
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase">
                                            <Clock size={12} className="text-blue-500" />
                                            {item.time}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4">
                                <div className="hidden sm:block">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-right">Estado</span>
                                    <span className="text-green-500 font-bold text-xs uppercase">Confirmado</span>
                                </div>
                                <button className="flex items-center gap-1 bg-slate-50 hover:bg-orange-500 hover:text-white text-slate-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all group/btn border border-slate-100 hover:border-orange-500 shadow-sm">
                                    Gestionar
                                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Informativo */}
            <div className="bg-orange-500/5 border border-orange-200 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                <p className="text-orange-700 text-xs font-bold uppercase tracking-wide">
                    Los cambios realizados en los horarios se notificarán automáticamente a los alumnos y profesores.
                </p>
            </div>
        </div>
    );
};

export default AdminSchedule;