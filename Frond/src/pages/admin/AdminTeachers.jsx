import React from 'react';
import { Plus, Phone, Mail, MoreVertical } from 'lucide-react';
import { teachersList } from '../../data/mockAdmin';

const AdminTeachers = () => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Equipo Docente</h1>
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg">
                    <Plus size={20} /> Registrar Profe
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachersList.map((teacher) => (
                    <div key={teacher.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
                        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <MoreVertical size={20} />
                        </button>
                        
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-4">
                            {teacher.name.charAt(6)}
                        </div>
                        
                        <h3 className="font-bold text-lg text-slate-900">{teacher.name}</h3>
                        <p className="text-slate-500 text-sm mb-4">{teacher.speciality}</p>
                        
                        <div className="space-y-2 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone size={16} className="text-slate-400" />
                                {teacher.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Mail size={16} className="text-slate-400" />
                                docente@academia.pe
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminTeachers;