import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
    const [aceptarTerminos, setAceptarTerminos] = useState(false);
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        celular: '',
        fechaNacimiento: '',
        dni: '',
        distrito: '',
        sede: '',
        nivel: '',
        contactoEmergencia: '',
        constancia: null,
        autorizacion: '',
        comentarios: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos de registro:", formData);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans text-gray-800">
            <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200">

                {/* LADO IZQUIERDO: Branding */}
                <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-700 to-indigo-900 p-12 text-white flex flex-col justify-between relative min-h-[450px]">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
                    <div className="z-10">
                        <h2 className="text-4xl font-extrabold mb-4 tracking-tight italic">Academia Gema</h2>
                        <div className="h-1 w-12 bg-blue-400 mb-6"></div>
                        <p className="text-blue-100 text-lg leading-relaxed font-light">
                            ¡Gracias por confiar en nosotros! Alcanza tu mejor versión con nuestro <span className="font-semibold text-white">staff profesional</span>.
                        </p>
                        <div className="mt-10 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                            <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold mb-1">Cuenta Activa</p>
                            <p className="text-sm font-medium opacity-90 truncate italic">clubgema.voley@gmail.com</p>
                        </div>
                    </div>
                </div>

                {/* LADO DERECHO: Formulario */}
                <div className="w-full md:w-2/3 p-8 md:p-12 bg-white max-h-[90vh] overflow-y-auto">
                    <div className="mb-8 border-b border-gray-100 pb-4">
                        <h3 className="text-3xl font-bold text-gray-900">Datos del Participante</h3>
                        <p className="text-gray-500 mt-2">Por favor, completa la información para procesar tu matrícula.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* DNI */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-2 ml-1 tracking-wider">DNI o CE *</label>
                                <input
                                    type="text"
                                    name="dni"
                                    maxLength="8"
                                    required
                                    value={formData.dni}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                                    placeholder="Ingrese su documento"
                                />
                            </div>
                            {/* NOMBRE */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-2 ml-1 tracking-wider">Nombre Completo *</label>
                                <input
                                    type="text"
                                    name="nombreCompleto"
                                    required
                                    value={formData.nombreCompleto}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                                    placeholder="Nombres y Apellidos"
                                />
                            </div>
                        </div>

                        {/* CELULAR Y FECHA */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-2 ml-1 tracking-wider">Número de Celular *</label>
                                <input type="tel" name="celular" required onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                                    placeholder="999 999 999" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-2 ml-1 tracking-wider">Fecha de Nacimiento *</label>
                                <input type="date" name="fechaNacimiento" required onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm" />
                            </div>
                        </div>

                        {/* DISTRITO Y SEDE */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-2 ml-1 tracking-wider">Distrito donde vives *</label>
                                <input type="text" name="distrito" required onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-700 mb-2 ml-1 tracking-wider">Sede a participar *</label>
                                <select name="sede" required onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm text-sm text-gray-600 cursor-pointer">
                                    <option value="">Selecciona una sede...</option>
                                    <option>Callao - Leoncio Prado</option>
                                    <option>Mirones</option>
                                    <option>Pueblo Libre</option>
                                    <option>San Miguel - Aráoz Pinto</option>
                                    <option>Surquillo - Colegio Lourdes</option>
                                </select>
                            </div>
                        </div>

                        {/* SECCIÓN DE YAPE */}
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-[11px] font-black uppercase text-blue-700 tracking-[0.2em] ml-1">Constancia de Inscripción *</label>
                                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 shadow-sm">YAPE: 902 585 995</span>
                            </div>

                            <div className="relative group overflow-hidden bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500">
                                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                                <div className="flex items-center p-6 gap-6">
                                    <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 transition-all duration-500 shadow-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-sm font-bold text-gray-800 mb-1">Cargar Comprobante</h4>
                                        <p className="text-[11px] text-gray-400">Captura de Yape (JPG, PNG o PDF)</p>
                                    </div>
                                </div>
                                <input type="file" required accept="image/*,.pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                            </div>

                            {/* SECCIÓN DE AUTORIZACIÓN */}
                            <div className="flex items-center justify-between mb-1 pt-2">
                                <label className="text-[11px] font-black uppercase text-blue-700 tracking-[0.2em] ml-1">Autorización y Deslinde de Responsabilidad *</label>
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
                                disabled={!aceptarTerminos}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 md:py-5 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-[0.97] transition-all uppercase tracking-[0.2em] text-xs disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                            >
                                Finalizar Inscripción
                            </button>

                            <div className="text-center">
                                <span className="text-gray-400 text-xs font-medium">¿Ya eres parte de nuestra comunidad? </span>
                                <Link to="/login" className="text-blue-600 font-bold hover:text-indigo-800 transition-all text-xs border-b border-transparent hover:border-indigo-800">
                                    Inicia sesión aquí
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