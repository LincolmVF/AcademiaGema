import React, { useState } from 'react';
import { Plus, Search, Trophy, Edit3, Trash2, BarChart3, ChevronRight } from 'lucide-react';
import AdminLevels from './AdminLevels';

const AdminLevelsManager = () => {
    const [view, setView] = useState('list');
    const [niveles, setNiveles] = useState([
        { id: 1, nombre: 'BÁSICO INICIAL', precio: 150.00 },
        { id: 2, nombre: 'INTERMEDIO AVANZADO', precio: 200.00 },
        { id: 3, nombre: 'ALTA COMPETENCIA', precio: 350.00 },
    ]);

    if (view === 'create') {
        return <AdminLevels onBack={() => setView('list')} />;
    }

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            {/* Header del Panel */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-1 bg-orange-500 rounded-full"></div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                            Niveles de <span className="text-[#1e3a8a]">Entrenamiento</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Categoriza las clases según la exigencia académica.</p>
                </div>

                <button
                    onClick={() => setView('create')}
                    className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    Nuevo Nivel
                </button>
            </div>

            {/* Buscador */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1e3a8a]" size={18} />
                <input
                    type="text"
                    placeholder="BUSCAR NIVEL..."
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                />
            </div>

            {/* Grid de Niveles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {niveles.map((nivel) => (
                    <div key={nivel.id} className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl hover:border-blue-100 transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-blue-50 text-[#1e3a8a] rounded-2xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all">
                                <Trophy size={24} />
                            </div>
                            <div className="flex gap-1">
                                <button className="p-2 text-slate-300 hover:text-[#1e3a8a] transition-colors"><Edit3 size={16} /></button>
                                <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <h3 className="font-black text-slate-800 text-lg uppercase italic leading-tight mb-4 group-hover:text-[#1e3a8a] transition-colors">
                            {nivel.nombre}
                        </h3>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase block tracking-tighter">Precio Ref.</span>
                                <span className="text-md font-black text-green-600">S/ {nivel.precio.toFixed(2)}</span>
                            </div>
                            <button className="flex items-center gap-1 bg-slate-50 text-slate-400 p-2 rounded-lg hover:bg-orange-500 hover:text-white transition-all group/btn">
                                <ChevronRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminLevelsManager;