import React, { useState } from 'react';
import { Plus, Search, MapPin, Phone, GraduationCap, MoreVertical } from 'lucide-react';
import AdminTeachers from './AdminTeachers'; // Ahora es el formulario
import { teachersList } from '../../data/mockAdmin'; // Tu data dummy

const AdminTeachersManager = () => {
    const [view, setView] = useState('list');

    if (view === 'create') {
        return <AdminTeachers onBack={() => setView('list')} showTariff={true} />;
    }

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            {/* Header del Panel */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-1 bg-orange-500 rounded-full"></div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                            Panel <span className="text-[#1e3a8a]">Docente</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Gestiona el personal y sus especialidades.</p>
                </div>

                <button onClick={() => setView('create')} className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg group">
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    Registrar Profe
                </button>
            </div>

            {/* Buscador */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1e3a8a]" size={18} />
                <input type="text" placeholder="BUSCAR POR NOMBRE O ESPECIALIDAD..." className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
            </div>

            {/* Grid de Cards (Tu diseño original) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachersList.map((teacher) => (
                    <div key={teacher.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a8a] border border-blue-100 font-black text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                {teacher.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 uppercase italic tracking-tighter">{teacher.name}</h3>
                                <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mt-1">{teacher.speciality}</p>
                            </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Phone size={14} className="text-blue-600" />
                                <span className="font-bold">{teacher.phone}</span>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-2 rounded-xl border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 hover:text-orange-600 transition-all">
                            Ver Expediente
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminTeachersManager;