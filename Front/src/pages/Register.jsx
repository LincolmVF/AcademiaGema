import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CreditCard, Mail, Phone, Calendar, Users, Hash, AlertCircle, Heart, X, FileText, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { registerService } from '../services/auth.service';
import toast from 'react-hot-toast';

function Register() {
    const navigate = useNavigate();
    const [aceptarTerminos, setAceptarTerminos] = useState(false);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [lecturaCompletada, setLecturaCompletada] = useState(false); // Bloqueo del checkbox
    const [loading, setLoading] = useState(false);
    const [rolIdAlumno, setRolIdAlumno] = useState(null);

    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        tipo_documento_id: 'DNI',
        numero_documento: '',
        password: '',
        telefono_personal: '',
        fecha_nacimiento: '',
        genero: '',
        contacto_emergencia: '',
        parentesco: ''
    });

    useEffect(() => {
        const fetchRolId = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/roles/nombre/Alumno`);
                const result = await response.json();
                if (response.ok && result.data) setRolIdAlumno(result.data.id);
            } catch (error) {
                console.error("Error al conectar con la API de roles:", error);
            }
        };
        fetchRolId();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "telefono_personal" || name === "contacto_emergencia") {
            const onlyNums = value.replace(/\D/g, "");
            if (onlyNums.length <= 9) setFormData((prev) => ({ ...prev, [name]: onlyNums }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setLecturaCompletada(true); // Habilita el checkbox al cerrar
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rolIdAlumno) return toast.error("Error del sistema: Perfil no disponible.");
        if (!aceptarTerminos) return toast.error("Debes aceptar los términos y condiciones.");

        const toastId = toast.loading('Procesando inscripción...');
        setLoading(true);

        try {
            await registerService({ ...formData, rol_id: rolIdAlumno });
            toast.success(`¡Bienvenido! Revisa tu correo`, { id: toastId, duration: 10000 });
            navigate('/login');
        } catch (error) {
            toast.error(error.message || "Error al crear la cuenta", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden bg-[#020617]">
            {/* FONDO */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/bg.jpg"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                {/* Capa de color para integrar con la marca */}
                <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm"></div>
            </div>

            <button
                onClick={() => navigate('/login')}
                className="absolute top-8 left-8 flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-2xl hover:bg-white/10 hover:border-white/30 hover:scale-105 transition-all duration-300 z-50 text-xs font-black uppercase tracking-[0.2em] shadow-2xl"
            >
                <ArrowLeft size={16} className="text-orange-500" />
                Volver
            </button>

            <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/10 z-10 animate-fade-in">

                {/* LADO IZQUIERDO: Branding */}
                <div className="w-full md:w-1/3 bg-gradient-to-b from-blue-600 via-blue-800 to-indigo-950 p-10 text-white flex flex-col justify-center items-center relative overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
                    <div className="z-10 text-center">
                        <img src="/logo_diamante.jpeg" alt="Logo" className="rounded-full w-48 h-48 mx-auto mb-6 shadow-2xl border-4 border-white/10" />
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Club Gema</h2>
                        <div className="h-1 w-12 bg-orange-500 mx-auto my-4 rounded-full"></div>
                        <p className="text-blue-100 text-sm font-medium leading-relaxed opacity-80">
                            ¡Bienvenido a la comunidad! <br /> Completa tu perfil deportivo.
                        </p>
                    </div>
                </div>

                {/* LADO DERECHO: Formulario */}
                <div className="w-full md:w-2/3 p-8 md:p-14 bg-white max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <div className="mb-10">
                        <h3 className="text-3xl font-black text-[#1e3a8a] uppercase italic tracking-tighter">Datos del Participante</h3>
                        <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Inscripción oficial Academia Gema</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* FILA 1: EMAIL */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico *</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="ejemplo@correo.com"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all text-sm font-semibold" />
                            </div>
                        </div>

                        {/* FILA 2: NOMBRES / APELLIDOS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombres *</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                    <input type="text" name="nombres" required value={formData.nombres} onChange={handleChange} placeholder="Carlos"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Apellidos *</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                    <input type="text" name="apellidos" required value={formData.apellidos} onChange={handleChange} placeholder="Rodríguez"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* FILA 3: DOC / DNI / FECHA */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo Doc. *</label>
                                <select name="tipo_documento_id" value={formData.tipo_documento_id} onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all text-sm font-bold appearance-none cursor-pointer">
                                    <option value="DNI">DNI</option>
                                    <option value="CE">CE</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número DNI *</label>
                                <div className="relative group">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                    <input type="text" name="numero_documento" maxLength="12" required value={formData.numero_documento} onChange={handleChange} placeholder="72345678"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha Nacimiento *</label>
                                <input type="date" name="fecha_nacimiento" required value={formData.fecha_nacimiento} onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all text-sm font-bold" />
                            </div>
                        </div>

                        {/* FILA 4: CELULAR / EMERGENCIA / PARENTESCO */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mi Celular *</label>
                                <input type="tel" name="telefono_personal" required value={formData.telefono_personal} onChange={handleChange} placeholder="999 999 999"
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contacto Emergencia *</label>
                                <input type="tel" name="contacto_emergencia" required value={formData.contacto_emergencia} onChange={handleChange} placeholder="988 888 888"
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parentesco *</label>
                                <select name="parentesco" required value={formData.parentesco} onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all text-sm font-bold cursor-pointer">
                                    <option value="">Elegir...</option>
                                    <option value="familiar">Familiar</option>
                                    <option value="pareja">Pareja</option>
                                    <option value="amistad">Amistad</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                        </div>

                        {/* SECCIÓN TÉRMINOS */}
                        <div className="pt-6">
                            <div className={`group p-5 rounded-[2rem] border-2 transition-all duration-500 flex items-center gap-5 ${lecturaCompletada ? 'bg-orange-50/50 border-orange-200' : 'bg-slate-50 border-slate-100'}`}>
                                <div className={`p-3 rounded-2xl shadow-sm transition-colors ${lecturaCompletada ? 'bg-orange-500 text-white' : 'bg-white text-slate-400'}`}>
                                    <ShieldCheck size={24} />
                                </div>
                                <div className="flex-1">
                                    <button type="button" onClick={() => setModalAbierto(true)} className="text-xs font-black uppercase tracking-widest text-[#1e3a8a] hover:text-orange-600 transition-colors flex items-center gap-2">
                                        Términos y Condiciones
                                        {!lecturaCompletada && <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>}
                                    </button>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">Haz clic para leer y habilitar</p>
                                </div>
                                <div className="relative flex items-center">
                                    <input type="checkbox" checked={aceptarTerminos} onChange={(e) => setAceptarTerminos(e.target.checked)} disabled={!lecturaCompletada}
                                        className="w-8 h-8 rounded-xl border-2 border-slate-200 text-orange-500 focus:ring-offset-0 focus:ring-0 disabled:opacity-20 cursor-pointer transition-all" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={!aceptarTerminos || loading}
                            className="w-full bg-[#1e3a8a] hover:bg-orange-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/10 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none">
                            {loading ? "Procesando..." : "Finalizar Inscripción"}
                        </button>
                    </form>
                </div>
            </div>

            {/* MODAL DE TÉRMINOS */}
            {modalAbierto && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-xl animate-fade-in">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-white/20">
                        {/* Header Modal */}
                        <div className="relative p-10 bg-[#1e3a8a] text-white overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                            <div className="relative z-10">
                                <p className="text-orange-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Academia Gema</p>
                                <h4 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Compromiso de Participación</h4>
                            </div>
                        </div>

                        {/* Contenido Modal */}
                        <div className="p-10 overflow-y-auto custom-scrollbar">
                            <div className="space-y-8">
                                {[
                                    { title: "Uso de Imagen", desc: "Autorizo de manera libre y gratuita el uso de mi imagen y/o voz en fotografías, videos u otros materiales audiovisuales obtenidos durante las clases, pudiendo ser difundidos en medios digitales y promocionales del club." },
                                    { title: "Salud y Riesgo", desc: "Declaro conocer mis condiciones físicas y de salud, asumiendo plena responsabilidad de mi participación y deslindando al Club GEMA de cualquier complicación médica, lesión o accidente derivado de mi propia condición o negligencia." },
                                    { title: "Bienes Personales", desc: "Reconozco que el Club no se responsabiliza por daños, lesiones, pérdida, hurto o deterioro de mis bienes personales dentro de las instalaciones." },
                                    { title: "Infraestructura", desc: "Me comprometo a usar correctamente los equipos e infraestructura, asumiendo la responsabilidad por cualquier daño ocasionado por uso indebido." },
                                    { title: "Programación", desc: "Acepto que las clases se suspenden en feriados nacionales y pueden reprogramarse por motivos externos como clima, manifestaciones sociales, entre otros." },
                                    { title: "Pagos", desc: "Me comprometo a realizar los pagos en la fecha correspondiente al vencimiento de cada mes, entiendo que mis datos personales serán utilizados únicamente para fines administrativos, y que debo mantener respeto y buena convivencia con los entrenadores y compañeros." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-5 group">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-black">{idx + 1}</div>
                                        <div>
                                            <h5 className="text-[11px] font-black uppercase tracking-widest text-[#1e3a8a] mb-1">{item.title}</h5>
                                            <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-8 bg-slate-50 flex flex-col items-center gap-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Al hacer clic, confirmas que has leído y entendido todo</p>
                            <button onClick={cerrarModal} className="w-full bg-orange-500 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-xs shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                                <CheckCircle2 size={18} />
                                Aceptar y Continuar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Register;