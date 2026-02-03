import React, { useState } from 'react';
import { Plus, Search, Clock, User, MapPin, Edit3, Trash2 } from 'lucide-react';
import AdminSchedule from './AdminSchedule';

const AdminSchedulesManager = () => {
    const [view, setView] = useState('list');
    const [horarios, setHorarios] = useState([
        {
            id: 1,
            dias: ['Lun', 'Mie', 'Vie'], // Lista de días
            hora: '16:00 - 17:30',
            profesor: 'Ricardo Gareca',
            nivel: 'Básico',
            cancha: 'Cancha 1 Surco',
            cupos: 20
        },
        {
            id: 2,
            dias: ['Mar', 'Jue'],
            hora: '18:00 - 19:30',
            profesor: 'Sergio Markarian',
            nivel: 'Pro',
            cancha: 'Cancha Principal',
            cupos: 15
        },
    ]);

    if (view === 'create') return <AdminSchedule onBack={() => setView('list')} />;

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            {/* Header del Panel */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-1 bg-orange-500 rounded-full"></div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Panel de <span className="text-[#1e3a8a]">Horarios</span></h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Cronograma de clases y asignación de canchas.</p>
                </div>

                <button onClick={() => setView('create')} className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg group">
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Programar Clase
                </button>
            </div>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {horarios.map((h) => (
                    <div key={h.id} className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl transition-all group relative">
                        <div className="flex justify-between items-start mb-4">
                            {/* Visualización de Múltiples Días */}
                            <div className="flex flex-wrap gap-1">
                                {h.dias.map(dia => (
                                    <span key={dia} className="px-2 py-1 bg-orange-100 text-orange-600 text-[9px] font-black rounded-lg uppercase">
                                        {dia}
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-1">
                                <button className="p-2 text-slate-300 hover:text-[#1e3a8a] transition-colors"><Edit3 size={16} /></button>
                                <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-50 text-[#1e3a8a] rounded-2xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all"><Clock size={20} /></div>
                            <div>
                                <h3 className="font-black text-slate-800 text-lg uppercase italic leading-tight">{h.hora}</h3>
                                <p className="text-[#1e3a8a] text-[10px] font-black uppercase tracking-widest">{h.nivel}</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-slate-500">
                                <User size={14} className="text-orange-500" />
                                <span className="text-[11px] font-bold uppercase">{h.profesor}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                                <MapPin size={14} className="text-orange-500" />
                                <span className="text-[11px] font-bold uppercase">{h.cancha}</span>
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between bg-slate-50 p-3 rounded-2xl">
                            <span className="text-[9px] font-black text-slate-400 uppercase">Cupos Máx.</span>
                            <span className="text-xs font-black text-slate-700">{h.cupos} Alumnos</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminSchedulesManager;