import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Edit2, ArrowLeft, HeartPulse, Shield, Calendar, Activity, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import apiFetch from '../../interceptors/api.js';
import { API_ROUTES } from '../../constants/apiRoutes.js';
import EditProfileModal from '../../components/student/DataUsuario/EditProfileModal.jsx';

const Profile = () => {
  const { updateUserData } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 SINCRONIZACIÓN TOTAL: Trae usuarios + alumnos + direcciones
  const fetchProfile = async () => {
    try {
      const response = await apiFetch.get(API_ROUTES.ALUMNOS.MI_PERFIL);
      const result = await response.json();
      if (response.ok) setProfileData(result.data);
    } catch (error) {
      console.error("Error cargando expediente:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-orange-500" size={40} />
    </div>
  );

  const user = profileData || {};
  const alumnosData = user.alumnos || {};
  const direccionesData = alumnosData.direcciones || {};

  const fullName = `${user.nombres || ''} ${user.apellidos || ''}`.trim() || 'Atleta Gema';
  const userInitial = user.nombres?.charAt(0).toUpperCase() || 'G';

  const userBirth = user.fecha_nacimiento 
    ? new Date(user.fecha_nacimiento).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }) 
    : 'No registrada';

  const handleProfileUpdate = (newData) => {
    fetchProfile(); 
    if (updateUserData) updateUserData(newData);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-10 animate-fade-in pb-32">
      {/* Navegación Superior */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/dashboard/student" className="flex items-center gap-2 text-slate-400 hover:text-[#1e3a8a] transition-all group">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 group-hover:border-orange-200">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest italic">Volver al Panel</span>
        </Link>
      </div>

      {/* Hero Card Premium */}
      <div className="relative mb-12">
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
          <img src="/logo.png" className="absolute -right-20 -bottom-20 w-80 opacity-[0.05] rotate-12 pointer-events-none" alt="" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] md:rounded-[3rem] bg-white p-1 shadow-2xl transform rotate-3">
                <div className="w-full h-full rounded-[2.2rem] md:rounded-[2.8rem] bg-slate-100 flex items-center justify-center text-6xl font-black text-[#1e3a8a] italic">
                  {userInitial}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-orange-500 p-3 rounded-2xl shadow-xl border-4 border-[#1e3a8a]">
                <Shield size={20} fill="white" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                <div className="space-y-2">
                  <p className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] italic">Expediente Oficial Gema</p>
                  <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-tight">
                    {fullName}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                    <Badge label={`ID: #${user.id}`} />
                    <Badge label="Atleta Elite" active />
                  </div>
                </div>

                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="mx-auto md:mx-0 flex items-center gap-3 bg-orange-500 hover:bg-white hover:text-orange-500 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl active:scale-95 font-black text-xs uppercase tracking-widest border-2 border-transparent hover:border-orange-500"
                >
                  <Edit2 size={18} />
                  <span>Editar Perfil</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Datos: Diseño Horizontal y Robusto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* Columna Izquierda: Contacto */}
        <section className="space-y-6">
          <SectionHeader icon={<Activity />} title="Datos de Contacto" />
          <InfoCard icon={<Mail />} label="Email Principal" value={user.email} color="blue" />
          <InfoCard icon={<Phone />} label="Celular / WhatsApp" value={user.telefono_personal} color="orange" />
          <InfoCard icon={<Calendar />} label="Fecha de Nacimiento" value={userBirth} color="indigo" />
        </section>

        {/* Columna Derecha: Seguridad y Salud (TARJETAS GRANDES) */}
        <section className="space-y-6">
          <SectionHeader icon={<Shield />} title="Seguridad y Salud" />
          <InfoCard 
            icon={<MapPin />} 
            label="Dirección Actual" 
            value={direccionesData.direccion_completa} 
            subText={direccionesData.distrito ? `Distrito: ${direccionesData.distrito}` : null}
            color="blue" 
            isLarge 
          />
          <InfoCard 
            icon={<HeartPulse />} 
            label="Condición Médica" 
            value={alumnosData.condiciones_medicas || 'Atleta Saludable'} 
            color="rose"
            isLarge
            footer={`GS: ${alumnosData.grupo_sanguineo || 'N/A'} | Seguro: ${alumnosData.seguro_medico || 'Particular'}`}
          />
        </section>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={user} // Pasamos el objeto completo para pre-llenar
        onSuccess={handleProfileUpdate}
      />
    </div>
  );
};

/* --- Componentes UI Atómicos --- */

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 px-6 mb-2">
    <div className="text-orange-500">{icon}</div>
    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] italic">{title}</h3>
  </div>
);

const Badge = ({ label, active }) => (
  <span className={`text-[10px] font-bold px-5 py-2 rounded-full uppercase tracking-widest ${active ? 'bg-orange-500 shadow-lg shadow-orange-500/20' : 'bg-white/10 border border-white/20'}`}>
    {label}
  </span>
);

const InfoCard = ({ icon, label, value, color, footer, subText, isLarge }) => {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    indigo: "bg-indigo-50 text-indigo-600",
    rose: "bg-rose-50 text-rose-600"
  };

  return (
    <div className={`bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 group transition-all duration-300 ${isLarge ? 'border-orange-100 ring-4 ring-orange-50/50' : ''}`}>
      <div className="flex items-start gap-6">
        <div className={`shrink-0 p-4 md:p-5 rounded-2xl transition-all group-hover:bg-orange-500 group-hover:text-white ${styles[color]}`}>
          {React.cloneElement(icon, { size: isLarge ? 28 : 22, strokeWidth: 2.5 })}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">{label}</p>
          <p className={`font-black text-[#1e3a8a] tracking-tight break-words ${isLarge ? 'text-lg md:text-xl' : 'text-sm'}`}>
            {value || 'Pendiente de registro'}
          </p>
          {subText && <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tighter italic">{subText}</p>}
          {footer && (
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase italic tracking-widest">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;