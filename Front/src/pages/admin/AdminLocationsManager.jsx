import React, { useState } from 'react';
import { Plus, MapPin, Building2, ChevronRight, Search, Edit3, Trash2, ArrowLeft } from 'lucide-react';
import AdminLocations from './AdminLocations';

const AdminLocationsManager = () => {
    const [view, setView] = useState('list');

    // Datos de ejemplo (Esto vendría de tu API /sedes)
    const [sedes, setSedes] = useState([
        { id: 1, nombre: 'Sede Principal Surco', distrito: 'Santiago de Surco', canchas: 4, estado: 'Activo' },
        { id: 2, nombre: 'Sede Miraflores', distrito: 'Miraflores', canchas: 2, estado: 'Activo' },
    ]);

    if (view === 'create') {
        return (
            <div className="space-y-6 animate-fade-in-up p-1">
                {/* Header Estilo Docente */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        {/* Botón Volver Estilo Gema */}
                        <button
                            onClick={() => setView('list')}
                            className="group flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all duration-300 shadow-sm"
                            title="Volver al listado"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </button>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-0.5">
                                <div className="h-5 w-1 bg-orange-500 rounded-full"></div>
                                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                    Registro de <span className="text-[#1e3a8a]">Sede</span>
                                </h1>
                            </div>
                            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wide ml-3">
                                Configura una <span className="text-orange-500">nueva ubicación</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* El Formulario de Sedes ya trae su propio botón de "Guardar" arriba a la derecha */}
                <AdminLocations onBack={() => setView('list')} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            {/* Header del Panel (Vista Lista) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-1 bg-orange-500 rounded-full"></div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                            Panel de <span className="text-[#1e3a8a]">Sedes</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Visualiza y gestiona las locaciones de la academia.</p>
                </div>

                <button
                    onClick={() => setView('create')}
                    className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-900/20 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    Agregar Nueva Sede
                </button>
            </div>

            {/* Buscador Rápido */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1e3a8a] transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="BUSCAR SEDE POR NOMBRE O DISTRITO..."
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                />
            </div>

            {/* Listado de Sedes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sedes.map((sede) => (
                    <div key={sede.id} className="bg-white rounded-3xl border border-slate-200 p-5 hover:shadow-xl hover:shadow-blue-900/5 transition-all group relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 text-slate-50 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                            <Building2 size={120} />
                        </div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-blue-50 text-[#1e3a8a] rounded-2xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                                <MapPin size={24} />
                            </div>
                            <span className="text-[10px] font-black bg-green-100 text-green-600 px-3 py-1 rounded-full uppercase">
                                {sede.estado}
                            </span>
                        </div>

                        <div className="relative z-10">
                            <h3 className="font-black text-slate-800 text-lg uppercase italic leading-tight mb-1 group-hover:text-[#1e3a8a] transition-colors">
                                {sede.nombre}
                            </h3>
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <MapPin size={12} className="text-orange-500" />
                                {sede.distrito}
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between relative z-10">
                            <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase block tracking-tighter">Capacidad</span>
                                <span className="text-sm font-black text-slate-700">{sede.canchas} Canchas</span>
                            </div>

                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-xl transition-all">
                                    <Edit3 size={18} />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <button className="w-full mt-4 bg-slate-50 group-hover:bg-orange-500 group-hover:text-white text-slate-600 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                            Ver Detalles
                            <ChevronRight size={14} />
                        </button>
                    </div>
                ))}

                <div
                    onClick={() => setView('create')}
                    className="border-2 border-dashed border-slate-200 rounded-3xl p-5 flex flex-col items-center justify-center gap-3 hover:border-[#1e3a8a] hover:bg-blue-50/50 cursor-pointer transition-all group"
                >
                    <div className="p-4 bg-slate-50 rounded-full text-slate-400 group-hover:bg-[#1e3a8a] group-hover:text-white transition-all">
                        <Plus size={32} />
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-[#1e3a8a]">Nueva Sede</span>
                </div>
            </div>
        </div>
    );
};

export default AdminLocationsManager;