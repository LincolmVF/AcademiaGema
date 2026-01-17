import React from 'react';
import { Plus, Calendar } from 'lucide-react';
import { schedulesList } from '../../data/mockAdmin';

const AdminSchedule = () => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Programación de Horarios</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200">
                    <Plus size={20} /> Nueva Clase
                </button>
            </div>

            {/* Lista simple de horarios */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                    <Calendar className="text-slate-400" />
                    <h3 className="font-bold text-slate-700">Clases Vigentes</h3>
                 </div>
                 <div className="divide-y divide-slate-100">
                    {schedulesList.map((item) => (
                        <div key={item.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex flex-col items-center justify-center font-bold text-xs leading-tight">
                                    <span>{item.day.substring(0,3).toUpperCase()}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{item.category}</h4>
                                    <p className="text-sm text-slate-500">{item.court}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                                    {item.time}
                                </span>
                                <button className="text-sm text-blue-600 hover:underline font-medium">Editar</button>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default AdminSchedule;