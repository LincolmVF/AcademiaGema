import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Phone, Activity, ShieldCheck, HeartPulse, ChevronRight, ChevronLeft, User, Clock,
    Lock, Zap, MapPin, UserPlus, Trophy, Calendar, Upload, Home, CheckCircle2,
    Users
} from 'lucide-react';
import { registerService } from '../../services/auth.service';
import toast from 'react-hot-toast';

const StudentRegistration = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [aceptarTerminos, setAceptarTerminos] = useState(false);
    const [comprobanteFile, setComprobanteFile] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState('');

    const [formData, setFormData] = useState({
        password: '',
        direccion_completa: '',
        distrito: '',
        ciudad: '',
        referencia: '',
        contacto_emergencia: {
            nombre_completo: '',
            telefono: '',
            relacion: ''
        },
        datosRolEspecifico: {
            condiciones_medicas: '',
            seguro_medico: '',
            grupo_sanguineo: ''
        },
        sede_id: '',
        horario_id: '',
        nivel: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['condiciones_medicas', 'seguro_medico', 'grupo_sanguineo'].includes(name)) {
            setFormData(prev => ({ ...prev, datosRolEspecifico: { ...prev.datosRolEspecifico, [name]: value } }));
        } else if (name.startsWith('contacto_')) {
            const field = name.replace('contacto_', '');
            setFormData(prev => ({ ...prev, contacto_emergencia: { ...prev.contacto_emergencia, [field]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        setComprobanteFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) {
            if (formData.password !== confirmPassword) return toast.error("Las contraseñas no coinciden");
            if (formData.password.length < 6) return toast.error("Mínimo 6 caracteres");
            setStep(2);
            return;
        }
        if (!comprobanteFile) return toast.error("Sube tu comprobante");
        setLoading(true);
        try {
            await registerService(formData, comprobanteFile);
            toast.success("¡Registro completado!");
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || "Error en el proceso");
        } finally { setLoading(false); }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-2 md:p-4 font-sans">
            {/* Stepper Compacto */}
            <div className="flex items-center justify-center mb-6 gap-3">
                {[1, 2].map((num) => (
                    <React.Fragment key={num}>
                        <div className={`flex items-center gap-2 ${step === num ? 'text-orange-500' : 'text-slate-300'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === num ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-200 text-slate-500'}`}>{num}</div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{num === 1 ? 'Perfil' : 'Matrícula'}</span>
                        </div>
                        {num === 1 && <div className="w-8 h-px bg-slate-100"></div>}
                    </React.Fragment>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-6 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {step === 1 ? (
                            /* --- PASO 1: COMPLETAR PERFIL --- */
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                    <div className="p-2.5 bg-orange-500 rounded-xl text-white shadow-lg shadow-orange-500/20"><User size={20} /></div>
                                    <h2 className="text-xl font-black text-[#263e5e] uppercase tracking-tight leading-none">Completar Perfil</h2>
                                </div>

                                {/* Seguridad */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-[0.2em]">
                                            <Lock size={14} strokeWidth={3} /> SEGURIDAD
                                        </div>
                                        <div className="h-px flex-1 bg-slate-100"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="group space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Nueva Contraseña</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={16} />
                                                <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl outline-none text-sm font-bold shadow-sm transition-all" placeholder="******" />
                                            </div>
                                        </div>
                                        <div className="group space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Confirmar Contraseña</label>
                                            <div className="relative">
                                                <CheckCircle2 className={`absolute left-3 top-1/2 -translate-y-1/2 ${formData.password === confirmPassword && confirmPassword !== '' ? 'text-green-500' : 'text-slate-300'}`} size={16} />
                                                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border outline-none text-sm font-bold transition-all rounded-xl shadow-sm ${formData.password === confirmPassword && confirmPassword !== '' ? 'border-green-500 bg-green-50/30' : 'border-slate-200 focus:border-orange-500'}`} placeholder="******" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dirección */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-[0.2em]">
                                            <MapPin size={14} strokeWidth={3} /> UBICACIÓN
                                        </div>
                                        <div className="h-px flex-1 bg-slate-100"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                                        <div className="md:col-span-4 group space-y-1">
                                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Dirección Completa</label>
                                            <div className="relative">
                                                <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={16} />
                                                <input type="text" name="direccion_completa" required value={formData.direccion_completa} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold transition-all shadow-sm" placeholder="Calle / Mz / Lote" />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 group space-y-1">
                                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Distrito</label>
                                            <input type="text" name="distrito" required value={formData.distrito} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold shadow-sm" placeholder="Distrito" />
                                        </div>
                                        <div className="md:col-span-2 group space-y-1">
                                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Ciudad</label>
                                            <input type="text" name="ciudad" required value={formData.ciudad} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold shadow-sm" placeholder="Ciudad" />
                                        </div>
                                        <div className="md:col-span-4 group space-y-1">
                                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Referencia</label>
                                            <div className="relative">
                                                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={16} />
                                                <input type="text" name="referencia" required value={formData.referencia} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold shadow-sm" placeholder="Frente a / Cerca de" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Emergencia */}
                                <div className="bg-slate-50/80 rounded-[2rem]border border-slate-100 space-y-4">
                                    <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-[0.2em]">
                                        <UserPlus size={14} strokeWidth={3} /> CONTACTO DE EMERGENCIA
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                        <div className="md:col-span-2 group relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500" size={16} />
                                            <input type="text" name="contacto_nombre_completo" placeholder="Nombre Completo *" required value={formData.contacto_emergencia.nombre_completo} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold shadow-sm transition-all" />
                                        </div>
                                        <div className="group relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500" size={16} />
                                            <input type="tel" name="contacto_telefono" placeholder="Teléfono *" required value={formData.contacto_emergencia.telefono} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold shadow-sm transition-all" />
                                        </div>
                                        <div className="group relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500" size={16} />
                                            <input type="text" name="contacto_relacion" placeholder="Parentesco *" required value={formData.contacto_emergencia.relacion} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold shadow-sm transition-all" />
                                        </div>
                                    </div>
                                </div>

                                {/* Salud */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-[0.2em]">
                                            <HeartPulse size={14} strokeWidth={3} className="text-orange-500" /> FICHA MÉDICA
                                        </div>
                                        <div className="h-px flex-1 bg-slate-100"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="group relative">
                                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500" size={16} />
                                            <input type="text" name="seguro_medico" placeholder="Seguro Médico *" required value={formData.datosRolEspecifico.seguro_medico} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold transition-all shadow-sm" />
                                        </div>
                                        <div className="group relative">
                                            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                            <select name="grupo_sanguineo" required value={formData.datosRolEspecifico.grupo_sanguineo} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold appearance-none transition-all shadow-sm">
                                                <option value="">Grupo Sanguíneo</option>
                                                <option value="O+">O Rh+</option><option value="O-">O Rh-</option><option value="A+">A Rh+</option><option value="B+">B Rh+</option>
                                            </select>
                                        </div>
                                        <div className="group relative">
                                            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500" size={16} />
                                            <input type="text" name="condiciones_medicas" placeholder="Alergias (Opcional)" value={formData.datosRolEspecifico.condiciones_medicas} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold transition-all shadow-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* --- PASO 2: MATRÍCULA DEPORTIVA (Simplificado para API) --- */
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                                {/* Encabezado */}
                                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                    <div className="p-2.5 bg-[#263e5e] rounded-xl text-white shadow-lg shadow-blue-900/20">
                                        <Trophy size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-[#263e5e] uppercase tracking-tight leading-none">Matrícula Deportiva</h2>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Paso final para activar tu cuenta</p>
                                    </div>
                                </div>

                                {/* Alerta de tiempo (Simplificada) */}
                                <div className="bg-orange-50/50 border-l-4 border-orange-500 p-4 rounded-r-2xl">
                                    <div className="flex items-center gap-3">
                                        <Clock className="text-orange-500" size={18} />
                                        <p className="text-[11px] font-black text-[#263e5e] uppercase tracking-tight">
                                            Reserva temporal: <span className="text-orange-600">Tienes 2 horas para pagar</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Grid de Selección Básica */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* SEDE (Aquí mapeas tus sedes del backend) */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Sede de Entrenamiento</label>
                                        <select name="sede_id" required value={formData.sede_id} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-2xl outline-none text-sm font-bold transition-all">
                                            <option value="">Seleccionar sede...</option>
                                            {/* Reemplazar con: sedesDeAPI.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>) */}
                                            <option value="1">Surco - Sede Central</option>
                                            <option value="2">Los Olivos - Sede Norte</option>
                                        </select>
                                    </div>

                                    {/* NIVEL (Aquí mapeas tus niveles del backend) */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nivel Actual</label>
                                        <select name="nivel" required value={formData.nivel} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-2xl outline-none text-sm font-bold transition-all">
                                            <option value="">Determinar nivel...</option>
                                            <option value="principiante">Iniciación / Semillero</option>
                                            <option value="intermedio">Intermedio / Pre-Equipo</option>
                                            <option value="avanzado">Avanzado / Selección</option>
                                        </select>
                                    </div>
                                </div>

                                {/* SECCIÓN: CALENDARIO DE HORARIOS INTERACTIVO */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-black text-[#263e5e] uppercase tracking-[0.2em]">
                                            Panel de Disponibilidad Semanal
                                        </label>
                                        <div className="flex gap-3">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <span className="text-[8px] font-bold text-slate-400 uppercase">Disponible</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                <span className="text-[8px] font-bold text-slate-400 uppercase">Lleno</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto pb-2 custom-scrollbar">
                                        <div className="inline-grid grid-cols-6 gap-2 min-w-[600px] w-full">
                                            {/* Cabecera de Días */}
                                            {['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'].map(dia => (
                                                <div key={dia} className="text-center py-2 bg-slate-100 rounded-lg">
                                                    <span className="text-[10px] font-black text-slate-500 tracking-widest">{dia}</span>
                                                </div>
                                            ))}

                                            {/* Renderizado de Bloques de Horario mapeando desde el Backend */}
                                            {[
                                                { id: '1', dias: [0, 2, 4], label: 'Mañanas', horas: '09:00 - 11:00', cupos: 5 },
                                                { id: '2', dias: [0, 2, 4], label: 'Tardes', horas: '16:00 - 18:00', cupos: 2 },
                                                { id: '3', dias: [1, 3], label: 'Noches', horas: '17:00 - 19:00', cupos: 8 },
                                                { id: '4', dias: [5], label: 'Full Day', horas: '09:00 - 13:00', cupos: 0 },
                                            ].map((h) => (
                                                <React.Fragment key={h.id}>
                                                    {[0, 1, 2, 3, 4, 5].map(indexDia => {
                                                        const esDiaActivo = h.dias.includes(indexDia);
                                                        if (!esDiaActivo) return <div key={`${h.id}-${indexDia}`} className="h-20 border border-slate-50 rounded-2xl"></div>;

                                                        const isFull = h.cupos === 0;
                                                        const isSelected = formData.horario_id === h.id;

                                                        return (
                                                            <button
                                                                key={`${h.id}-${indexDia}`}
                                                                type="button"
                                                                disabled={isFull}
                                                                onClick={() => setFormData({ ...formData, horario_id: h.id })}
                                                                className={`h-20 p-2 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between text-left
                                    ${isFull ? 'bg-slate-50 border-slate-100 opacity-40 cursor-not-allowed' :
                                                                        isSelected ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/30' :
                                                                            'bg-white border-slate-100 hover:border-orange-200 hover:shadow-md'}`}
                                                            >
                                                                <div className="flex justify-between items-start w-full">
                                                                    <span className={`text-[8px] font-black uppercase tracking-tighter ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                                                        {h.label}
                                                                    </span>
                                                                    {isSelected && <CheckCircle2 size={10} className="text-white animate-bounce" />}
                                                                </div>

                                                                <div>
                                                                    <p className={`text-[9px] font-bold leading-tight ${isSelected ? 'text-white' : 'text-[#263e5e]'}`}>
                                                                        {h.horas.split(' - ')[0]}
                                                                    </p>
                                                                    <p className={`text-[9px] font-medium leading-tight opacity-70 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                                                        {h.horas.split(' - ')[1]}
                                                                    </p>
                                                                </div>

                                                                <div className={`mt-1 h-1 w-full rounded-full ${isFull ? 'bg-red-400' : isSelected ? 'bg-white/40' : 'bg-green-100'}`}>
                                                                    {!isFull && !isSelected && <div className="h-full bg-green-500 rounded-full" style={{ width: `${(h.cupos / 15) * 100}%` }}></div>}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Resumen dinámico mejorado */}
                                    {formData.horario_id && (
                                        <div className="bg-orange-500 rounded-2xl p-4 text-white flex items-center justify-between shadow-xl shadow-orange-500/20 animate-in slide-in-from-bottom-2">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/20 rounded-xl">
                                                    <Calendar size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Horario Seleccionado</p>
                                                    <p className="text-sm font-black">
                                                        {formData.horario_id === '1' && "Lunes, Miércoles y Viernes de 9am a 11am"}
                                                        {formData.horario_id === '2' && "Lunes, Miércoles y Viernes de 4pm a 6pm"}
                                                        {formData.horario_id === '3' && "Martes y Jueves de 5pm a 7pm"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase opacity-80 text-white/80">Pago Pendiente</p>
                                                <p className="text-lg font-black tracking-tighter">S/ 150.00</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer de Términos (Más simple) */}
                                <div className="pt-4">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" checked={aceptarTerminos} onChange={(e) => setAceptarTerminos(e.target.checked)} className="peer hidden" />
                                            <div className="w-5 h-5 border-2 border-slate-200 rounded-lg peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-all flex items-center justify-center">
                                                <CheckCircle2 size={12} className="text-white scale-0 peer-checked:scale-100 transition-transform" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                            Confirmo que realizaré el pago en las próximas 2 horas.
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4 border-t border-slate-50">
                            {step === 2 && (
                                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-600 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"><ChevronLeft size={16} /> Atrás</button>
                            )}
                            <button type="submit" disabled={loading} className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-500/25 transition-all uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 disabled:bg-slate-300 hover:-translate-y-0.5 active:scale-95">
                                {loading ? "..." : step === 1 ? "Continuar Matrícula" : "Finalizar y Activar Cuenta"} <ChevronRight size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentRegistration;