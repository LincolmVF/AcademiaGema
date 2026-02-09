import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Activity,
  ShieldCheck,
  HeartPulse,
  ChevronRight,
  ChevronLeft,
  User,
  Clock,
  Lock,
  Zap,
  MapPin,
  UserPlus,
  Trophy,
  Calendar,
  Upload,
  Home,
  CheckCircle2,
  Users,
} from "lucide-react";
import { registerService } from "../../services/auth.service";
import toast from "react-hot-toast";

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aceptarTerminos, setAceptarTerminos] = useState(false);
  const [comprobanteFile, setComprobanteFile] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formData, setFormData] = useState({
    password: "",
    direccion_completa: "",
    distrito: "",
    ciudad: "",
    referencia: "",
    contacto_emergencia: {
      nombre_completo: "",
      telefono: "",
      relacion: "",
    },
    datosRolEspecifico: {
      condiciones_medicas: "",
      seguro_medico: "",
      grupo_sanguineo: "",
    },
    sede_id: "",
    horario_id: "",
    nivel: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      ["condiciones_medicas", "seguro_medico", "grupo_sanguineo"].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        datosRolEspecifico: { ...prev.datosRolEspecifico, [name]: value },
      }));
    } else if (name.startsWith("contacto_")) {
      const field = name.replace("contacto_", "");
      setFormData((prev) => ({
        ...prev,
        contacto_emergencia: { ...prev.contacto_emergencia, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setComprobanteFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword)
      return toast.error("Las contraseñas no coinciden");
    if (formData.password.length < 6)
      return toast.error("Mínimo 6 caracteres");
    setLoading(true);
    try {
      await registerService(formData);
      toast.success("¡Registro completado!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Error en el proceso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 md:p-4 font-sans">
      {/* Stepper Compacto */}
      <div className="flex items-center justify-center mb-6 gap-3">
        {[1].map((num) => (
          <React.Fragment key={num}>
            <div
              className={`flex items-center gap-2 ${step === num ? "text-orange-500" : "text-slate-300"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === num ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : "bg-slate-200 text-slate-500"}`}
              >
                {num}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {num === 1 ? "Perfil":""}  
              </span>
            </div>
            {num === 1 && <div className="w-8 h-px bg-slate-100"></div>}
          </React.Fragment>
        ))}
        </div>
      

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
              {/* --- PASO 1: COMPLETAR PERFIL --- */}
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="p-2.5 bg-orange-500 rounded-xl text-white shadow-lg shadow-orange-500/20">
                    <User size={20} />
                  </div>
                  <h2 className="text-xl font-black text-[#263e5e] uppercase tracking-tight leading-none">
                    Completar Perfil
                  </h2>
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
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
                        Nueva Contraseña
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors"
                          size={16}
                        />
                        <input
                          type="password"
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl outline-none text-sm font-bold shadow-sm transition-all"
                          placeholder="******"
                        />
                      </div>
                    </div>
                    <div className="group space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
                        Confirmar Contraseña
                      </label>
                      <div className="relative">
                        <CheckCircle2
                          className={`absolute left-3 top-1/2 -translate-y-1/2 ${formData.password === confirmPassword && confirmPassword !== "" ? "text-green-500" : "text-slate-300"}`}
                          size={16}
                        />
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border outline-none text-sm font-bold transition-all rounded-xl shadow-sm ${formData.password === confirmPassword && confirmPassword !== "" ? "border-green-500 bg-green-50/30" : "border-slate-200 focus:border-orange-500"}`}
                          placeholder="******"
                        />
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
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
                        Dirección Completa
                      </label>
                      <div className="relative">
                        <Home
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors"
                          size={16}
                        />
                        <input
                          type="text"
                          name="direccion_completa"
                          required
                          value={formData.direccion_completa}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold transition-all shadow-sm"
                          placeholder="Calle / Mz / Lote"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 group space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
                        Distrito
                      </label>
                      <input
                        type="text"
                        name="distrito"
                        required
                        value={formData.distrito}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold shadow-sm"
                        placeholder="Distrito"
                      />
                    </div>
                    <div className="md:col-span-2 group space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        name="ciudad"
                        required
                        value={formData.ciudad}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold shadow-sm"
                        placeholder="Ciudad"
                      />
                    </div>
                    <div className="md:col-span-4 group space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
                        Referencia
                      </label>
                      <div className="relative">
                        <Zap
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors"
                          size={16}
                        />
                        <input
                          type="text"
                          name="referencia"
                          required
                          value={formData.referencia}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold shadow-sm"
                          placeholder="Frente a / Cerca de"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergencia */}
                <div className="bg-slate-50/80 rounded-[2rem]border border-slate-100 space-y-4">
                  <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-[0.2em]">
                    <UserPlus size={14} strokeWidth={3} /> CONTACTO DE
                    EMERGENCIA
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2 group relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500"
                        size={16}
                      />
                      <input
                        type="text"
                        name="contacto_nombre_completo"
                        placeholder="Nombre Completo *"
                        required
                        value={formData.contacto_emergencia.nombre_completo}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold shadow-sm transition-all"
                      />
                    </div>
                    <div className="group relative">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500"
                        size={16}
                      />
                      <input
                        type="tel"
                        name="contacto_telefono"
                        placeholder="Teléfono *"
                        required
                        value={formData.contacto_emergencia.telefono}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold shadow-sm transition-all"
                      />
                    </div>
                    <div className="group relative">
                      <Users
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500"
                        size={16}
                      />
                      <input
                        type="text"
                        name="contacto_relacion"
                        placeholder="Parentesco *"
                        required
                        value={formData.contacto_emergencia.relacion}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold shadow-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Salud */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-[0.2em]">
                      <HeartPulse
                        size={14}
                        strokeWidth={3}
                        className="text-orange-500"
                      />{" "}
                      FICHA MÉDICA
                    </div>
                    <div className="h-px flex-1 bg-slate-100"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="group relative">
                      <ShieldCheck
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500"
                        size={16}
                      />
                      <input
                        type="text"
                        name="seguro_medico"
                        placeholder="Seguro Médico *"
                        required
                        value={formData.datosRolEspecifico.seguro_medico}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold transition-all shadow-sm"
                      />
                    </div>
                    <div className="group relative">
                      <Activity
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                        size={16}
                      />
                      <select
                        name="grupo_sanguineo"
                        required
                        value={formData.datosRolEspecifico.grupo_sanguineo}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold appearance-none transition-all shadow-sm"
                      >
                        <option value="">Grupo Sanguíneo</option>
                        <option value="O+">O Rh+</option>
                        <option value="O-">O Rh-</option>
                        <option value="A+">A Rh+</option>
                        <option value="B+">B Rh+</option>
                      </select>
                    </div>
                    <div className="group relative">
                      <Activity
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500"
                        size={16}
                      />
                      <input
                        type="text"
                        name="condiciones_medicas"
                        placeholder="Alergias (Opcional)"
                        value={formData.datosRolEspecifico.condiciones_medicas}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              </form>
            </div>
          </div>
        </div>
        
      );
};

export default StudentRegistration;
