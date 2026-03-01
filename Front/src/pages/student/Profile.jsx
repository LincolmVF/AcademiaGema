import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Edit2, Shield, User, Star, ArrowLeft, X, Save, Loader2, HeartPulse } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import apiFetch from '../../interceptors/api.js'; // Ajusta la ruta si es necesario
import toast from 'react-hot-toast';

// ==========================================
// MODAL DE EDICIÓN DE PERFIL
// ==========================================
const EditProfileModal = ({ isOpen, onClose, currentUser, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    telefono_personal: '',
    fecha_nacimiento: '',
    condiciones_medicas: '',
    seguro_medico: '',
    grupo_sanguineo: '',
    direccion_completa: '',
    distrito: '',
    ciudad: 'Lima',
    referencia: ''
  });

  // Cargar datos actuales al abrir el modal
  useEffect(() => {
    if (currentUser && isOpen) {
      const alumnoData = currentUser.alumnos || {};
      const dirData = alumnoData.direcciones || {};
      
      setFormData({
        email: currentUser.email || '',
        telefono_personal: currentUser.telefono_personal || '',
        // Formatear fecha a YYYY-MM-DD para el input type="date"
        fecha_nacimiento: currentUser.fecha_nacimiento ? currentUser.fecha_nacimiento.split('T')[0] : '',
        condiciones_medicas: alumnoData.condiciones_medicas || '',
        seguro_medico: alumnoData.seguro_medico || '',
        grupo_sanguineo: alumnoData.grupo_sanguineo || '',
        direccion_completa: dirData.direccion_completa || '',
        distrito: dirData.distrito || '',
        ciudad: dirData.ciudad || 'Lima',
        referencia: dirData.referencia || ''
      });
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Llamamos a la API usando tu apiFetch
      const response = await apiFetch.put('/alumno/mi-perfil', formData);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al actualizar perfil");
      }

      toast.success("¡Perfil actualizado con éxito!");
      if (onSuccess) onSuccess(result.data); // Pasamos la nueva data para actualizar el Context
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0f172a]/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 my-8">
        {/* HEADER MODAL */}
        <div className="bg-[#1e3a8a] p-8 text-white flex justify-between items-center sticky top-0 z-10">
          <div>
            <h3 className="font-black uppercase italic text-2xl">Editar <span className="text-orange-500">Perfil</span></h3>
            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1 italic">Club Gema - Tus Datos</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-xl transition-colors"><X size={20} /></button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* SECCIÓN: CONTACTO */}
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
              <Phone size={14} className="text-[#1e3a8a]" /> Datos de Contacto
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Teléfono / WhatsApp</label>
                <input type="text" value={formData.telefono_personal} onChange={e => setFormData({...formData, telefono_personal: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" placeholder="Ej: 987654321"/>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Correo Electrónico</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Fecha de Nacimiento</label>
                <input type="date" value={formData.fecha_nacimiento} onChange={e => setFormData({...formData, fecha_nacimiento: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" />
              </div>
            </div>
          </div>

          {/* SECCIÓN: MÉDICA */}
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2 mt-6">
              <HeartPulse size={14} className="text-orange-500" /> Información Médica
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Condiciones Médicas / Alergias</label>
                <input type="text" value={formData.condiciones_medicas} onChange={e => setFormData({...formData, condiciones_medicas: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" placeholder="Ninguna" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Seguro Médico</label>
                <input type="text" value={formData.seguro_medico} onChange={e => setFormData({...formData, seguro_medico: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" placeholder="Ej: EsSalud, EPS Pacifico..." />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Grupo Sanguíneo</label>
                <select value={formData.grupo_sanguineo} onChange={e => setFormData({...formData, grupo_sanguineo: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500">
                  <option value="">Seleccionar</option>
                  <option value="O+">O+</option><option value="O-">O-</option>
                  <option value="A+">A+</option><option value="A-">A-</option>
                  <option value="B+">B+</option><option value="B-">B-</option>
                  <option value="AB+">AB+</option><option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECCIÓN: DIRECCIÓN */}
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2 mt-6">
              <MapPin size={14} className="text-[#1e3a8a]" /> Dirección
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Dirección Completa</label>
                <input type="text" value={formData.direccion_completa} onChange={e => setFormData({...formData, direccion_completa: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" placeholder="Av. Principal 123" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Distrito</label>
                <input type="text" value={formData.distrito} onChange={e => setFormData({...formData, distrito: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" placeholder="Ej: Los Olivos" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Referencia</label>
                <input type="text" value={formData.referencia} onChange={e => setFormData({...formData, referencia: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500" placeholder="Cerca al parque..." />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#1e3a8a] hover:bg-orange-600 text-white font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 shadow-xl shadow-blue-900/10 mt-8">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL (PROFILE)
// ==========================================
const Profile = () => {
  const { user, updateUserData } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Navegación segura por el objeto user.user
  const currentUser = user?.user || {};
  const alumnosData = currentUser.alumnos || {};
  const direccionesData = alumnosData.direcciones || {};

  const fullName = `${currentUser.nombres || ''} ${currentUser.apellidos || ''}`.trim() || 'Alumno Gema';
  const userInitial = currentUser.nombres?.charAt(0).toUpperCase() || 'G';
  const userRole = currentUser.rol || 'Alumno';
  
  // Variables mapeadas a la Base de Datos real
  const userEmail = currentUser.email || 'No registrado';
  const userPhone = currentUser.telefono_personal || 'No registrado';
  const userAddress = direccionesData.direccion_completa 
    ? `${direccionesData.direccion_completa}, ${direccionesData.distrito || ''}` 
    : 'Dirección no registrada';
  const userMedical = alumnosData.condiciones_medicas || 'Ninguna registrada';

  // Función que se dispara cuando el backend responde Ok
  const handleProfileUpdate = (newData) => {
    // Magia de React: Actualizamos el AuthContext y la UI se repinta al instante
    updateUserData(newData);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 animate-fade-in-up pb-20">
      <Link to="/dashboard/student" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#1e3a8a] transition-all mb-4 text-[10px] font-black uppercase tracking-widest italic">
        <ArrowLeft size={14} /> Volver
      </Link>

      {/* HEADER DE SECCIÓN */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-black text-[#1e3a8a] uppercase tracking-tighter italic">
          Mi <span className="text-orange-500">Perfil</span>
        </h1>
        <div className="h-1.5 w-20 bg-orange-500 rounded-full mt-2 shadow-[0_2px_10px_rgba(249,115,22,0.3)] mx-auto md:mx-0"></div>
      </div>

      {/* CABECERA PERFIL */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/60 mb-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none">
          <img src="/logo.png" alt="" className="w-40 h-auto rotate-12" />
        </div>

        {/* BOTÓN MAGICO DE EDITAR */}
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="absolute top-6 right-6 text-slate-300 hover:text-orange-500 hover:bg-orange-50 p-2 rounded-xl transition-all duration-300"
        >
          <Edit2 size={20} strokeWidth={2.5} />
        </button>

        <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-[#1e40af] to-[#0f172a] border-4 border-white shadow-2xl flex items-center justify-center text-4xl font-black text-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
          {userInitial}
        </div>

        <div className="flex-1 relative z-10">
          <h2 className="text-3xl font-black text-[#1e3a8a] uppercase tracking-tighter italic">{fullName}</h2>
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs mt-1 italic">Academia Gema</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-4 py-1.5 rounded-xl flex items-center gap-2 uppercase tracking-widest border border-orange-200 shadow-sm">
              <Shield size={12} strokeWidth={3} /> {userRole}
            </span>
            <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-xl flex items-center gap-2 uppercase tracking-widest border border-blue-100 shadow-sm">
              <Star size={12} strokeWidth={3} /> Activo
            </span>
          </div>
        </div>
      </div>

      {/* BLOQUE DE DATOS PERSONALES */}
      <div className="space-y-4">
        {/* CORREO */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-5 group hover:border-[#1e3a8a]/20 transition-all duration-300">
          <div className="p-4 bg-blue-50 text-[#1e3a8a] rounded-2xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300 shadow-sm">
            <Mail size={22} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Correo Electrónico</p>
            <p className="font-bold text-[#1e3a8a] tracking-tight">{userEmail}</p>
          </div>
        </div>

        {/* TELÉFONO */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-5 group hover:border-[#1e3a8a]/20 transition-all duration-300">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
            <Phone size={22} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Teléfono / WhatsApp</p>
            <p className="font-bold text-[#1e3a8a] tracking-tight">{userPhone}</p>
          </div>
        </div>

        {/* DIRECCIÓN */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-5 group hover:border-[#1e3a8a]/20 transition-all duration-300">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <MapPin size={22} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Dirección de Residencia</p>
            <p className="font-bold text-[#1e3a8a] tracking-tight">{userAddress}</p>
          </div>
        </div>

        {/* MÉDICO */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-5 group hover:border-[#1e3a8a]/20 transition-all duration-300">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 shadow-sm">
            <HeartPulse size={22} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Alergias / Condiciones</p>
            <p className="font-bold text-[#1e3a8a] tracking-tight">{userMedical}</p>
          </div>
        </div>
      </div>

      {/* RENDERIZADO DEL MODAL */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        currentUser={currentUser}
        onSuccess={handleProfileUpdate}
      />
    </div>
  );
};

export default Profile;