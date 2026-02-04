import React, { useState } from 'react';
import { Search, Phone, ShieldAlert, ChevronRight, ArrowLeft, Heart, Mail, Calendar, User, Fingerprint, Activity, Info, FileText } from 'lucide-react';

const AdminStudentsManager = () => {
    const [view, setView] = useState('list');
    const [selectedAlumno, setSelectedAlumno] = useState(null);

    // Data simulada con la nueva estructura
    const [alumnos] = useState([
        {
            id: 1,
            nombres: "Carlos",
            apellidos: "Rodríguez",
            email: "alumno.nuevo@gema.com",
            tipo_documento_id: "DNI",
            numero_documento: "72345678",
            telefono_personal: "+51987654321",
            fecha_nacimiento: "2005-03-15",
            genero: "M",
            datosRolEspecifico: {
                condiciones_medicas: "Asma leve",
                seguro_medico: "Pacífico Seguros",
                grupo_sanguineo: "O+"
            }
        },
        {
            id: 2,
            nombres: "Gianluca",
            apellidos: "Lapadula",
            email: "lapagol@outlook.it",
            tipo_documento_id: "DNI",
            numero_documento: "87654321",
            telefono_personal: "911 222 333",
            fecha_nacimiento: "1990-02-07",
            genero: "M",
            datosRolEspecifico: {
                condiciones_medicas: "Uso de máscara protectora por fractura nasal",
                seguro_medico: "Rimac Seguros",
                grupo_sanguineo: "A-"
            }
        }
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
                            Perfil completo del <span className="text-orange-500">Deportista</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna Principal: Datos Personales */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Card: Perfil e Identidad */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-white rounded-3xl flex items-center justify-center font-black text-3xl uppercase italic shadow-lg shadow-blue-900/20">
                                        {selectedAlumno.nombres.charAt(0)}{selectedAlumno.apellidos.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">
                                                {selectedAlumno.nombres} {selectedAlumno.apellidos}
                                            </h2>
                                            <span className="bg-green-100 text-green-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-green-200">Activo</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Fingerprint size={16} className="text-blue-500" />
                                                <span className="text-xs font-bold uppercase">{selectedAlumno.tipo_documento_id}: {selectedAlumno.numero_documento}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar size={16} className="text-blue-500" />
                                                <span className="text-xs font-bold uppercase">Nacimiento: {selectedAlumno.fecha_nacimiento}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Grid de detalles secundarios */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Género</span>
                                        <div className="flex items-center gap-2 font-bold text-slate-700">
                                            <User size={14} className="text-slate-400" />
                                            <span>{selectedAlumno.genero === 'M' ? 'Masculino' : 'Femenino'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Corporativo</span>
                                        <div className="flex items-center gap-2 font-bold text-slate-700">
                                            <Mail size={14} className="text-slate-400" />
                                            <span className="text-sm lowercase">{selectedAlumno.email}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Teléfono</span>
                                        <div className="flex items-center gap-2 font-bold text-slate-700">
                                            <Phone size={14} className="text-slate-400" />
                                            <span>{selectedAlumno.telefono_personal}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card: Ficha Médica */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 bg-red-50/50 border-b border-red-100 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-red-600">
                                    <Heart size={20} fill="currentColor" className="opacity-80" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Protocolo de Salud Deportiva</span>
                                </div>
                                <Activity size={18} className="text-red-300" />
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <ShieldAlert size={16} className="text-red-500" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Condiciones / Alergias:</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-800 leading-relaxed">
                                        {selectedAlumno.datosRolEspecifico.condiciones_medicas}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-400 uppercase">Seguro Médico</span>
                                            <span className="text-sm font-black text-[#1e3a8a] uppercase italic">{selectedAlumno.datosRolEspecifico.seguro_medico}</span>
                                        </div>
                                        <Info size={16} className="text-slate-300" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-400 uppercase">Tipo de Sangre</span>
                                            <span className="text-sm font-black text-red-600">{selectedAlumno.datosRolEspecifico.grupo_sanguineo}</span>
                                        </div>
                                        <Heart size={16} className="text-red-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Lateral: Estado Académico */}
                    <div className="space-y-6">
                        <div className="bg-[#0f172a] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>

                            <h4 className="font-black uppercase italic tracking-tighter text-lg mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                                Resumen de Rol
                            </h4>

                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Rol del Sistema</span>
                                    <p className="text-sm font-bold uppercase italic">Alumno Aspirante</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Antigüedad</span>
                                    <p className="text-sm font-bold uppercase italic">Nuevo Ingreso (2024)</p>
                                </div>

                                <div className="pt-4">
                                    <button className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-orange-900/40 flex items-center justify-center gap-2">
                                        <FileText size={16} />
                                        Editar Expediente
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recordatorio de Privacidad */}
                        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                            <p className="text-[10px] text-blue-800 font-bold leading-relaxed uppercase tracking-tight">
                                <span className="text-blue-500">Nota:</span> Esta información es confidencial. El manejo de datos de salud está protegido por el reglamento interno de la academia.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // LIST VIEW (Sin cambios, solo actualizada para reflejar nombres/apellidos)
    return (
        <div className="space-y-6 animate-fade-in-up p-1">
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

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1e3a8a]" size={18} />
                <input
                    type="text"
                    placeholder="BUSCAR POR NOMBRE O DOCUMENTO..."
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                />
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alumno</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {alumnos.map((alum) => (
                                <tr key={alum.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-100 text-[#1e3a8a] rounded-lg flex items-center justify-center font-black text-xs uppercase italic group-hover:bg-[#1e3a8a] group-hover:text-white transition-all">
                                                {alum.nombres.charAt(0)}
                                            </div>
                                            <span className="text-sm font-black text-slate-700 uppercase italic tracking-tighter">{alum.nombres} {alum.apellidos}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs font-bold text-slate-500">{alum.numero_documento}</td>
                                    <td className="p-4 text-xs font-bold text-slate-500">{alum.telefono_personal}</td>
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