import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Activity,
  ShieldCheck,
  HeartPulse,
  ChevronRight,
  User,
  Lock,
  Zap,
  MapPin,
  UserPlus,
  Home,
  CheckCircle2,
  Users,
} from "lucide-react";
import alumnoService from "../../services/alumno.service";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const StudentRegistration = () => {
  const navigate = useNavigate();
  const { userId, login } = useAuth();
  const [loading, setLoading] = useState(false);
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

  const BLOOD_GROUPS = new Set(["O+", "O-", "A+", "B+"]);
  const PHONE_REGEX = /^\+?\d{9,15}$/;

  const validateForm = () => {
    if (
      !formData.password ||
      formData.password.length < 8 ||
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/\d/.test(formData.password)
    ) {
      throw new Error(
        "La contraseña debe tener al menos 8 caracteres, e incluir mayúsculas, minúsculas y números",
      );
    }

    if (
      !formData.direccion_completa ||
      formData.direccion_completa.trim().length < 5
    ) {
      throw new Error("Dirección completa inválida");
    }
    if (!formData.distrito?.trim()) {
      throw new Error("Distrito es obligatorio");
    }
    if (!formData.ciudad?.trim()) {
      throw new Error("Ciudad es obligatoria");
    }
    if (!formData.referencia || formData.referencia.trim().length < 3) {
      throw new Error("Referencia es obligatoria");
    }

    const ce = formData.contacto_emergencia || {};
    if (!ce.nombre_completo?.trim()) {
      throw new Error("Nombre de contacto de emergencia es obligatorio");
    }
    if (!ce.telefono || !PHONE_REGEX.test(ce.telefono)) {
      throw new Error(
        "Teléfono de emergencia inválido (usa formato internacional, ej. +51999999999)",
      );
    }
    if (!ce.relacion?.trim()) {
      throw new Error("Relación/parentesco es obligatorio");
    }

    const dr = formData.datosRolEspecifico || {};
    if (!dr.seguro_medico?.trim()) {
      throw new Error("Seguro médico es obligatorio");
    }
    if (!dr.grupo_sanguineo || !BLOOD_GROUPS.has(dr.grupo_sanguineo)) {
      throw new Error("Grupo sanguíneo inválido");
    }
  };

  const canSubmit =
    !!formData.password &&
    !!confirmPassword &&
    formData.password === confirmPassword &&
    !!formData.direccion_completa?.trim() &&
    !!formData.distrito?.trim() &&
    !!formData.ciudad?.trim() &&
    !!formData.referencia?.trim() &&
    !!formData.contacto_emergencia?.nombre_completo?.trim() &&
    !!formData.contacto_emergencia?.telefono?.trim() &&
    !!formData.contacto_emergencia?.relacion?.trim() &&
    !!formData.datosRolEspecifico?.seguro_medico?.trim() &&
    !!formData.datosRolEspecifico?.grupo_sanguineo;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      validateForm();
    } catch (err) {
      toast.error(err.message);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        password: formData.password,
        direccion_completa: formData.direccion_completa,
        distrito: formData.distrito,
        ciudad: formData.ciudad,
        referencia: formData.referencia,
        contacto_emergencia: formData.contacto_emergencia,
        datosRolEspecifico: formData.datosRolEspecifico,
      };

      const updated = await alumnoService.update(userId, payload);
      login(updated);
      toast.success("Datos actualizados correctamente");
      navigate("/dashboard/student");
    } catch (error) {
      toast.error(error.message || "Error en el proceso");
    } finally {
      setLoading(false);
    }
  };

  return (
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
                  <label
                    htmlFor="password"
                    className="text-[10px] font-black text-slate-500 uppercase ml-1"
                  >
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors"
                      size={16}
                    />
                    <input
                      id="password"
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
                  <label
                    htmlFor="confirm_password"
                    className="text-[10px] font-black text-slate-500 uppercase ml-1"
                  >
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <CheckCircle2
                      className={`absolute left-3 top-1/2 -translate-y-1/2 ${formData.password === confirmPassword && confirmPassword !== "" ? "text-green-500" : "text-slate-300"}`}
                      size={16}
                    />
                    <input
                      id="confirm_password"
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
                  <label
                    htmlFor="direccion_completa"
                    className="text-[10px] font-black text-slate-500 uppercase ml-1"
                  >
                    Dirección Completa
                  </label>
                  <div className="relative">
                    <Home
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors"
                      size={16}
                    />
                    <input
                      id="direccion_completa"
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
                  <label
                    htmlFor="distrito"
                    className="text-[10px] font-black text-slate-500 uppercase ml-1"
                  >
                    Distrito
                  </label>
                  <input
                    id="distrito"
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
                  <label
                    htmlFor="ciudad"
                    className="text-[10px] font-black text-slate-500 uppercase ml-1"
                  >
                    Ciudad
                  </label>
                  <input
                    id="ciudad"
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
                  <label
                    htmlFor="referencia"
                    className="text-[10px] font-black text-slate-500 uppercase ml-1"
                  >
                    Referencia
                  </label>
                  <div className="relative">
                    <Zap
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors"
                      size={16}
                    />
                    <input
                      id="referencia"
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
                <UserPlus size={14} strokeWidth={3} /> CONTACTO DE EMERGENCIA
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
          <div className="space-y-6 pt-2">
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-black uppercase tracking-widest shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Activity className="animate-spin" size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              {loading ? "Procesando..." : "Completar Registro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRegistration;
