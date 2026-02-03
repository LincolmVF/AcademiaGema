import React, { useState } from 'react';
import { Plus, Search, Tag, Edit3, Trash2, ChevronRight, PackageCheck } from 'lucide-react';
import AdminCatalog from './AdminCatalog';

const AdminCatalogManager = () => {
    const [view, setView] = useState('list');
    const [conceptos, setConceptos] = useState([
        { id: 1, nombre: 'MATRÍCULA ANUAL 2026', precio: 100.00, clases: 0, codigo: 'MAT26' },
        { id: 2, nombre: 'MENSUALIDAD 2 VECES/SEM', precio: 180.00, clases: 2, codigo: 'MS2' },
        { id: 3, nombre: 'MENSUALIDAD 3 VECES/SEM', precio: 250.00, clases: 3, codigo: 'MS3' },
    ]);

    if (view === 'create') {
        return <AdminCatalog onBack={() => setView('list')} />;
    }

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-1 bg-orange-500 rounded-full"></div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                            Catálogo de <span className="text-[#1e3a8a]">Conceptos</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Define los servicios y productos facturables.</p>
                </div>

                <button
                    onClick={() => setView('create')}
                    className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    Nuevo Concepto
                </button>
            </div>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1e3a8a]" size={18} />
                <input type="text" placeholder="BUSCAR POR NOMBRE O CÓDIGO..." className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {conceptos.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl hover:border-blue-100 transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all">
                                <Tag size={24} />
                            </div>
                            <div className="flex gap-1">
                                <button className="p-2 text-slate-300 hover:text-[#1e3a8a] transition-colors"><Edit3 size={16} /></button>
                                <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">
                                {item.codigo}
                            </span>
                            <h3 className="font-black text-slate-800 text-lg uppercase italic leading-tight mt-1 group-hover:text-[#1e3a8a] transition-colors">
                                {item.nombre}
                            </h3>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase block tracking-tighter">Costo Base</span>
                                <span className="text-md font-black text-green-600">S/ {item.precio.toFixed(2)}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[9px] font-black text-slate-400 uppercase block tracking-tighter">Frecuencia</span>
                                <span className="text-[10px] font-bold text-slate-600 uppercase">{item.clases > 0 ? `${item.clases} clases/sem` : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCatalogManager;