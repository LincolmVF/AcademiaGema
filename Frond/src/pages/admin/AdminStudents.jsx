import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { studentsList } from '../../data/mockAdmin';

const AdminStudents = () => {
    // Aquí podrías usar useState para manejar la lista real si conectaras un backend
    const [students] = useState(studentsList);

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header y Acciones */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestión de Alumnos</h1>
                    <p className="text-slate-500">Administra las inscripciones y estados.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-200">
                    <Plus size={20} /> Nuevo Alumno
                </button>
            </div>

            {/* Barra de Búsqueda */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre..." 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>

            {/* Tabla */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="p-4 font-bold">Nombre</th>
                            <th className="p-4 font-bold">Categoría</th>
                            <th className="p-4 font-bold">Estado</th>
                            <th className="p-4 font-bold">Pagos</th>
                            <th className="p-4 font-bold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-medium text-slate-900">{student.name}</td>
                                <td className="p-4 text-slate-600">{student.category}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        student.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`text-sm font-medium ${
                                        student.payment === 'Al día' ? 'text-green-600' : 'text-orange-500'
                                    }`}>
                                        {student.payment}
                                    </span>
                                </td>
                                <td className="p-4 flex justify-end gap-2">
                                    <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Edit size={18} /></button>
                                    <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminStudents;