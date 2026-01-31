import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { studentsList } from '../../data/mockAdmin';

const AdminStudents = () => {
    // Estado para la lista (puedes filtrar basándote en esto)
    const [students] = useState(studentsList);

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            {/* Header y Acciones */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <p className="text-slate-500 text-sm font-medium">Control de inscripciones y estados financieros.</p>
                </div>

                <button className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-900/20 group">
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    Nuevo Alumno
                </button>
            </div>

            {/* Barra de Búsqueda y Filtros */}
            <div className="flex gap-3">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o DNI..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white shadow-sm"
                    />
                </div>
                <button className="bg-white border border-slate-200 p-3 rounded-xl text-slate-500 hover:text-orange-500 hover:border-orange-200 transition-all shadow-sm">
                    <Filter size={20} />
                </button>
            </div>

            {/* Tabla Estilo GemaAdmin */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc] border-b border-slate-200 text-[#1e3a8a] text-[11px] font-black uppercase tracking-[0.1em]">
                                <th className="p-4">Nombre Completo</th>
                                <th className="p-4">Categoría</th>
                                <th className="p-4 text-center">Estado</th>
                                <th className="p-4">Pagos</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-blue-50/40 transition-colors group">
                                    <td className="p-4 font-bold text-slate-700">{student.name}</td>
                                    <td className="p-4">
                                        <span className="text-slate-500 font-medium text-sm italic">
                                            {student.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${student.status === 'Activo'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className={`text-xs font-black flex items-center gap-1.5 ${student.payment === 'Al día' ? 'text-green-600' : 'text-orange-500'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${student.payment === 'Al día' ? 'bg-green-500' : 'bg-orange-500'
                                                }`}></div>
                                            {student.payment.toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-blue-600 hover:text-white text-[#1e3a8a] rounded-lg transition-all">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-red-500 hover:text-white text-red-400 rounded-lg transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminStudents;