import React, { useState } from 'react';
import { 
  Upload, Send, User, Phone, Calendar, 
  Fingerprint, MapPin, Trophy, HeartHandshake, CheckCircle2, ArrowLeft, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InscriptionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreCompleto: '', celular: '', fechaNacimiento: '', documentoIdentidad: '',
    distrito: '', sede: '', nivelJuego: '', contactoEmergencia: '',
    parentesco: '', aceptaTerminos: false, comentarios: ''
  });

  const [files, setFiles] = useState([]);
  const [focusedField, setFocusedField] = useState(null);

  const sedes = [
    "Callao - Leoncio Prado", "Mirones", "Pueblo Libre", 
    "San Miguel - Aráoz Pinto", "San Miguel - Tottus", 
    "Surco", "Surquillo - Col. Lourdes", "Surquillo - SOMMI"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files).slice(0, 5));
  };

  const InputWrapper = ({ label, icon: Icon, children, name }) => (
    <div className={`transition-all duration-300 ${focusedField === name ? 'transform translate-y-[-2px]' : ''}`}>
      <label className={`flex items-center gap-2 text-sm font-bold mb-2 ml-1 transition-colors duration-300 ${focusedField === name ? 'text-blue-400' : 'text-slate-400'}`}>
        <Icon size={16} />
        {label}
      </label>
      {React.cloneElement(children, {
        onFocus: () => setFocusedField(name),
        onBlur: () => setFocusedField(null),
        name: name,
        onChange: handleChange
      })}
    </div>
  );

  return (
    /* FONDO DE PÁGINA: Gris Humo Suave (No blanco puro) */
    <div className="min-h-screen bg-[#f1f5f9] py-12 px-4 relative">
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* BOTÓN VOLVER */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 group transition-all"
        >
          <div className="p-2 rounded-xl bg-white shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all border border-slate-200">
            <ArrowLeft size={18} />
          </div>
          <span className="font-bold text-sm">Volver al inicio</span>
        </button>

        {/* TARJETA DE DATOS: Color Oscuro (Slate 900) */}
        <div className="bg-[#0f172a] rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-white/5">
          
          {/* Header con Gradiente para dar vida */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-10 md:p-14 text-white relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Sparkles size={120} />
            </div>
            <div className="relative z-10">
              <span className="bg-black/30 backdrop-blur-md text-[10px] uppercase tracking-[0.25em] font-black px-4 py-1.5 rounded-full border border-white/20 inline-block mb-4">
                Inscripción 2026
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">
                GEMA <span className="text-blue-400">ACADEMY</span>
              </h1>
              <p className="text-blue-100/70 mt-2 font-medium text-lg">
                Únete al club de voley con más proyección.
              </p>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="p-8 md:p-14 space-y-12">
            
            {/* Sección 1: Datos Personales */}
            <section className="space-y-8">
              <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-10 h-[2px] bg-blue-500"></span> 01. Información Personal
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputWrapper label="Nombre Completo" icon={User} name="nombreCompleto">
                  <input required className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-white/10 outline-none transition-all" placeholder="Juan Pérez" />
                </InputWrapper>
                
                <InputWrapper label="Número de Celular" icon={Phone} name="celular">
                  <input required type="tel" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-white/10 outline-none transition-all" placeholder="9xx xxx xxx" />
                </InputWrapper>

                <InputWrapper label="Fecha de Nacimiento" icon={Calendar} name="fechaNacimiento">
                  <input required type="date" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all invert-calendar" />
                </InputWrapper>

                <InputWrapper label="DNI / CE" icon={Fingerprint} name="documentoIdentidad">
                  <input required className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-white/10 outline-none transition-all" />
                </InputWrapper>
              </div>
            </section>

            {/* Sección 2: Sede (Fondo con contraste) */}
            <section className="bg-white/[0.02] -mx-8 md:-mx-14 p-8 md:p-14 border-y border-white/5">
               <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <span className="w-10 h-[2px] bg-blue-500"></span> 02. Sede y Categoría
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputWrapper label="Distrito de Residencia" icon={MapPin} name="distrito">
                  <input required className="w-full px-6 py-4 bg-slate-900 border border-white/10 rounded-2xl text-white focus:border-blue-500 outline-none transition-all" />
                </InputWrapper>

                <InputWrapper label="Sede Elegida" icon={Trophy} name="sede">
                  <select required className="w-full px-6 py-4 bg-slate-900 border border-white/10 rounded-2xl text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                    <option value="">Selecciona tu sede</option>
                    {sedes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </InputWrapper>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-400 mb-4 ml-1">Nivel de Juego</label>
                  <div className="flex flex-wrap gap-3">
                    {['Básico', 'Pre - Intermedio', 'Intermedio'].map(nivel => (
                      <button 
                        key={nivel}
                        type="button"
                        onClick={() => setFormData({...formData, nivelJuego: nivel})}
                        className={`px-8 py-3 rounded-2xl border-2 font-bold text-sm transition-all duration-300 ${formData.nivelJuego === nivel ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105' : 'bg-transparent border-white/10 text-slate-500 hover:border-blue-500 hover:text-white'}`}
                      >
                        {nivel}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 3: Pago */}
            <section className="space-y-10">
              <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-10 h-[2px] bg-blue-500"></span> 03. Comprobante
              </h2>

              <div className="group relative border-2 border-dashed border-white/10 rounded-[2.5rem] p-12 text-center hover:bg-white/[0.02] hover:border-blue-500/50 transition-all cursor-pointer">
                <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-blue-600/10 text-blue-400 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <Upload size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Adjuntar Constancia YAPE</h3>
                  <p className="text-slate-500 text-sm mt-1">Sube el comprobante de pago realizado</p>
                  
                  {files.length > 0 && (
                    <div className="mt-4 flex gap-2 flex-wrap justify-center">
                      {files.map((f, i) => (
                        <span key={i} className="bg-green-500/20 text-green-400 text-[10px] font-bold px-4 py-1.5 rounded-full border border-green-500/20 flex items-center gap-2">
                          <CheckCircle2 size={14} /> {f.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Compromiso en caja oscura */}
              <div className="bg-slate-800/50 rounded-[2.5rem] p-8 border border-white/5">
                <div className="flex items-start gap-4 mb-6">
                  <HeartHandshake className="text-blue-400 shrink-0" size={24} />
                  <p className="text-slate-400 text-xs leading-relaxed">
                    El alumno declara ser consciente de sus limitaciones físicas y de cualquier condición de salud pre-existente que pueda afectar su entrenamiento. El usuario reconoce que es de su exclusiva responsabilidad usar el servicio deportivo de forma que no resulte en lesiones o empeoramiento de condiciones de salud, así como entrenar contra indicación médica. El alumno es responsable de no exponer a otros alumnos o al personal a riesgos de salud, tales como enfermedades por contagio. 
                    <br></br>El Club no se responsabiliza por el daño, pérdida y/o hurto de los bienes personales del alumno. El alumno se responsabiliza por el uso indebido y/o negligente de los servicios deportivos, equipos y/o infraestructura que el club les ofrece. 
                    <br></br>El alumno exonera al Club GEMA de cualquier responsabilidad civil y/o penal por lesiones corporales causado por la negligencia o causas del propio alumno.
                    <br></br>El Club no se hace responsable de ningún daño o lesión que pueda sufrir el alumno dentro de las instalaciones. Todo alumno es responsable de su propia integridad física.  
                    <br></br>El alumno acepta que el servicio de clases que ofrece el club acatará los feriados nacionales establecidos, así como las modificaciones y/o variaciones cuando así lo determine la administración por motivos externos (factores producidos por: naturaleza, políticos, sociales, etc).
                  </p>
                </div>
                <label className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                  <input type="checkbox" required className="w-5 h-5 accent-blue-500 cursor-pointer" />
                  <span className="text-sm font-bold text-slate-300">Acepto los términos y condiciones</span>
                </label>
              </div>
            </section>

            {/* Botón Final */}
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-7 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] transform hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-4 text-xl"
            >
              FINALIZAR MI INSCRIPCIÓN
              <Send size={24} />
            </button>

            <p className="text-center text-slate-600 text-[11px] font-bold uppercase tracking-widest">
              Gema Academy © 2026 • Lima, Perú
            </p>
          </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .invert-calendar::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
      `}} />
    </div>
  );
};

export default InscriptionForm;