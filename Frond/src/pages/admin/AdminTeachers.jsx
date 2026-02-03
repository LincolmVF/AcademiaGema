import React, { useState } from 'react';
import { Save, User, Mail, GraduationCap, Phone, ArrowLeft, Lock, ShieldCheck } from 'lucide-react';

const AdminTeachers = ({ onBack }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        telefono_personal: '',
        tipo_documento_id: 'DNI',
        numero_documento: '',
        especializacion: '',
        genero: '',
        fecha_nacimiento: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.numero_documento) {
            alert("El número de documento es obligatorio para generar la contraseña.");
            return;
        }

        setLoading(true);

        const payload = {
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            email: formData.email,
            telefono_personal: formData.telefono_personal,
            tipo_documento_id: formData.tipo_documento_id,
            numero_documento: formData.numero_documento,
            genero: formData.genero === "Masculino" ? "M" : "F",
            fecha_nacimiento: formData.fecha_nacimiento ? new Date(formData.fecha_nacimiento).toISOString() : null,
            rol_id: 3,
            profesores: {
                create: {
                    especializacion: formData.especializacion
                }
            },
            credenciales_usuario: {
                create: {
                    hash_contrasena: formData.numero_documento // Contraseña por default
                }
            }
        };

        console.log("Payload enviado:", payload);

        setTimeout(() => {
            setLoading(false);
            onBack(); // Regresa a la lista
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-fade-in-up p-1">
            {/* Header Formulario */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        {/* BOTÓN DE VOLVER: Estilo minimalista pero funcional */}
                        <button
                            onClick={onBack}
                            className="group flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all duration-300 shadow-sm"
                            title="Volver al listado"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </button>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-0.5">
                                <div className="h-5 w-1 bg-orange-500 rounded-full"></div>
                                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                    Registro de <span className="text-[#1e3a8a]">Docente</span>
                                </h1>
                            </div>
                            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wide ml-3">
                                Gestión de <span className="text-orange-500">Talento Humano</span>
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-orange-500 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                >
                    <Save size={20} /> {loading ? 'GUARDANDO...' : 'FINALIZAR REGISTRO'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Card: Datos Personales */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-[#f8fafc] flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-[#1e3a8a] rounded-lg"><User size={20} /></div>
                            <h3 className="font-black text-[#1e3a8a] uppercase text-xs tracking-wider">Identificación y Perfil</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nombres</label>
                                <input name="nombres" placeholder="Ej: Juan Alberto" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Apellidos</label>
                                <input name="apellidos" placeholder="Ej: Pérez Rossi" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Tipo de Doc.</label>
                                <select name="tipo_documento_id" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none">
                                    <option value="DNI">DNI</option>
                                    <option value="CE">C.E.</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nro. Documento</label>
                                <input name="numero_documento" placeholder="Ej: 77123456" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Fecha de Nacimiento</label>
                                <input name="fecha_nacimiento" type='date' onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Género</label>
                                <select name="genero" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none">
                                    <option value="">Seleccionar...</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Card: Contacto */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-[#f8fafc] flex items-center gap-3">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Mail size={20} /></div>
                            <h3 className="font-black text-[#1e3a8a] uppercase text-xs tracking-wider">Datos de Contacto</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Correo Electrónico</label>
                                <input name="email" placeholder="correo@ejemplo.com" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Teléfono Personal</label>
                                <input name="telefono_personal" placeholder="999 999 999" onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-[#f8fafc] flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-[#1e3a8a] rounded-lg"><GraduationCap size={20} /></div>
                            <h3 className="font-black text-[#1e3a8a] uppercase text-xs tracking-wider">Especialidad</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <textarea
                                name="especializacion"
                                onChange={handleChange}
                                placeholder="Ej: Entrenador de arqueros, Preparador físico..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none h-32 resize-none focus:border-[#1e3a8a]"
                            />
                        </div>
                    </div>

                    {/* Info Card de Seguridad */}
                    <div className="bg-[#0f172a] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <Lock size={32} className="text-orange-500 mb-3" />
                            <h4 className="font-black uppercase italic tracking-tighter text-lg leading-tight">Acceso Inicial</h4>
                            <p className="text-[10px] opacity-70 font-bold uppercase mt-2 leading-relaxed">
                                El sistema usará el número de documento como contraseña temporal.
                            </p>
                        </div>
                        <div className="absolute -right-6 -bottom-6 opacity-10">
                            <ShieldCheck size={120} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTeachers;