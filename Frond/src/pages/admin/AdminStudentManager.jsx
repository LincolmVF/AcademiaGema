import React, { useState } from 'react';
import { Search, User, Phone, ShieldAlert, ChevronRight, ArrowLeft, Heart, Mail, FileText } from 'lucide-react';

const AdminStudentsManager = () => {
    const [view, setView] = useState('list'); // 'list' o 'details'
    const [selectedAlumno, setSelectedAlumno] = useState(null);

    // Data simulada con información esencial
    const [alumnos] = useState([
        {
            id: 1,
            nombre: 'Paolo Guerrero',
            dni: '12345678',
            email: 'paolo.g@gmail.com',
            telefono: '987 654 321',
            salud: 'Apta',
            contacto_sos: 'Doña Peta',
            telf_sos: '912 345 678',
            condiciones: 'Ninguna',
            grupo_sangre: 'O+'
        },
        {
            id: 2,
            nombre: 'Gianluca Lapadula',
            dni: '87654321',
            email: 'lapagol@outlook.it',
            telefono: '911 222 333',
            salud: 'Observada',
            contacto_sos: 'Blanca Lapadula',
            telf_sos: '900 100 200',
            condiciones: 'Uso de máscara protectora por fractura nasal',
            grupo_sangre: 'A-'
        },
    ]);

    const handleViewDetails = (alumno) => {
        setSelectedAlumno(alumno);
        setView('details');
    };

    if (view === 'details' && selectedAlumno) {
        return (
            <div className="space-y-6 animate-fade-in-up p-1">
                {/* Header Expediente */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setView('list')}
                        className="group flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl hover:border-[#1e3a8a] transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="h-5 w-1 bg-orange-500 rounded-full"></div>
                            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                Expediente <span className="text-[#1e3a8a]">Académico</span>
                            </h1>
                        </div>
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wide ml-3">
                            Información de <span className="text-orange-500">{selectedAlumno.nombre}</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Info de contacto básica */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-[#1e3a8a] text-white rounded-2xl flex items-center justify-center font-black text-2xl uppercase italic">
                                    {selectedAlumno.nombre.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">{selectedAlumno.nombre}</h2>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{selectedAlumno.dni} | Alumno Activo</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Mail className="text-blue-500" size={18} />
                                    <span className="text-sm font-bold">{selectedAlumno.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Phone className="text-blue-500" size={18} />
                                    <span className="text-sm font-bold">{selectedAlumno.telefono}</span>
                                </div>
                            </div>
                        </div>

                        {/* Ficha Médica */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 bg-red-50/50 border-b border-slate-100 flex items-center gap-2">
                                <Heart className="text-red-500" size={18} />
                                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Información de Salud</span>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase">Condiciones Médicas:</span>
                                    <p className="text-sm font-bold text-slate-700">{selectedAlumno.condiciones}</p>
                                </div>
                                <div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase">Grupo Sanguíneo:</span>
                                    <p className="text-sm font-bold text-slate-700">{selectedAlumno.grupo_sangre}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Emergencias Lateral */}
                    <div className="bg-[#0f172a] p-6 rounded-3xl text-white shadow-xl">
                        <ShieldAlert className="text-orange-500 mb-4" size={32} />
                        <h4 className="font-black uppercase italic tracking-tighter text-lg mb-1">Contacto SOS</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-4 tracking-widest">Apoderado principal</p>

                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <span className="text-[9px] font-black text-orange-400 uppercase">Nombre</span>
                                <p className="text-sm font-bold">{selectedAlumno.contacto_sos}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <span className="text-[9px] font-black text-orange-400 uppercase">Teléfono</span>
                                <p className="text-sm font-bold">{selectedAlumno.telf_sos}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            {/* Header Lista */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-1 bg-orange-500 rounded-full"></div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                            Base de <span className="text-[#1e3a8a]">Alumnos</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Consulta y supervisa la información de los deportistas.</p>
                </div>
            </div>

            {/* Buscador */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1e3a8a]" size={18} />
                <input
                    type="text"
                    placeholder="BUSCAR POR NOMBRE O DNI..."
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                />
            </div>

            {/* Tabla de Alumnos */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alumno</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contacto</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {alumnos.map((alum) => (
                                <tr key={alum.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-100 text-[#1e3a8a] rounded-lg flex items-center justify-center font-black text-xs uppercase italic group-hover:bg-[#1e3a8a] group-hover:text-white transition-all">
                                                {alum.nombre.charAt(0)}
                                            </div>
                                            <span className="text-sm font-black text-slate-700 uppercase italic tracking-tighter">{alum.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs font-bold text-slate-500">{alum.dni}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Phone size={12} className="text-orange-500" />
                                            <span className="text-xs font-bold">{alum.telefono}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleViewDetails(alum)}
                                            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                                        >
                                            Ver Perfil
                                            <ChevronRight size={14} />
                                        </button>
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

export default AdminStudentsManager;