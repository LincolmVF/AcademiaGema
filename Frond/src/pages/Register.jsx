import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import registerService from '../services/auth.service';
import toast from 'react-hot-toast';

function Register() {
    const navigate = useNavigate();
    const [aceptarTerminos, setAceptarTerminos] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        rol_id: 'alumno',
        tipo_documento_id: 'DNI',
        numero_documento: '',
        telefono_personal: '',
        fecha_nacimiento: '',
        genero: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!aceptarTerminos) {
            toast.error("Debes aceptar los términos y condiciones para continuar.");
            return;
        }

        if (!formData.email.includes('@')) {
            toast.error("Por favor, ingresa un correo electrónico válido");
            return;
        }

        setLoading(true);
        try {
            await registerService(formData);
            toast.success("¡Registro exitoso! Revisa tu correo para tus credenciales.");

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            toast.error(error.message || "Hubo un problema con el registro");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden">

            {/* FONDO CON IMAGEN Y OVERLAY (Igual al Login) */}
            <div className="absolute inset-0 z-0">
                <img src="/bg.jpg" alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm"></div>
            </div>

            <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/10 z-10">
                {/* LADO IZQUIERDO: Branding */}
                <div className="w-full md:w-1/3 bg-gradient-to-b from-blue-600 via-blue-800 to-indigo-950 p-10 text-white flex flex-col justify-between relative min-h-[500px]">
                    {/* Decoración de fondo */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white opacity-5 rounded-full"></div>
                    </div>

                    <div className="z-10 flex flex-col items-center text-center">
                        {/* Contenedor del Logo */}
                        <div className="p-4">
                            <img
                                src="/logo.png"
                                alt="Club Gema Logo"
                                className="w-60 h-auto filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                            />
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-4xl font-black tracking-tighter uppercase italic">Academia Gema</h2>
                            <div className="h-1.5 w-16 bg-orange-500 mx-auto rounded-full"></div>
                        </div>

                        <p className="text-blue-100 text-sm leading-relaxed font-medium max-w-[250px] mt-8">
                            ¡Gracias por confiar en nosotros! Completa tu perfil oficial de
                            <span className="block font-bold text-white mt-1">ALUMNO</span>
                        </p>
                    </div>

                    {/* Cuadro inferior de Cuenta Activa */}
                    <div className="z-10 mt-auto">
                        <div className="bg-transparent border-4 border-orange-500/40 backdrop-blur-sm p-4 rounded-lg text-center">
                            <p className="text-[10px] text-blue-200 uppercase tracking-[0.2em] font-bold mb-1">
                                Contáctanos al:
                            </p>
                            <p className="text-xs font-semibold opacity-90 truncate">
                                clubgema.voley@gmail.com
                            </p>
                        </div>
                    </div>
                </div>

                {/* LADO DERECHO: Formulario */}
                <div className="w-full md:w-2/3 p-8 md:p-12 bg-white max-h-[90vh] overflow-y-auto">
                    <div className="mb-8 border-b border-gray-100 pb-4">
                        <h3 className="text-3xl font-bold text-gray-900">Datos del Participante</h3>
                        <p className="text-gray-500 mt-2">Completa la información obligatoria para tu matrícula.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Campo de Email (Agregado arriba para visibilidad) */}
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Correo Electrónico"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        {/* NOMBRES Y APELLIDOS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-2 ml-1 tracking-wider">Nombres *</label>
                                <input type="text" name="nombres" required value={formData.nombres} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-orange-500 outline-none transition-all shadow-sm" placeholder="Carlos" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-2 ml-1 tracking-wider">Apellidos *</label>
                                <input type="text" name="apellidos" required value={formData.apellidos} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-orange-500 outline-none transition-all shadow-sm" placeholder="Rodríguez" />
                            </div>
                        </div>

                        {/* DOCUMENTO */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-2 ml-1 tracking-wider">Tipo Doc. *</label>
                                <select name="tipo_documento_id" value={formData.tipo_documento_id} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-orange-500 outline-none transition-all shadow-sm text-sm">
                                    <option value="DNI">DNI</option>
                                    <option value="CE">CE</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-2 ml-1 tracking-wider">Número de Documento *</label>
                                <input type="text" name="numero_documento" maxLength="12" required value={formData.numero_documento} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-orange-500 outline-none transition-all shadow-sm" placeholder="72345678" />
                            </div>
                        </div>

                        {/* TELÉFONO, FECHA Y GÉNERO */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-2 ml-1 tracking-wider">Celular *</label>
                                <input type="tel" name="telefono_personal" required value={formData.telefono_personal} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-orange-500 outline-none transition-all shadow-sm" placeholder="+51..." />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-2 ml-1 tracking-wider">Fecha Nacimiento *</label>
                                <input type="date" name="fecha_nacimiento" required value={formData.fecha_nacimiento} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-orange-500 outline-none transition-all shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-2 ml-1 tracking-wider">Género *</label>
                                <select name="genero" required value={formData.genero} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-orange-500 outline-none transition-all shadow-sm text-sm">
                                    <option value="">Elegir...</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                </select>
                            </div>
                        </div>

                        {/* SECCIÓN DE AUTORIZACION*/}
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between mb-1 pt-2">
                                <label className="text-[11px] font-black uppercase text-orange-500 tracking-[0.2em] ml-1">Autorización y Deslinde de Responsabilidad *</label>
                            </div>

                            <div className="relative bg-gray-50 border border-gray-200 rounded-3xl p-5 shadow-inner">
                                <div className="h-32 overflow-y-auto pr-2 text-[11px] text-gray-500 leading-relaxed custom-scrollbar">
                                    <p className="mb-3">El alumno declara ser consciente de sus limitaciones físicas y de cualquier condición de salud pre-existente que pueda afectar su entrenamiento. El usuario reconoce que es de su exclusiva responsabilidad usar el servicio deportivo de forma que no resulte en lesiones o empeoramiento de condiciones de salud, así como entrenar contra indicación médica.</p>
                                    <p className="mb-3">El Club no se responsabiliza por el daño, pérdida y/o hurto de los bienes personales del alumno. El alumno se responsabiliza por el uso indebido y/o negligente de los servicios deportivos, equipos y/o infraestructura que el club les ofrece.</p>
                                    <p className="mb-3">El alumno exonera al <strong>Club GEMA</strong> de cualquier responsabilidad civil y/o penal por lesiones corporales causado por la negligencia o causas del propio alumno. El Club no se hace responsable de ningún daño o lesión que pueda sufrir el alumno dentro de las instalaciones.</p>
                                    <p>El alumno acepta que el servicio de clases acatará los feriados nacionales establecidos, así como las modificaciones por motivos externos (clima, política, social, etc).</p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-200">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                required
                                                checked={aceptarTerminos}
                                                onChange={(e) => setAceptarTerminos(e.target.checked)}
                                                className="peer hidden"
                                            />
                                            <div className="w-5 h-5 border-2 border-gray-300 rounded-md transition-all peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-600 group-hover:text-blue-700 transition-colors">
                                            He leído y acepto los términos y condiciones de la Academia
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* BOTÓN FINAL */}
                        <div className="space-y-4 pt-2">
                            <button
                                type="submit"
                                disabled={!aceptarTerminos || loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 md:py-5 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-[0.97] transition-all uppercase tracking-[0.2em] text-xs disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                            >
                                {loading ? "Procesando..." : "Finalizar Inscripción"}
                            </button>

                            <div className="text-center">
                                <span className="text-sm text-gray-500 block mb-3">¿Ya eres parte de nuestra comunidad? </span>
                                <Link to="/login" className="group text-orange-500 font-bold hover:text-orange-600 transition-all inline-flex items-center gap-2">
                                    Inicia sesión aquí
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;