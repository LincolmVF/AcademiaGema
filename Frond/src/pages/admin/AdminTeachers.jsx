import React from 'react';
import { Plus, Phone, Mail, MoreVertical, GraduationCap } from 'lucide-react';
import { teachersList } from '../../data/mockAdmin';

const AdminTeachers = () => {
    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            {/* Header y Acción Principal */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-1 bg-orange-500 rounded-full"></div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                            Equipo <span className="text-[#1e3a8a]">Docente</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Gestiona el personal académico y sus especialidades.</p>
                </div>

                <button className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-900/20 group">
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    Registrar Profe
                </button>
            </div>

            {/* Grid de Profesores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachersList.map((teacher) => (
                    <div key={teacher.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all relative group">
                        {/* Menú de opciones */}
                        <button className="absolute top-4 right-4 text-slate-300 hover:text-orange-500 transition-colors">
                            <MoreVertical size={20} />
                        </button>

                        <div className="flex items-start gap-4 mb-6">
                            {/* Avatar con estilo Gema */}
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-slate-100 rounded-2xl flex items-center justify-center text-[#1e3a8a] border border-blue-100 font-black text-2xl shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    {teacher.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-sm border-2 border-white">
                                    <GraduationCap size={12} />
                                </div>
                            </div>

                            <div>
                                <h3 className="font-black text-slate-900 leading-tight group-hover:text-blue-700 transition-colors uppercase italic tracking-tighter">
                                    {teacher.name}
                                </h3>
                                <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mt-1">
                                    {teacher.speciality}
                                </p>
                            </div>
                        </div>

                        {/* Datos de contacto */}
                        <div className="space-y-3 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">
                                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                    <Phone size={14} className="text-blue-600" />
                                </div>
                                <span className="font-medium">{teacher.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">
                                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                    <Mail size={14} className="text-blue-600" />
                                </div>
                                <span className="font-medium text-xs">docente@gema.edu.pe</span>
                            </div>
                        </div>

                        {/* Botón de Perfil Rápido */}
                        <button className="w-full mt-6 py-2 rounded-xl border border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all">
                            Ver Expediente
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminTeachers;